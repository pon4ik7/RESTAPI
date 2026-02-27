package db

import (
	"database/sql"
	"os"
	"time"
)

var database_url = os.Getenv("DATABASE_URL")

func InitDB() (*sql.DB, error) {
	dsn := os.Getenv(database_url)

	db, err := sql.Open("pgx", dsn)
	if err != nil {
		return nil, err
	}

	// Настройки пула соединений
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)
	db.SetConnMaxLifetime(5 * time.Minute)

	// Проверка связи
	if err := db.Ping(); err != nil {
		return nil, err
	}

	return db, nil
}
