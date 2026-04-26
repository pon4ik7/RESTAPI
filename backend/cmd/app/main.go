package main

import (
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {

	////Infrastructure layer
	//cfg := environment.NewConfig()
	//
	////Logic layer
	//tokenManager := auth.NewTokenManager(cfg.JWTSecret, cfg.JWTLifetime)
	//authService := auth.NewAuthService(tokenManager)
	//
	//// Transport layer
	router := chi.NewRouter()

	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)

	router.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	router.Group(func(r chi.Router) {
		r.Use(middleware.Timeout(60 * time.Second))
		r.Use(middleware.RequestID)
		r.Use(middleware.RealIP)

	})

}
