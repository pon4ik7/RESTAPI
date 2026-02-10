package middleware

import (
	"log"
	"net/http"
	"time"
)

type loggingResponseWriter struct {
	http.ResponseWriter
	status int
	bytes  int
}

func (w *loggingResponseWriter) WriteHeader(status int) {
	w.status = status
	w.ResponseWriter.WriteHeader(status)
}

func (w *loggingResponseWriter) Write(b []byte) (int, error) {
	n, err := w.ResponseWriter.Write(b)
	w.bytes += n

	if w.status == 0 {
		w.status = http.StatusOK
	}

	return n, err
}

func RequestLoggerMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now() // start timer

		lw := &loggingResponseWriter{ResponseWriter: w} // wrap responseWriter

		next.ServeHTTP(lw, r) // send to next handler

		log.Printf(
			"Method: %s | Path: %s | Status: %d | Bytes = %d | Duration: %s ms",
			r.Method, r.URL.Path, lw.status, lw.bytes, time.Since(start).Round(time.Millisecond).String(),
		) // log info

	})
}
