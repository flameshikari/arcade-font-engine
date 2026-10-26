## <p align="center"><img alt="Arcade Font Engine" src="./.github/assets/title.svg"/></p>

A pixel font text rendering engine with a web UI and HTTP API. Includes 174 arcade-style bitmap fonts with multiple styles, scaling, speech bubbles, color shifting, and SVG/PNG export.

Current application version: **1.1.0**.

[The original tool](https://nfggames.com/games/fontmaker/) was made by [NFG](https://nfgworld.com/). This project is a complete rewrite with a modern frontend, client-side Canvas rendering, and a Go backend that serves as both a static file server and an image rendering API. Notes and assets are left almost in their original form with some visual edits.

<br><br>

## <p align="center"><img alt="Installation" src="./.github/assets/install.svg"/></p>

### Docker

Available on [GHCR](https://github.com/flameshikari/arcade-font-engine/pkgs/container/arcade-font-engine) and [Docker Hub](https://hub.docker.com/r/flameshikari/arcade-font-engine) for amd64 and arm64.

#### CLI

```sh
docker run --rm -p 8080:8080 flameshikari/arcade-font-engine
```

#### docker-compose.yml

```yaml
services:
  arcade-font-engine:
    image: flameshikari/arcade-font-engine
    container_name: arcade-font-engine
    ports:
      - 8080:8080
```

The runtime uses Docker Hardened Alpine 3.23 and runs as `nonroot`. The binary
is installed at `/bin/arcade-font-engine`. Pass CLI options after the image name:

```sh
docker run --rm flameshikari/arcade-font-engine --help
```

For an already running Compose container, specify the executable explicitly:

```sh
docker exec arcade-font-engine /bin/arcade-font-engine --version
```

### Binary

Available for Linux, macOS and Windows for amd64 and arm64. Download a prebuilt binary from [Releases](https://github.com/flameshikari/arcade-font-engine/releases).

### Build

The pinned build toolchains are [Bun](https://bun.sh/) **1.4.4** and
[Go](https://go.dev/) **1.27.3**. The frontend build commands below use a POSIX
shell; release CI also produces binaries for macOS and Windows.

```sh
bun install --frozen-lockfile
bun run build:prod
cd server
rm -rf public
cp -r ../public ./public
go mod download
go mod verify
go build -ldflags="-s -w" -o arcade-font-engine .
./arcade-font-engine
```

<br><br>

## <p align="center"><img alt="Usage" src="./.github/assets/usage.svg"/></p>

### Web UI

- Text applies automatically after **0.5 seconds** without typing; input is limited
  to **100 printable ASCII characters**. SIZE ranges from **1 to 9**.
- The chosen logo, font, style, text and bubble settings persist in the browser's
  `sessionStorage`. **RESET**, at the top right of OUTPUT, clears the saved
  application settings and reloads the page.
- Click a GLYPHS or OUTPUT image to open Bigger Picture at the image's original position,
  or scroll up over the image to open and zoom directly. Hover shake is reset
  before opening and remains disabled while viewing.
- Drag to pan, use the wheel to zoom up to **8×**, and use the arrows or
  `←` / `→` to browse glyph rows. Browsing preserves the current position and zoom.
  Scroll down to return to the original position; after a short pause, scroll down
  again at the original size to close. The close button and `Esc` also exit.
- The viewer's top-left color picker samples the image's pixels and shows a
  swatch, HEX color and alpha. Outside the image it indicates transparency.
  PNG and SVG links in OUTPUT provide server-rendered exports.

The randomized Canvas background reveals over **0.66 seconds** and periodically
changes glyphs. Pixel transitions for text, viewer controls and menus last
**0.33 seconds**; tooltips use **0.15 seconds** for both appearance and dismissal.

### CLI

```
./arcade-font-engine [OPTIONS]

OPTIONS
  -p, --port PORT        listen port (default: 8080)
  -H, --host ADDR        bind address (default: 0.0.0.0)
  -c, --cache-dir DIR    cache directory (default: OS temp dir/arcade-font-engine-cache)
  -n, --no-cache         disable image caching
  -r, --root DIR         serve from disk instead of embedded (dev mode)
  -v, --version          print version and exit
  -h, --help             show this help
```

If binding to port 8080 fails, the server tries port 10240. The actual listening
addresses are printed on startup.

### API

Render text by constructing a URL with path-based parameters (as in the original project). Parameters can be in any order, see [Examples](#examples):

```
/api/y-{font}/z-{style}/x-{text}
```

Query parameters are also supported through `/api.php`, which is useful when
text contains path separators:

```
/api.php?y=arcade&z=0&dbl=3&x=HELLO%20WORLD
```

The API accepts `GET` and `HEAD`. URL-encode parameter values.

#### Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `y` | Font name, or `r` for random | `y-arcade` |
| `z` | Style index (0-based), or `r` for random | `z-0` |
| `x` | Text, up to 100 printable ASCII characters | `x-HELLO` |
| `dbl` | Scale factor (2–9); omit for 1× | `dbl-3` |
| `f` | Output format (`svg` or `png`) | `f-svg` |
| `b` | Bubble direction (`u` = up, `d` = down) | `b-d` |
| `bp` | Bubble pointer position (0-100) | `bp-25` |
| `bt` | Bubble theme (`l` = light, `d` = dark) | `bt-l` |
| `cs` | Color shift as `R.G.B`, each component −255 to 255 | `cs-50.0.-50` |
| `w` | Character width (1–64, custom large fonts) | `w-16` |
| `h` | Character height (1–64, custom large fonts) | `h-16` |
| `list` | List all available fonts | `list` |
| `count` | Return font count as text | `count` |

When `dbl` is supplied, its integer value is clamped to 2–9. The web UI also
allows 1× by omitting it. Unsupported text characters are removed; excess text
is truncated to 100 characters. Invalid numeric parameters and out-of-range
style indices are rejected.

`w` and `h` select `images/fonts/large` in the asset root. This directory is not
included in the bundled 8×8 font collection; these parameters require custom
large-font assets.

#### Examples

```
/api/dbl-3/y-arcade/z-0/x-HELLO%20WORLD
/api/dbl-2/b-d/bt-l/bp-25/y-arcade/z-1/x-SAMPLE%20TEXT
/api/dbl-3/f-svg/y-arcade/z-0/x-VECTOR%20TEXT
/api/y-r/z-r/x-RANDOM%20FONT
```

### Web keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + M` | Font selection |
| `Ctrl + ↑↓` | Change font |
| `Ctrl + ←→` | Change style |
| `Ctrl + -+` | Change size |
| `Ctrl + \` | Toggle bubble |
| `Ctrl + []` | Bubble position |
| `Ctrl + '` | Flip bubble |
| `Ctrl + ;` | Dark bubble |
| `Ctrl + F` | Focus input |
| `Ctrl + L` | Clear input |
| `Esc` | Unfocus input |


### Browser compatibility checks

The current `browserslist` query in `package.json` is `> 0.01%` and `not dead`.
Run `bun run check:compat` to see its resolved targets and selected DOM polyfills.
This query is the single source of browser targets
for both development and production builds. The resolved query drives Babel
(including a final pass over bundled dependencies and generated wrappers),
esbuild's HTML script targets, and PostCSS preset-env/Autoprefixer.

`core-js/stable` runs before application code; Babel includes only the standard
library polyfills required by the selected targets. ResizeObserver, Pointer
Events (including touch dragging), and DOM manipulation shims are bundled only
when needed. jQuery 3.x preserves compatibility with older selected browsers.

`bun run check:compat` validates native prerequisites, lints application APIs and
runs compatibility tests. The final JS bundle is also checked for known browser
APIs in dependencies. Targets lacking essential native Canvas, Flexbox, CSS
variables, masks, or clipping support fail with the affected browser versions;
they are never silently removed from the query. Vendor prefixes and explicit
fallbacks cover the admitted prefixed/partial implementations.

```sh
bun run build:prod
bunx playwright install --with-deps chromium firefox webkit
bun run test:browser
```

Release CI runs the built page in Chromium, Firefox and WebKit, plus a WebKit
case with selected legacy APIs removed to exercise the polyfills and touch pan.
These checks do not replace testing on every historical browser/device; the
fallback case simulates missing APIs and is not an actual old iOS engine.

### Resource limits and caching

The API accepts up to 100 printable ASCII characters and scale factors up to 9.
The browser applies the same text limit before rendering or restoring a session.
Images are limited to **4,000,000 pixels** after scaling and bubble padding,
with no dimension exceeding **32,768 pixels** and at most **four concurrent API
renders**. Oversized images or invalid rendering parameters return `400`; a busy
renderer returns `503` with `Retry-After: 1`. Request URIs longer than **16 KiB**
return `414`, and unsupported API methods return `405`.

The HTTP server uses a 5-second header timeout, 10-second read timeout,
30-second write timeout and 60-second idle timeout. Text responses, including
HTML, CSS, JavaScript and SVG, use gzip when accepted by the client and large
enough to compress; PNG is already compressed and is excluded.

The disk cache stores at most 64 MiB and 1024 images, expires entries after
24 hours, and evicts the oldest entries when full. Writes use atomic replacement.
Keys use SHA-256 over all rendering parameters and the application version;
random font or color requests bypass the cache. API responses expose
`X-Cache: HIT` or `X-Cache: MISS` when disk caching is used. Recognized legacy
cache files are removed on startup. Unrelated files in a custom cache directory are left untouched.
Use a separate cache directory for each server process.

Built CSS, JavaScript, icons and other static assets are stored in `assets/`.
Their filenames use the first **8 lowercase hexadecimal characters of the file's
SHA-256**, followed by the extension; collisions fail the build. `index.html` and
`asset-manifest.json` remain at the build root.

Hashed static assets are cached for one year with `immutable`; HTML is
revalidated, and API responses are marked `no-store`. The server sets CSP,
anti-framing, MIME-sniffing, referrer and permissions headers. Inline styles
remain allowed because the sliders and pixel animations set styles dynamically;
inline JavaScript is blocked.

Frontend renders and decoded previews use bounded in-memory caches. Build with
`bun install --frozen-lockfile`; commit `bun.lock` and `server/go.sum` when
updating dependencies. Docker base images are pinned by digest and Actions by
commit SHA, so dependency updates must also update those pins.

Server checks:

```sh
cd server
go test -race ./...
go vet ./...
```
