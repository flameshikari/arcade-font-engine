package main

import (
	"bytes"
	"fmt"
	"hash/fnv"
	"image"
	"image/color"
	"image/png"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"testing"
	"testing/fstest"
	"time"
)

func testServer(t *testing.T) *server {
	t.Helper()
	img := image.NewRGBA(image.Rect(0, 0, 95*8, 64))
	for y := 0; y < 64; y++ {
		for x := 0; x < 95*8; x++ {
			img.SetRGBA(x, y, color.RGBA{100, uint8(20 + y), 200, 255})
		}
	}
	var buf bytes.Buffer
	if err := png.Encode(&buf, img); err != nil {
		t.Fatal(err)
	}
	dir := t.TempDir()
	return &server{contentFS: fstest.MapFS{
		"images/fonts/arcade.png":       {Data: buf.Bytes()},
		"images/fonts/large/arcade.png": {Data: buf.Bytes()},
	}, fc: newFontCache(), disk: newDiskCache(dir), cacheDir: dir, renders: make(chan struct{}, 4)}
}
func apiRequest(s *server, query string) *httptest.ResponseRecorder {
	w := httptest.NewRecorder()
	s.handleAPI(w, httptest.NewRequest("GET", "/api.php?y=arcade&x=TEST&"+query, nil))
	return w
}
func TestCacheParameters(t *testing.T) {
	s := testServer(t)
	base := apiRequest(s, "")
	if base.Code != 200 || base.Header().Get("X-Cache") != "MISS" {
		t.Fatalf("base: %d %s", base.Code, base.Body.String())
	}
	for _, q := range []string{"cs=20.0.0", "list", "count", "w=8&h=8", "f=svg", "dbl=2", "z=1"} {
		first := apiRequest(s, q)
		if first.Code != 200 || first.Header().Get("X-Cache") != "MISS" {
			t.Fatalf("%s: %d %s", q, first.Code, first.Body.String())
		}
		second := apiRequest(s, q)
		if second.Header().Get("X-Cache") != "HIT" || !bytes.Equal(first.Body.Bytes(), second.Body.Bytes()) {
			t.Fatalf("cache mismatch: %s", q)
		}
	}
	for _, q := range []string{"y=r", "z=r"} {
		w := apiRequest(s, q)
		// Query.Get takes the first value, so font randomization uses its own request.
		if q == "y=r" {
			w = httptest.NewRecorder()
			s.handleAPI(w, httptest.NewRequest("GET", "/api.php?y=r&x=TEST", nil))
		}
		if w.Code != 200 || w.Header().Get("X-Cache") != "" {
			t.Fatalf("random cached: %s", q)
		}
	}
}
func TestTraversalRejected(t *testing.T) {
	s := testServer(t)
	hash := fnv.New64a()
	hash.Write([]byte("TEST"))
	outside := filepath.Join(filepath.Dir(s.cacheDir), fmt.Sprintf("probe-0-1-%016x.png", hash.Sum64()))
	if err := os.WriteFile(outside, []byte("PRIVATE"), 0600); err != nil {
		t.Fatal(err)
	}
	w := httptest.NewRecorder()
	s.handleAPI(w, httptest.NewRequest("GET", "/api.php?y=..%2Fprobe&x=TEST", nil))
	if w.Code != 404 || strings.Contains(w.Body.String(), "PRIVATE") {
		t.Fatalf("traversal: %d %s", w.Code, w.Body.String())
	}
	if s.disk.write("../escape.png", []byte("bad")) != nil {
		t.Fatal("invalid cache write")
	}
	if _, ok := s.disk.read("../escape.png"); ok {
		t.Fatal("invalid cache read")
	}
	files, _ := os.ReadDir(s.cacheDir)
	if len(files) != 0 {
		t.Fatal("traversal created file")
	}
}
func TestRenderLimits(t *testing.T) {
	s := testServer(t)
	for _, q := range []string{"z=invalid", "cs=1.2", "dbl=999999999999999999999", "w=-1", "h=0", "w=65", "bp=101", "b=../bad", "z=-1", "z=999", "cs=999.0.0", "w=64&h=64&dbl=9&x=" + strings.Repeat("A", 100)} {
		w := apiRequest(s, q)
		if strings.HasPrefix(q, "w=64") {
			w = httptest.NewRecorder()
			s.handleAPI(w, httptest.NewRequest("GET", "/api.php?y=arcade&w=64&h=64&dbl=9&x="+strings.Repeat("A", 100), nil))
		}
		if w.Code != 400 {
			t.Fatalf("accepted %s: %d", q, w.Code)
		}
	}
	for i := 0; i < cap(s.renders); i++ {
		s.renders <- struct{}{}
	}
	if w := apiRequest(s, ""); w.Code != 503 || w.Header().Get("Retry-After") == "" {
		t.Fatal("render concurrency not limited")
	}
	w := httptest.NewRecorder()
	s.handleAPI(w, httptest.NewRequest("POST", "/api.php", nil))
	if w.Code != 405 {
		t.Fatal("POST accepted")
	}
}
func TestCacheAtomicityAndQuota(t *testing.T) {
	c := newDiskCache(t.TempDir())
	name := fmt.Sprintf("v2-%064x.png", 1)
	payload := bytes.Repeat([]byte("X"), 10000)
	var wg sync.WaitGroup
	for i := 0; i < 16; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for j := 0; j < 8; j++ {
				if err := c.write(name, payload); err != nil {
					t.Error(err)
				}
				if data, ok := c.read(name); ok && !bytes.Equal(data, payload) {
					t.Error("partial cache read")
				}
			}
		}()
	}
	wg.Wait()
	c.mu.Lock()
	entry := c.entries[name]
	entry.modified = time.Now().Add(-2 * cacheTTL)
	c.entries[name] = entry
	c.mu.Unlock()
	if _, ok := c.read(name); ok {
		t.Fatal("expired cache returned")
	}
	for i := 0; i < cacheMaxFiles+3; i++ {
		if err := c.write(fmt.Sprintf("v2-%064x.png", i), []byte("x")); err != nil {
			t.Fatal(err)
		}
	}
	if len(c.entries) > cacheMaxFiles || c.size > cacheMaxBytes {
		t.Fatal("cache quota exceeded")
	}
	// Verify byte quota independently of the file-count limit.
	c = newDiskCache(t.TempDir())
	chunk := bytes.Repeat([]byte("x"), 1<<20)
	for i := 0; i < 66; i++ {
		if err := c.write(fmt.Sprintf("v2-%064x.png", i), chunk); err != nil {
			t.Fatal(err)
		}
	}
	if c.size > cacheMaxBytes || len(c.entries) > 64 {
		t.Fatal("byte quota exceeded")
	}

}
func TestSecurityHeaders(t *testing.T) {
	handler := securityHeaders(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { w.Write([]byte("ok")) }))
	for _, path := range []string{"/", "/assets/1234abcd.js", "/api.php"} {
		w := httptest.NewRecorder()
		handler.ServeHTTP(w, httptest.NewRequest("GET", path, nil))
		if w.Header().Get("Content-Security-Policy") == "" || w.Header().Get("X-Content-Type-Options") != "nosniff" {
			t.Fatal("missing security headers")
		}
		expected := "no-store"
		if path == "/" {
			expected = "no-cache"
		}
		if strings.HasPrefix(path, "/assets/") {
			expected = "public, max-age=31536000, immutable"
		}
		if w.Header().Get("Cache-Control") != expected {
			t.Fatal("incorrect browser cache policy")
		}
	}
}

func TestCacheStartupAndSymlinks(t *testing.T) {
	dir := t.TempDir()
	name := fmt.Sprintf("v2-%064x.png", 42)
	legacy := filepath.Join(dir, "arcade-0-1-1234567890abcdef.png")
	os.WriteFile(legacy, []byte("old"), 0600)
	abandoned := filepath.Join(dir, ".afe-123456")
	os.WriteFile(abandoned, []byte("partial"), 0600)
	unrelated := filepath.Join(dir, "notes.txt")
	os.WriteFile(unrelated, []byte("keep"), 0600)
	c := newDiskCache(dir)
	if _, err := os.Stat(legacy); !os.IsNotExist(err) {
		t.Fatal("legacy cache not removed")
	}
	if _, err := os.Stat(abandoned); !os.IsNotExist(err) {
		t.Fatal("abandoned temporary cache not removed")
	}
	if _, err := os.Stat(unrelated); err != nil {
		t.Fatal("unrelated file removed")
	}
	if err := c.write(name, []byte("cached")); err != nil {
		t.Fatal(err)
	}
	restarted := newDiskCache(dir)
	if data, ok := restarted.read(name); !ok || string(data) != "cached" {
		t.Fatal("cache lost on restart")
	}
	os.Remove(filepath.Join(dir, name))
	if err := os.Symlink(unrelated, filepath.Join(dir, name)); err != nil {
		t.Skip("symlinks unavailable")
	}
	if _, ok := restarted.read(name); ok {
		t.Fatal("followed symlink")
	}
}
