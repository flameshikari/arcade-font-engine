FROM oven/bun:latest AS frontend
WORKDIR /app
COPY --chown=node package.json .
RUN bun install
COPY . .
RUN bun run build:prod

FROM golang:1.24-alpine AS backend
WORKDIR /src
COPY server/go.mod ./
RUN go mod download
COPY server/ .
COPY --from=frontend /app/public ./public
RUN go mod tidy && CGO_ENABLED=0 go build -ldflags="-s -w -X main.version=1.0.0" -o /arcade-font-engine .

FROM alpine:3.21
RUN adduser -D -u 1000 app
USER app
ENTRYPOINT ["/arcade-font-engine"]
COPY --from=backend /arcade-font-engine /arcade-font-engine
