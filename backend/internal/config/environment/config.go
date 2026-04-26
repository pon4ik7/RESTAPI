package environment

import (
	"os"
	"strconv"
	"time"
)

type Config struct {
	JWTSecret   string
	JWTLifetime time.Duration
}

func NewConfig() *Config {
	return &Config{
		JWTSecret:   getOrDefault("JWT_SECRET", "secret"),
		JWTLifetime: time.Second * time.Duration(getOrDefaultInt("JWT_LIFETIME", 10)),
	}
}

func getOrDefault(key string, def string) string {
	value := os.Getenv(key)
	if value == "" {
		return def
	}
	return value
}

func getOrDefaultInt(key string, def int) int {
	value := os.Getenv(key)
	if value == "" {
		return def
	}
	i, err := strconv.Atoi(value)
	if err != nil {
		return def
	}
	return i
}
