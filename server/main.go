package main

import (
	"embed"
	"flag"
	"fmt"
	"hash/fnv"
	"image"
	"image/color"
	"image/draw"
	"image/png"
	"io/fs"
	"log"
	"math/rand/v2"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"

	xdraw "golang.org/x/image/draw"
)

//go:embed all:public
var embeddedFS embed.FS

var version = "dev"

const (
	defaultCharWidth  = 8
	defaultCharHeight = 8
	charOffset        = 32
	stringLimit       = 100
	maxScale          = 6
)

// fontCache holds preloaded font images to avoid repeated PNG decoding.
type fontCache struct {
	mu    sync.RWMutex
	fonts map[string]*image.RGBA
}

func newFontCache() *fontCache {
	return &fontCache{fonts: make(map[string]*image.RGBA)}
}

func (fc *fontCache) get(key string) (*image.RGBA, bool) {
	fc.mu.RLock()
	defer fc.mu.RUnlock()
	img, ok := fc.fonts[key]
	return img, ok
}

func (fc *fontCache) set(key string, img *image.RGBA) {
	fc.mu.Lock()
	defer fc.mu.Unlock()
	fc.fonts[key] = img
}

// server holds all shared state for request handling.
type server struct {
	contentFS fs.FS
	cacheDir  string
	noCache   bool
	fc        *fontCache
}

func (s *server) loadPNG(path string) (image.Image, error) {
	f, err := s.contentFS.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()
	return png.Decode(f)
}

func (s *server) loadFont(path string) (*image.RGBA, error) {
	if img, ok := s.fc.get(path); ok {
		return img, nil
	}
	raw, err := s.loadPNG(path)
	if err != nil {
		return nil, err
	}
	rgba := toRGBA(raw)
	s.fc.set(path, rgba)
	return rgba, nil
}

func (s *server) listFontFiles(dir string) ([]string, error) {
	entries, err := fs.ReadDir(s.contentFS, dir)
	if err != nil {
		return nil, err
	}
	var files []string
	for _, e := range entries {
		if !e.IsDir() && strings.HasSuffix(strings.ToLower(e.Name()), ".png") {
			files = append(files, e.Name())
		}
	}
	sort.Strings(files)
	return files, nil
}

func (s *server) findFontFile(dir, fontChoice string) (string, error) {
	entries, err := fs.ReadDir(s.contentFS, dir)
	if err != nil {
		return "", err
	}
	for _, e := range entries {
		if e.IsDir() {
			continue
		}
		prefix, _, _ := strings.Cut(e.Name(), ".")
		if prefix == fontChoice {
			return dir + "/" + e.Name(), nil
		}
	}
	return "", fmt.Errorf("font not found: %s", fontChoice)
}

type apiParams struct {
	text          string
	font          string
	charColor     int
	randomFont    bool
	randomColor   bool
	charWidth     int
	charHeight    int
	scale         int
	colorShift    [3]int
	hasColorShift bool
	bubble        string // "u" or "d"
	hasBubble     bool
	bubblePos     int
	bubbleTheme   string // "l" or "d"
	listFonts     bool
	countFonts    bool
	useLargeDir   bool
	outputFmt     string // "png" or "svg"
}

func parsePathParams(path string) map[string]string {
	out := make(map[string]string)
	path = strings.TrimPrefix(path, "/api/")
	path = strings.TrimPrefix(path, "/api.php/")
	for _, part := range strings.Split(path, "/") {
		if part == "" || part == ".png" {
			continue
		}
		key, value, found := strings.Cut(part, "-")
		if found {
			out[key] = value
		} else {
			out[key] = ""
		}
	}
	return out
}

func extractParams(r *http.Request) apiParams {
	p := apiParams{
		text:        "NULL",
		font:        "taitoa",
		charWidth:   defaultCharWidth,
		charHeight:  defaultCharHeight,
		scale:       1,
		bubbleTheme: "l",
	}

	var get func(string) (string, bool)

	path := r.URL.Path
	if strings.Contains(path, "/y-") || strings.Contains(path, "/x-") ||
		strings.Contains(path, "/dbl-") || strings.Contains(path, "/z-") {
		params := parsePathParams(path)
		get = func(key string) (string, bool) {
			v, ok := params[key]
			return v, ok
		}
	} else {
		get = func(key string) (string, bool) {
			v := r.URL.Query().Get(key)
			if v == "" {
				_, exists := r.URL.Query()[key]
				return v, exists
			}
			return v, true
		}
	}

	if v, ok := get("x"); ok && v != "" {
		p.text = v
	}
	if v, ok := get("bt"); ok {
		if v == "d" {
			p.bubbleTheme = "d"
		} else {
			p.bubbleTheme = "l"
		}
	}
	if v, ok := get("y"); ok {
		if v == "r" {
			p.randomFont = true
		} else if v != "" {
			p.font = v
		}
	}
	if v, ok := get("z"); ok {
		if v == "r" {
			p.randomColor = true
		} else {
			p.charColor, _ = strconv.Atoi(v)
		}
	}
	if v, ok := get("dbl"); ok {
		p.scale, _ = strconv.Atoi(v)
		if p.scale <= 1 {
			p.scale = 2
		}
		if p.scale > maxScale {
			p.scale = maxScale
		}
	}
	if v, ok := get("w"); ok {
		p.charWidth, _ = strconv.Atoi(v)
		p.useLargeDir = true
	}
	if v, ok := get("h"); ok {
		p.charHeight, _ = strconv.Atoi(v)
		p.useLargeDir = true
	}
	if v, ok := get("cs"); ok && v != "" {
		parts := strings.Split(v, ".")
		if len(parts) >= 3 {
			p.colorShift[0], _ = strconv.Atoi(parts[0])
			p.colorShift[1], _ = strconv.Atoi(parts[1])
			p.colorShift[2], _ = strconv.Atoi(parts[2])
			p.hasColorShift = true
		}
	}
	if v, ok := get("b"); ok && v != "" && v != "none" {
		p.bubble = v
		p.hasBubble = true
	}
	if v, ok := get("bp"); ok {
		p.bubblePos, _ = strconv.Atoi(v)
	}
	if _, ok := get("list"); ok {
		p.listFonts = true
	}
	if _, ok := get("count"); ok {
		p.countFonts = true
	}
	if v, ok := get("f"); ok && v == "svg" {
		p.outputFmt = "svg"
	} else {
		p.outputFmt = "png"
	}

	return p
}

func sanitizeText(s string) string {
	var b strings.Builder
	for _, c := range s {
		if c >= 0x20 && c <= 0x7E {
			b.WriteRune(c)
		}
	}
	result := b.String()
	if len(result) > stringLimit {
		result = result[:stringLimit]
	}
	if result == "" {
		result = "Arcade Font Engine"
	}
	return result
}

func hashString(s string) string {
	h := fnv.New64a()
	h.Write([]byte(url.QueryEscape(s)))
	return fmt.Sprintf("%016x", h.Sum64())
}

func toRGBA(src image.Image) *image.RGBA {
	if rgba, ok := src.(*image.RGBA); ok {
		return rgba
	}
	bounds := src.Bounds()
	dst := image.NewRGBA(bounds)
	draw.Draw(dst, bounds, src, bounds.Min, draw.Src)
	return dst
}

func newTransparentRGBA(w, h int) *image.RGBA {
	return image.NewRGBA(image.Rect(0, 0, w, h))
}

func renderString(dst, src *image.RGBA, text string, charW, charH, charColor, hOffset, vOffset int) {
	for i, ch := range text {
		asciiNo := int(ch)
		if asciiNo < charOffset || asciiNo > 126 {
			continue
		}
		dstX := hOffset + (charW * i)
		srcX := (asciiNo - charOffset) * charW
		srcY := charColor * charH
		draw.Draw(dst,
			image.Rect(dstX, vOffset, dstX+charW, vOffset+charH),
			src,
			image.Pt(srcX, srcY),
			draw.Over,
		)
	}
}

func applyColorShift(img *image.RGBA, rs, gs, bs int) {
	bounds := img.Bounds()
	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			r, g, b, a := img.At(x, y).RGBA()
			if a == 0 {
				continue
			}
			img.SetRGBA(x, y, color.RGBA{
				clampU8(int(r>>8) + rs),
				clampU8(int(g>>8) + gs),
				clampU8(int(b>>8) + bs),
				uint8(a >> 8),
			})
		}
	}
}

func clampU8(v int) uint8 {
	if v < 0 {
		return 0
	}
	if v > 255 {
		return 255
	}
	return uint8(v)
}

func scaleNearest(src *image.RGBA, factor int) *image.RGBA {
	if factor <= 1 {
		return src
	}
	bounds := src.Bounds()
	dst := newTransparentRGBA(bounds.Dx()*factor, bounds.Dy()*factor)
	xdraw.NearestNeighbor.Scale(dst, dst.Bounds(), src, src.Bounds(), xdraw.Src, nil)
	return dst
}

// toPaletted converts an RGBA image to a paletted image for smaller PNGs.
// Falls back to RGBA if the image has more than 256 unique colors.
func toPaletted(img *image.RGBA) image.Image {
	bounds := img.Bounds()
	colors := make(map[color.RGBA]uint8)
	var palette color.Palette

	// Collect unique colors
	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			c := img.RGBAAt(x, y)
			if _, ok := colors[c]; !ok {
				if len(palette) >= 256 {
					return img
				}
				colors[c] = uint8(len(palette))
				palette = append(palette, c)
			}
		}
	}

	pImg := image.NewPaletted(bounds, palette)
	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			pImg.SetColorIndex(x, y, colors[img.RGBAAt(x, y)])
		}
	}
	return pImg
}

func shortHex(r, g, b uint8) string {
	if r>>4 == r&0xf && g>>4 == g&0xf && b>>4 == b&0xf {
		return fmt.Sprintf("#%x%x%x", r&0xf, g&0xf, b&0xf)
	}
	return fmt.Sprintf("#%02x%02x%02x", r, g, b)
}

type svgRect struct {
	x, y, w, h int
	opacity     string
}

func rgbaToSVG(img *image.RGBA, pixelSize int) []byte {
	bounds := img.Bounds()
	w := bounds.Dx()
	h := bounds.Dy()
	svgW := w * pixelSize
	svgH := h * pixelSize

	// Group rects by color
	groups := make(map[string][]svgRect)
	var order []string

	for y := 0; y < h; y++ {
		x := 0
		for x < w {
			r, g, b, a := img.At(bounds.Min.X+x, bounds.Min.Y+y).RGBA()
			if a == 0 {
				x++
				continue
			}
			run := 1
			for x+run < w {
				r2, g2, b2, a2 := img.At(bounds.Min.X+x+run, bounds.Min.Y+y).RGBA()
				if r2 == r && g2 == g && b2 == b && a2 == a {
					run++
				} else {
					break
				}
			}
			hex := shortHex(uint8(r>>8), uint8(g>>8), uint8(b>>8))
			opacity := ""
			if a < 0xffff {
				opacity = fmt.Sprintf(` opacity="%.3f"`, float64(a)/0xffff)
			}
			key := hex + opacity
			if _, ok := groups[key]; !ok {
				order = append(order, key)
			}
			groups[key] = append(groups[key], svgRect{x * pixelSize, y * pixelSize, run * pixelSize, pixelSize, opacity})
			x += run
		}
	}

	var buf strings.Builder
	buf.WriteString(fmt.Sprintf(`<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" shape-rendering="crispEdges">`, svgW, svgH))

	for _, key := range order {
		rects := groups[key]
		// Extract fill from key
		fill := key
		opacity := ""
		if len(rects) > 0 {
			fill = strings.TrimSuffix(key, rects[0].opacity)
			opacity = rects[0].opacity
		}
		if len(rects) == 1 {
			r := rects[0]
			buf.WriteString(fmt.Sprintf(`<rect x="%d" y="%d" width="%d" height="%d" fill="%s"%s/>`, r.x, r.y, r.w, r.h, fill, opacity))
		} else {
			buf.WriteString(fmt.Sprintf(`<g fill="%s"%s>`, fill, opacity))
			for _, r := range rects {
				buf.WriteString(fmt.Sprintf(`<rect x="%d" y="%d" width="%d" height="%d"/>`, r.x, r.y, r.w, r.h))
			}
			buf.WriteString("</g>")
		}
	}

	buf.WriteString("</svg>")
	return []byte(buf.String())
}

func (s *server) applyBubble(img *image.RGBA, p apiParams) *image.RGBA {
	themePath := "images/bubble/" + p.bubbleTheme

	dir := "top"
	if p.bubble == "d" {
		dir = "bot"
	}
	side := "c"
	if p.bubblePos <= 40 {
		side = "l"
	} else if p.bubblePos >= 60 {
		side = "r"
	}

	pt, err := s.loadPNG(themePath + "/" + side + "-" + dir + ".png")
	if err != nil {
		log.Printf("bubble pointer load error: %v", err)
		return img
	}
	bgt, err := s.loadPNG(themePath + "/bg.png")
	if err != nil {
		log.Printf("bubble bg load error: %v", err)
		return img
	}

	width := img.Bounds().Dx()
	height := img.Bounds().Dy()

	// Step 1: stretch background, composite text on top
	step1 := newTransparentRGBA(width+4, height+8)
	xdraw.NearestNeighbor.Scale(step1, step1.Bounds(), bgt, bgt.Bounds(), xdraw.Src, nil)
	draw.Draw(step1, image.Rect(2, 4, 2+width, 4+height), img, image.Point{}, draw.Over)

	widthB := step1.Bounds().Dx()
	heightB := height + 8

	// Step 2: add left/right end caps
	step2 := newTransparentRGBA(widthB+8, heightB)
	draw.Draw(step2, image.Rect(4, 0, 4+widthB, heightB), step1, image.Point{}, draw.Over)
	if lft, err := s.loadPNG(themePath + "/l-end.png"); err == nil {
		draw.Draw(step2, image.Rect(0, 0, 4, 16), lft, lft.Bounds().Min, draw.Over)
	}
	if rgt, err := s.loadPNG(themePath + "/r-end.png"); err == nil {
		draw.Draw(step2, image.Rect(widthB+4, 0, widthB+8, 16), rgt, rgt.Bounds().Min, draw.Over)
	}

	// Step 3: add pointer
	step3 := newTransparentRGBA(step2.Bounds().Dx(), step2.Bounds().Dy()+8)
	var voffset, poffset int
	if p.bubble == "u" {
		voffset = 8
		poffset = 0
	} else {
		voffset = 0
		poffset = step2.Bounds().Dy() - 2
	}
	xpos := (width * p.bubblePos / 100) + 4
	draw.Draw(step3, image.Rect(0, voffset, step2.Bounds().Dx(), voffset+step2.Bounds().Dy()), step2, image.Point{}, draw.Over)
	ptBounds := pt.Bounds()
	draw.Draw(step3, image.Rect(xpos, poffset, xpos+ptBounds.Dx(), poffset+ptBounds.Dy()), pt, ptBounds.Min, draw.Over)

	return step3
}

func (s *server) handleAPI(w http.ResponseWriter, r *http.Request) {
	p := extractParams(r)
	p.text = sanitizeText(p.text)

	fontDir := "images/fonts"
	if p.useLargeDir {
		fontDir = "images/fonts/large"
	}

	fontFiles, err := s.listFontFiles(fontDir)
	if err != nil {
		http.Error(w, "cannot read font directory", http.StatusInternalServerError)
		return
	}
	numFonts := len(fontFiles)

	// Check disk cache
	var cacheFile string
	if !s.noCache && s.cacheDir != "" && (!p.listFonts || !p.countFonts) {
		h := hashString(p.text)
		bubblePart := ""
		if p.hasBubble {
			bubblePart = fmt.Sprintf("%s%d%s-", p.bubble, p.bubblePos, p.bubbleTheme)
		}
		scalePart := strconv.Itoa(p.scale)
		ext := ".png"
		contentType := "image/png"
		if p.outputFmt == "svg" {
			ext = ".svg"
			contentType = "image/svg+xml"
		}
		cacheFile = filepath.Join(s.cacheDir, fmt.Sprintf("%s-%d-%s-%s%s%s", p.font, p.charColor, scalePart, bubblePart, h, ext))
		if data, err := os.ReadFile(cacheFile); err == nil {
			w.Header().Set("Content-Type", contentType)
			w.Header().Set("X-Cache", "HIT")
			w.Write(data)
			return
		}
	}

	if p.countFonts {
		p.text = strconv.Itoa(numFonts)
	}

	// Random font
	if p.randomFont && numFonts > 0 {
		idx := rand.IntN(numFonts)
		prefix, _, _ := strings.Cut(fontFiles[idx], ".")
		p.font = prefix
	}

	fontFilePath, err := s.findFontFile(fontDir, p.font)
	if err != nil {
		http.Error(w, "font not found: "+p.font, http.StatusNotFound)
		return
	}

	// Random color
	if p.randomColor {
		srcImg, err := s.loadFont(fontFilePath)
		if err == nil {
			zCount := srcImg.Bounds().Dy() / p.charHeight
			if zCount > 0 {
				p.charColor = rand.IntN(zCount)
			}
		}
	}

	// Compute dimensions
	var imgW, imgH int
	if p.listFonts {
		maxLen := 0
		for _, f := range fontFiles {
			_, name, _ := strings.Cut(f, "-")
			name = strings.TrimSuffix(name, ".png")
			if len(name) > maxLen {
				maxLen = len(name)
			}
		}
		imgW = p.charWidth * maxLen
		imgH = (p.charHeight * numFonts) + (numFonts * 2)
	} else {
		imgW = p.charWidth * len(p.text)
		imgH = p.charHeight
	}
	if imgW <= 0 || imgH <= 0 {
		http.Error(w, "invalid dimensions", http.StatusBadRequest)
		return
	}

	out := newTransparentRGBA(imgW, imgH)

	if p.listFonts {
		for i, fontFile := range fontFiles {
			srcImg, err := s.loadFont(fontDir + "/" + fontFile)
			if err != nil {
				continue
			}
			_, name, found := strings.Cut(fontFile, "-")
			if found {
				name = strings.TrimSuffix(name, ".png")
			} else {
				name = strings.TrimSuffix(fontFile, ".png")
			}
			vpos := (p.charHeight + 2) * i
			renderString(out, srcImg, name, p.charWidth, p.charHeight, p.charColor, 0, vpos)
		}
	} else {
		srcImg, err := s.loadFont(fontFilePath)
		if err != nil {
			http.Error(w, "cannot load font image", http.StatusInternalServerError)
			return
		}
		renderString(out, srcImg, p.text, p.charWidth, p.charHeight, p.charColor, 0, 0)
	}

	if p.hasColorShift {
		applyColorShift(out, p.colorShift[0], p.colorShift[1], p.colorShift[2])
	}
	if p.hasBubble {
		out = s.applyBubble(out, p)
	}

	if p.outputFmt == "svg" {
		pixelSize := p.scale
		if pixelSize < 1 {
			pixelSize = 1
		}
		svgData := rgbaToSVG(out, pixelSize)
		w.Header().Set("Content-Type", "image/svg+xml")
		if cacheFile != "" {
			w.Header().Set("X-Cache", "MISS")
			os.WriteFile(cacheFile, svgData, 0o644)
		}
		w.Write(svgData)
		return
	}

	if p.scale > 1 {
		out = scaleNearest(out, p.scale)
	}

	// Write to cache and response
	enc := &png.Encoder{CompressionLevel: png.BestCompression}
	pImg := toPaletted(out)
	w.Header().Set("Content-Type", "image/png")
	if cacheFile != "" {
		w.Header().Set("X-Cache", "MISS")
		if f, err := os.Create(cacheFile); err == nil {
			enc.Encode(f, pImg)
			f.Close()
		}
	}
	enc.Encode(w, pImg)
}

// loggingMiddleware logs each request with method, path, status, and duration.
func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		rw := &responseWriter{ResponseWriter: w, status: 200}
		next.ServeHTTP(rw, r)
		log.Printf("%s %s %d %s", r.Method, r.URL.Path, rw.status, time.Since(start).Round(time.Microsecond))
	})
}

type responseWriter struct {
	http.ResponseWriter
	status int
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.status = code
	rw.ResponseWriter.WriteHeader(code)
}


func usage() {
	fmt.Fprintf(os.Stderr, `Usage: %s [OPTIONS]

A pixel font text rendering server

OPTIONS
  -p, --port PORT        listen port (default: 8080)
  -H, --host ADDR        bind address (default: 0.0.0.0)
  -c, --cache-dir DIR    cache directory (default: OS temp dir)
  -n, --no-cache         disable image caching
  -r, --root DIR         serve from disk instead of embedded (dev mode)
  -v, --version          print version and exit
  -h, --help             show this help
`, os.Args[0])
}

func main() {
	var (
		port        int
		host        string
		cacheDir    string
		noCache     bool
		root        string
		showVersion bool
	)

	flag.IntVar(&port, "port", 8080, "")
	flag.IntVar(&port, "p", 8080, "")
	flag.StringVar(&host, "host", "0.0.0.0", "")
	flag.StringVar(&host, "H", "0.0.0.0", "")
	flag.StringVar(&cacheDir, "cache-dir", "", "")
	flag.StringVar(&cacheDir, "c", "", "")
	flag.BoolVar(&noCache, "no-cache", false, "")
	flag.BoolVar(&noCache, "n", false, "")
	flag.StringVar(&root, "root", "", "")
	flag.StringVar(&root, "r", "", "")
	flag.BoolVar(&showVersion, "version", false, "")
	flag.BoolVar(&showVersion, "v", false, "")

	flag.Usage = usage
	flag.Parse()

	if showVersion {
		fmt.Println("arcade-font-engine", version)
		return
	}

	// Resolve content filesystem
	var contentFS fs.FS
	if root != "" {
		contentFS = os.DirFS(root)
		log.Printf("Serving from disk: %s", root)
	} else {
		sub, err := fs.Sub(embeddedFS, "public")
		if err != nil {
			log.Fatalf("embedded filesystem error: %v", err)
		}
		contentFS = sub
		log.Print("Serving from embedded filesystem")
	}

	// Resolve cache directory
	resolvedCacheDir := cacheDir
	if noCache {
		resolvedCacheDir = ""
		log.Print("Caching disabled")
	} else if resolvedCacheDir == "" {
		resolvedCacheDir = filepath.Join(os.TempDir(), "arcade-font-engine-cache")
		os.MkdirAll(resolvedCacheDir, 0o755)
		log.Printf("Cache directory: %s", resolvedCacheDir)
	} else {
		os.MkdirAll(resolvedCacheDir, 0o755)
		log.Printf("Cache directory: %s", resolvedCacheDir)
	}

	srv := &server{
		contentFS: contentFS,
		cacheDir:  resolvedCacheDir,
		noCache:   noCache,
		fc:        newFontCache(),
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/api/", srv.handleAPI)
	mux.HandleFunc("/api.php/", srv.handleAPI)
	mux.HandleFunc("/api.php", srv.handleAPI)
	mux.Handle("/", http.FileServer(http.FS(contentFS)))

	addr := fmt.Sprintf("%s:%d", host, port)
	log.Printf("Arcade Font Engine %s listening on %s", version, addr)
	if err := http.ListenAndServe(addr, loggingMiddleware(mux)); err != nil {
		log.Fatal(err)
	}
}
