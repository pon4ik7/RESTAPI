package auth

import "context"

type AuthService struct {
	tokenManager *TokenManager
}

func NewAuthService(tokenManager *TokenManager) *AuthService {
	return &AuthService{
		tokenManager: tokenManager,
	}
}

func (service *AuthService) Login(ctx context.Context, username string, password string) (string, error) {
	//TODO add UserService to create user
	return "", nil
}
