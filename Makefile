.PHONY: help install build dev start test docker-build clean

help:
	@echo "Available commands:"
	@echo "  make install      - Install npm dependencies and generate Prisma"
	@echo "  make build        - Build Next.js application"
	@echo "  make dev          - Run development server"
	@echo "  make start        - Run production server"
	@echo "  make test         - Run automated test suite"
	@echo "  make docker-build - Build Docker image"

install:
	npm install
	npx prisma generate

build:
	npm run build

dev:
	npm run dev

start:
	npm start

test:
	npm test

docker-build:
	docker build -t shopsphere:latest .

clean:
	rm -rf .next out coverage
