package handlers

import (
	"net/http"

	"messenger.com/m/internal/services/auth"
)

type AuthHandler struct {
	service auth.AuthService
}

func (authHandler *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	//ctx := r.Context()

}
