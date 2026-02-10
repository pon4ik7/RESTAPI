package middleware

import "net/http"

func MiddlewareLogger(next http.Handler) http.Handler {
	handler := next
	handler = RequestLoggerMiddleware(handler)
	return handler
}
