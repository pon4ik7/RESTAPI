package apierror

import "net/http"

type Code string

const (
	CodeInvalidRequest Code = "INVALID_REQUEST"
	CodeUnauthorized   Code = "UNAUTHORIZED"
	CodeNotFound       Code = "NOT_FOUND"
	CodeForbidden      Code = "FORBIDDEN"
	CodeInternalError  Code = "INTERNAL_ERROR"
)

type Error struct {
	Code    Code
	Message string
	Status  int
}

func (e *Error) Error() string {
	return e.Message
}

func New(status int, code Code, message string) *Error {
	return &Error{Status: status, Code: code, Message: message}
}

func InvalidRequest(message string) *Error {
	return New(http.StatusBadRequest, CodeInvalidRequest, message)
}

func Unauthorized(message string) *Error {
	return New(http.StatusUnauthorized, CodeUnauthorized, message)
}

func Forbidden(message string) *Error {
	return New(http.StatusForbidden, CodeForbidden, message)
}

func NotFound(message string) *Error {
	return New(http.StatusNotFound, CodeNotFound, message)
}

func Internal(message string) *Error {
	return New(http.StatusInternalServerError, CodeInternalError, message)
}
