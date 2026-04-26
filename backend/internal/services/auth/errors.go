package auth

import "errors"

var (
	ErrInvalidToken            = errors.New("invalid token")
	ErrTokenExpired            = errors.New("token expired")
	ErrRoleNotFound            = errors.New("role not found")
	ErrUserIDNotFound          = errors.New("userID not found")
	ErrUnexpectedSingingMethod = errors.New("unexpected singing method")
)
