package structure

type EchoRequest struct {
	Message string `json:"message"`
}

type CreateUserRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}
