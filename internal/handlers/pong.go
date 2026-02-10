package handlers

import (
	"RESTAPI/internal/api"
	"RESTAPI/internal/structure"
	"net/http"
)

func PongHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		api.MethodNotAllowed(w)
		return
	}

	api.WriteJSON(w, http.StatusOK, structure.NewOkResponse())
}
