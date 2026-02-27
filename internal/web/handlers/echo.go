package handlers

import (
	"RESTAPI/internal/structure"
	"RESTAPI/internal/utils"
	"encoding/json"
	"net/http"
)

func EchoHandler(w http.ResponseWriter, r *http.Request) {
	var requestBody structure.EchoRequest

	if r.ContentLength == 0 {
		utils.WriteError(w, http.StatusBadRequest, "Content required")
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, 1<<20) // 1MB

	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if requestBody.Message == "" {
		utils.WriteError(w, http.StatusBadRequest, "Message required")
		return
	}

	if len(requestBody.Message) > 256 {
		utils.WriteError(w, http.StatusBadRequest, "Message too long (max 256)")
		return
	}

	length := len(requestBody.Message)
	response := structure.NewEchoResponse(requestBody.Message, length)
	utils.WriteJSON(w, http.StatusOK, response)
}
