package handlers

import (
	"RESTAPI/internal/api"
	"RESTAPI/internal/structure"
	"encoding/json"
	"github.com/google/uuid"
	"net/http"
	"time"
)

func CreateUserHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		api.MethodNotAllowed(w)
		return
	}

	if r.ContentLength == 0 {
		api.WriteError(w, http.StatusBadRequest, "Content required")
		return
	}

	request := &structure.CreateUserRequest{}

	err := json.NewDecoder(r.Body).Decode(request)

	if err != nil {
		api.WriteError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	// TODO handle DB part

	response := structure.NewUserCreateResponse(
		uuid.NewString(),
		request.Username,
		time.Now(),
	)

	api.WriteJSON(w, http.StatusCreated, response)
}
