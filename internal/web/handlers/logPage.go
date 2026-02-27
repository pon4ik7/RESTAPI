package handlers

import (
	"log"
	"net/http"
	"os"
)

func ShowLogPage(w http.ResponseWriter, r *http.Request) {
	htmlPath := "pages/log_page.html"

	data, err := os.ReadFile(htmlPath)
	if err != nil {
		log.Println(err)
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	_, err = w.Write(data)
	if err != nil {
		log.Println(err)
	}
}
