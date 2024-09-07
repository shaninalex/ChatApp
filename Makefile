start:
	docker compose \
		-f ./docker-compose.yml \
		--env-file .env \
		up -d

stop:
	docker compose \
		-f ./docker-compose.yml \
		--env-file .env \
		stop

clear:
	docker compose \
		-f ./docker-compose.yml \
		--env-file .env \
		down -v

# oathkeeper should be installed localy for local development
# Docs: https://www.ory.sh/docs/oathkeeper/install
oathkeeper:
	oathkeeper serve proxy -c ./config/oathkeeper/oathkeeper.yml
