install: install-deps

install-deps:
	npm install

build:
	rm -rf dist
	npm run build

test:
	npm test

lint:
	npx eslint .

publish:
	npm publish

gendiff: 
	npx babel-node src/bin/gendiff.js