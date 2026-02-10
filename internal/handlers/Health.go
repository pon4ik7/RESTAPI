package handlers

import (
	"RESTAPI/internal/config"
	"RESTAPI/internal/structure"
	"encoding/json"
	"log"
	"net/http"
	"time"
)

func HealthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	err := json.NewEncoder(w).Encode(structure.NewHealthResponse("ok", time.Since(config.StartTime)))
	if err != nil {
		log.Println(err)
	}
}
