## <p align="center"><img alt="Arcade Font Engine" src="./.github/assets/title.svg"/></p>

A pixel font text rendering engine with a web UI and HTTP API. Renders text using classic arcade-style bitmap fonts with support for multiple styles, scaling, speech bubbles, color shifting, and SVG/PNG export.

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

### Binary

Available for Linux, macOS and Windows for amd64 and arm64. Download a prebuilt binary from [Releases](./releases).

### Build

Requires [Bun](https://bun.sh/) and [Go](https://go.dev/) 1.27.3+.

```sh
bun install && bun run build:prod
cd server
cp -r ../public ./public
go mod tidy
go build -ldflags="-s -w" -o arcade-font-engine .
```

<br><br>

## <p align="center"><img alt="Usage" src="./.github/assets/usage.svg"/></p>

### CLI

```
./arcade-font-engine [OPTIONS]

OPTIONS
  -p, --port PORT        listen port (default: 8080)
  -H, --host ADDR        bind address (default: 0.0.0.0)
  -c, --cache-dir DIR    cache directory (default: OS temp dir)
  -n, --no-cache         disable image caching
  -r, --root DIR         serve from disk instead of embedded (dev mode)
  -v, --version          print version and exit
  -h, --help             show this help
```

### API

Render text by constructing a URL with path-based parameters (as in the original project). Parameters can be in any order, see [Examples](#examples):

```
/api/y-{font}/z-{style}/x-{text}
```

#### Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `y` | Font name | `y-arcade` |
| `z` | Style/color index (0-based) | `z-0` |
| `x` | Text to render | `x-HELLO` |
| `dbl` | Scale factor (1-9) | `dbl-3` |
| `f` | Output format (`svg` or `png`) | `f-svg` |
| `b` | Bubble direction (`u` = up, `d` = down) | `b-d` |
| `bp` | Bubble pointer position (0-100) | `bp-25` |
| `bt` | Bubble theme (`l` = light, `d` = dark) | `bt-l` |
| `cs` | Color shift as `R.G.B` | `cs-50.0.-50` |
| `w` | Character width (for large fonts) | `w-16` |
| `h` | Character height (for large fonts) | `h-16` |
| `list` | List all available fonts | `list` |
| `count` | Return font count as text | `count` |

#### Examples

```
/api/dbl-3/y-arcade/z-0/x-HELLO%20WORLD
/api/dbl-2/b-d/bt-l/bp-25/y-arcade/z-1/x-SAMPLE%20TEXT
/api/dbl-3/f-svg/y-arcade/z-0/x-VECTOR%20TEXT
/api/y-r/z-r/x-RANDOM%20FONT
```

## Web Keyboard Shortcuts

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

Both frontend build commands run `bun run check:compat` against the Browserslist
configuration in `package.json`. Unsupported Web APIs detected by
`eslint-plugin-compat` fail the build. Babel applies syntax transforms and
usage-based core-js polyfills in development and production builds.

This static check does not verify CSS, third-party dependencies, or every
instance method. Browser testing is still required for full compatibility.

### Resource limits and caching

The API accepts up to 100 printable ASCII characters and scale factors up to 9.
The browser applies the same text limit before rendering or restoring a session.
Images are limited to 4 million pixels after scaling and bubble padding, with
at most four concurrent API renders. Requests exceeding these limits return
`400`; a busy renderer returns `503` with `Retry-After: 1`.

The disk cache stores at most 64 MiB and 1024 images, expires entries after
24 hours, and evicts the oldest entries when full. Writes use atomic replacement.
Keys include all rendering parameters and the application version; random font
or color requests bypass the cache. Recognized legacy cache files are removed
on startup. Unrelated files in a custom cache directory are left untouched.
Use a separate cache directory for each server process.

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
