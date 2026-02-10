package handlers

import (
	"RESTAPI/internal/api"
	"RESTAPI/internal/structure"
	"encoding/json"
	"net/http"
)

func EchoHandler(w http.ResponseWriter, r *http.Request) {
	var requestBody structure.EchoRequest

	if r.ContentLength == 0 {
		api.WriteError(w, http.StatusBadRequest, "Content required")
		return
	}

	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		api.WriteError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	length := len(requestBody.Message)
	response := structure.NewEchoResponse(requestBody.Message, length)
	api.WriteJSON(w, http.StatusOK, response)
}
