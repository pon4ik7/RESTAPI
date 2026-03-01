up:
	docker compose up --build -d

down:
	docker compose down

delete:
	docker compose down -v

run:
	make down
	make up

logs:
	docker compose logs -f

restart:
	docker compose down
	docker compose up --build