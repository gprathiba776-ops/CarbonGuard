test-python:
	python -m unittest discover -s tests -p 'test_*.py' -v

lint-python:
	python -m compileall -q backend tests

frontend-install:
	cd frontend && npm install --no-audit --no-fund

frontend-check:
	cd frontend && npm run typecheck && npm test && npm run build
