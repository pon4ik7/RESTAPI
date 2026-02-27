up:
	docker compose up --build

down:
	docker compose down

run:
	make down
	make up

logs:
	docker compose logs -f

restart:
	docker compose down
	docker compose up --build