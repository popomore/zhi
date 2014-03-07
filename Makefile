test:
	@echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@./node_modules/.bin/mocha -R spec

coverage:
	./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha -- -R spec

coveralls: coverage
	cat ./coverage/lcov.info | ./node_modules/.bin/coveralls

.PHONY: test coverage
