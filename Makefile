install:
	cp -n .env.sample .env
	cp -n .env.test.sample .env.test
	npm ci --prefix app
	pre-commit install
	cd backend; \
		poetry install

seed-database:
	cd hasura; \
		hasura seed apply; \
		hasura console

start-front:
	npm --prefix app run dev

start-back:
	cd backend; \
		poetry run uvicorn --reload cdb.api.main:app
