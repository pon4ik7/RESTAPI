package api

import (
	"RESTAPI/internal/structure"
	"net/http"
)

func WriteError(w http.ResponseWriter, status int, message string) {
	errBody := structure.NewErrorResponse(status, message)
	WriteJSON(w, status, errBody)
}

func MethodNotAllowed(w http.ResponseWriter) {
	WriteError(w, http.StatusMethodNotAllowed, "method not allowed")
}
