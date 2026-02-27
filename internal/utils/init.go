package utils

import (
	"RESTAPI/internal/utils/exc"
	"github.com/joho/godotenv"
	"log"
	"time"
)

func Init() {
	exc.StartTime = time.Now()

	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}
}
