package main

import (
	"net/http"
	"regexp"
)

var immutableAsset = regexp.MustCompile(`^/assets/[a-f0-9]{8}\.[a-z0-9]+$`)

func imageContentType(format string) string {
	if format == "svg" {
		return "image/svg+xml"
	}
	return "image/png"
}

func securityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		h := w.Header()
		h.Set("Content-Security-Policy", "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; object-src 'none'")
		h.Set("X-Content-Type-Options", "nosniff")
		h.Set("X-Frame-Options", "DENY")
		h.Set("Referrer-Policy", "strict-origin-when-cross-origin")
		h.Set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
		if immutableAsset.MatchString(r.URL.Path) {
			h.Set("Cache-Control", "public, max-age=31536000, immutable")
		} else if r.URL.Path == "/" || r.URL.Path == "/index.html" {
			h.Set("Cache-Control", "no-cache")
		} else {
			h.Set("Cache-Control", "no-store")
		}
		next.ServeHTTP(w, r)
	})
}
