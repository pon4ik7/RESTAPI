package middleware

import (
	"github.com/gorilla/mux"
	"net/http"
)

type Middleware func(http.Handler) http.Handler

func Chain(handler *mux.Router, m ...mux.MiddlewareFunc) {
	for i := 0; i < len(m); i++ {
		handler.Use(m[i])
	}
}
