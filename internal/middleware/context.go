package middleware

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"net/http"
)

type ctxKey string

const requestIDKey ctxKey = "request_id"
const RequestIDHeader = "X-Request-ID"

func newRequestID() string {
	b := make([]byte, 16)
	_, _ = rand.Read(b)
	return hex.EncodeToString(b)
}

func RequestIDMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		rid := r.Header.Get(RequestIDHeader)

		if rid == "" {
			rid = newRequestID()
		}

		w.Header().Set(RequestIDHeader, rid)

		ctx := context.WithValue(r.Context(), requestIDKey, rid)

		next.ServeHTTP(w, r.WithContext(ctx))

	})
}

func GetRequestID(r *http.Request) string {
	val := r.Context().Value(requestIDKey)
	if rid, ok := val.(string); ok {
		return rid
	}
	return ""
}
