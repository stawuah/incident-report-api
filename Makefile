.PHONY: init
install:
	npm i

.PHONY: dev
dev:
	npm run dev

.PHONY: lint
lint:
	npm run lint

.PHONY: compile
compile:
	npm run compile

pretty:
	npm run pretty

.PHONY: test
test:
	npm run test

.DEFAULT_GOAL: init