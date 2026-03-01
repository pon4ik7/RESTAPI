package main

import (
	"RESTAPI/internal/db"
	"RESTAPI/internal/utils"
	"RESTAPI/internal/web/handlers"
	"RESTAPI/internal/web/middleware"
	"database/sql"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {

	utils.Init()

	// var path = os.Getenv("BACKEND_PORT")
	var path = ":8080"

	database, err := db.InitDB()
	if err != nil {
		log.Fatal(err)
	}
	defer func(database *sql.DB) {
		err := database.Close()
		if err != nil {

		}
	}(database)

	router := mux.NewRouter()

	router.HandleFunc("/", handlers.ShowPage).Methods("GET")

	router.PathPrefix("/static/").
		Handler(http.StripPrefix("/static/",
			http.FileServer(http.Dir("./static"))))

	api := router.PathPrefix("/api").Subrouter()

	userHandler := &handlers.UserHandler{DB: database}

	api.HandleFunc("/ping", handlers.PongHandler).Methods("GET")
	api.HandleFunc("/health", handlers.HealthHandler).Methods("GET")
	api.HandleFunc("/echo", handlers.EchoHandler).Methods("POST")
	api.HandleFunc("/users", userHandler.CreateUserHandler).Methods("POST")
	api.HandleFunc("/reg", handlers.ShowRegPage).Methods("GET")
	api.HandleFunc("/login", handlers.ShowLogPage).Methods("GET")

	middleware.Chain(
		api, // root
		middleware.RequestLoggerMiddleware,
		middleware.RequestIDMiddleware,
	) // add new middleware to the end of the list IMPORTANT

	println("Server started on", path)
	log.Fatal(http.ListenAndServe(path, router))
}
