.PHONY: test

node_modules:
	@yarn install

test: node_modules
	@yarn test -- --watch
