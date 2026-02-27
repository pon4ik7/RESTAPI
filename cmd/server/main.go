package main

import (
	"RESTAPI/internal/exc"
	handlers2 "RESTAPI/internal/web/handlers"
	middleware2 "RESTAPI/internal/web/middleware"
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

	router.HandleFunc("/", handlers2.ShowPage).Methods("GET")
	router.HandleFunc("/api/ping", handlers2.PongHandler).Methods("GET")
	router.HandleFunc("/api/health", handlers2.HealthHandler).Methods("GET")
	router.HandleFunc("/api/echo", handlers2.EchoHandler).Methods("POST")
	router.HandleFunc("/api/users", handlers2.CreateUserHandler).Methods("POST")

	router.PathPrefix("/static/").
		Handler(http.StripPrefix("/static/",
			http.FileServer(http.Dir("./static"))))

	println("Server started on", path)

	handler := middleware2.Chain(
		router, // root
		middleware2.RequestLoggerMiddleware,
		middleware2.RequestIDMiddleware,
	) // add new middleware to the end of the list IMPORTANT

	log.Fatal(http.ListenAndServe(path, handler))
}

func Init() {
	exc.StartTime = time.Now()
	log.SetOutput(&lumberjack.Logger{
		Filename:   "cmd/logs/server.log",
		MaxSize:    10, // mb
		MaxBackups: 3,  // number old files
		MaxAge:     28, // days
		Compress:   true,
	})
}
