package auth

type AuthService struct {
	tokenManager *TokenManager
}

func NewAuthService(tokenManager *TokenManager) *AuthService {
	return &AuthService{
		tokenManager: tokenManager,
	}
}
