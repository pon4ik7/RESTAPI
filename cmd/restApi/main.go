package main

import (
	"RESTAPI/internal/config"
	"RESTAPI/internal/handlers"
	"RESTAPI/internal/middleware"
	"github.com/gorilla/mux"
	"gopkg.in/natefinch/lumberjack.v2"
	"log"
	"net/http"
	"time"
)

var path = "localhost:8080"

func main() {

	Init()

	router := mux.NewRouter()

	router.HandleFunc("/", handlers.ShowPage).Methods("GET")
	router.HandleFunc("/api/ping", handlers.PongHandler).Methods("GET")
	router.HandleFunc("/api/health", handlers.HealthHandler).Methods("GET")
	router.HandleFunc("/api/echo", handlers.EchoHandler).Methods("POST")
	router.HandleFunc("/api/users", handlers.CreateUserHandler).Methods("POST")

	router.PathPrefix("/static/").
		Handler(http.StripPrefix("/static/",
			http.FileServer(http.Dir("./static"))))

	println("Server started on", path)

	handler := middleware.Chain(
		router, // root
		middleware.RequestLoggerMiddleware,
		middleware.RequestIDMiddleware,
	) // add new middleware to the end of the list IMPORTANT

	log.Fatal(http.ListenAndServe(path, handler))
}

func Init() {
	config.StartTime = time.Now()
	log.SetOutput(&lumberjack.Logger{
		Filename:   "cmd/logs/server.log",
		MaxSize:    10, // mb
		MaxBackups: 3,  // number old files
		MaxAge:     28, // days
		Compress:   true,
	})
}
