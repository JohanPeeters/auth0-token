.PHONY: request_admin_token rotate_secret test

node_modules:
	@yarn install
	
test: node_modules
	@yarn test -- --watch
