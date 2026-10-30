FROM oven/bun:1.4.4@sha256:1d22548f177f4ff38e0c15baa3c2c46c6c2060ba2d1bc573bb4720b407548f1d AS frontend
WORKDIR /app
COPY package.json bun.lock ./
COPY patches ./patches
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build:prod

FROM golang:1.27.3-alpine@sha256:d200d2dd76b03a99b52651fd1325aff7dcd35422c35c01bac56571b0507f3deb AS backend
WORKDIR /src
COPY server/go.mod server/go.sum ./
RUN go mod download
COPY server/tools/upx/ ./tools/upx/
RUN CGO_ENABLED=0 go run ./tools/upx /usr/local/bin/upx
COPY server/ .
COPY --from=frontend /app/public ./public
RUN go mod verify && go test ./... && CGO_ENABLED=0 go build -ldflags="-s -w -X main.version=1.2.0" -o /arcade-font-engine .
RUN upx --best --lzma /arcade-font-engine && upx --test /arcade-font-engine && /arcade-font-engine --version

FROM dhi.io/alpine-base:3.23@sha256:8a14cb527704fd6325fae6e92e0bc73a3c64b44a83c36a3abb53730c5757cc72
COPY --from=backend /arcade-font-engine /bin/arcade-font-engine
USER nonroot
ENTRYPOINT ["/bin/arcade-font-engine"]
