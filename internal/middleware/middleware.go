package middleware

import "net/http"

type Middleware func(http.Handler) http.Handler

func Chain(handler http.Handler, m ...Middleware) http.Handler {
	for i := 0; i < len(m); i++ {
		handler = m[i](handler)
	}
	return handler
}
