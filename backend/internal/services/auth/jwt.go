package auth

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserId string `json:"userId"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

type TokenManager struct {
	secret   []byte
	lifetime time.Duration
}

func NewTokenManager(secret string, lifetime time.Duration) *TokenManager {
	return &TokenManager{
		secret:   []byte(secret),
		lifetime: lifetime,
	}
}

func (t *TokenManager) GenerateToken(userId string, role string) (string, error) {
	timeNow := time.Now().Local()
	claims := Claims{
		UserId: userId,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(timeNow),
			ExpiresAt: jwt.NewNumericDate(timeNow.Add(t.lifetime)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString(t.secret)
	if err != nil {
		return "", fmt.Errorf("sign token: %w", err)
	}
	return signedToken, nil
}

func (t *TokenManager) ParseToken(tokenString string) (*Claims, error) {
	token, err := t.VerifyToken(tokenString)
	if err != nil {
		return nil, fmt.Errorf("parse token: %w", err)
	}
	claims, _ := token.Claims.(*Claims)
	return claims, nil
}

func (t *TokenManager) VerifyClaims(claims *Claims) (*Claims, error) {
	if claims == nil {
		return nil, fmt.Errorf("claims is nil")
	}
	if claims.UserId == "" {
		return nil, fmt.Errorf("verify claims %w", ErrUserIDNotFound)
	}
	if claims.Role == "" {
		return nil, fmt.Errorf("verify claims %w", ErrRoleNotFound)
	}
	if claims.RegisteredClaims.IssuedAt == nil || claims.RegisteredClaims.ExpiresAt == nil {
		return nil, fmt.Errorf("verify claims %w", ErrInvalidToken)
	}
	if claims.ExpiresAt.Before(time.Now().Local()) {
		return nil, fmt.Errorf("verify claims %w", ErrTokenExpired)
	}
	return claims, nil
}

func (t *TokenManager) VerifyToken(tokenString string) (*jwt.Token, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("verify token %w", ErrUnexpectedSingingMethod)
		}
		return t.secret, nil
	})
	if err != nil {
		return nil, fmt.Errorf("verify token: %w", err)
	}
	if _, ok := token.Claims.(*Claims); ok && token.Valid {
		return token, nil
	}
	return nil, fmt.Errorf("verify token %w", ErrInvalidToken)
}
