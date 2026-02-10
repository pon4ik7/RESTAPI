# build
FROM golang:1.25.2Mf AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o server ./cmd

# run
FROM gcr.io/distroless/base-debian12
WORKDIR /app
COPY --from=build /app/server /app/server
COPY static /app/static
COPY pages /app/pages
EXPOSE 8080
CMD ["/app/server"]