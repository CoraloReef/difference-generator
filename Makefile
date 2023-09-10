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

lint-fix:
	npx eslint . --fix

publish:
	npm publish

gendiff:
	npx ts-node src/bin/gendiff.ts __tests__/__fixtures__/beforeTree.json __tests__/__fixtures__/afterTree.json 

test-coverage:
	npm test -- --coverage