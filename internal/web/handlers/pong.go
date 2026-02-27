package handlers

import (
	"RESTAPI/internal/structure"
	"RESTAPI/internal/utils"
	"net/http"
)

func PongHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.MethodNotAllowed(w)
		return
	}

	utils.WriteJSON(w, http.StatusOK, structure.NewOkResponse())
}
