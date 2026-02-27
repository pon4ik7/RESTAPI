package query

import (
	"database/sql"
	"time"
)

func SaveUser(db *sql.DB, id, username, email, hashedPass string) error {
	query := `
		INSERT INTO Users (id, username, email, hashPassword, createdAt)
		VALUES ($1, $2, $3, $4)`

	_, err := db.Exec(query, id, username, hashedPass, time.Now())
	return err
}
