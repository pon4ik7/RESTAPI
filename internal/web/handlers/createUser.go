package handlers

import (
	"RESTAPI/internal/structure"
	"RESTAPI/internal/utils"
	"database/sql"
	"encoding/json"
	"github.com/google/uuid"
	"net/http"
	"time"
)

type UserHandler struct {
	DB *sql.DB
}

func (h *UserHandler) CreateUserHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.MethodNotAllowed(w)
		return
	}

	request := &structure.CreateUserRequest{}
	if err := json.NewDecoder(r.Body).Decode(request); err != nil {
		utils.WriteError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	//hashedPass, err := utils.HashPassword(request.Password)
	//if err != nil {
	//	utils.WriteError(w, http.StatusInternalServerError, "security error")
	//	return
	//}

	userID := uuid.NewString()
	// db.SaveUser(userID, request.Username, hashedPass)

	token, err := utils.GenerateToken(userID)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "token error")
		return
	}

	response := structure.NewUserCreateResponse(
		userID,
		request.Username,
		time.Now(),
		token,
	)

	utils.WriteJSON(w, http.StatusCreated, response)
}
