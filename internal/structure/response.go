package structure

import "time"

type OkResponse struct {
	Message string `json:"message"`
}
type HealthResponse struct {
	Status string `json:"status"`
	Uptime string `json:"uptime"`
}

type EchoResponse struct {
	Message string `json:"message"`
	Length  int    `json:"length"`
}

type UserCreateResponse struct {
	Id        string    `json:"id"`
	Username  string    `json:"username"`
	CreatedAt time.Time `json:"created_at"`
}

//-------------------------------------------

func NewOkResponse() OkResponse {
	return OkResponse{
		Message: "ok",
	}
}

func NewHealthResponse(status string, uptime time.Duration) HealthResponse {
	return HealthResponse{
		Status: status,
		Uptime: uptime.Round(time.Second).String(),
	}
}

func NewEchoResponse(message string, length int) EchoResponse {
	return EchoResponse{
		Message: message,
		Length:  length,
	}
}

func NewUserCreateResponse(id string, username string, createdAt time.Time) UserCreateResponse {
	return UserCreateResponse{
		Id:        id,
		Username:  username,
		CreatedAt: createdAt,
	}
}
