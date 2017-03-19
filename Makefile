#------------------------------
# vars
#------------------------------

SHELL 			:= /bin/bash
PATH        	:= ./node_modules/.bin:${PATH}
MAKEFLAGS 		:= --no-print-directory
BROWSER			:= google-chrome
REPORTER 		:= spec

# directories

DIR_BIN			:= ./node_modules/.bin
DIR_COVERAGE	:= ./coverage
DIR_SRC 		:= ./src
DIR_DIST 		:= ./dist

# files

FILE_WEBPACK_CONFIG_DEV 	:= ./webpack-config.dev.js
FILE_WEBPACK_CONFIG_PROD 	:= ./webpack-config.prod.js
FILES_SASS 					:= src/**/*.scss
FILES_SRC 					:= src/**/*.js
FILES_TEST 					:= src/**/*test.js

# package

PACKAGE_NAME 		:= $(shell node -e 'process.stdout.write(require("./package.json").name)')
PACKAGE_VERSION 	:= $(shell node -e 'process.stdout.write(require("./package.json").version)')

# git

GIT_MODIFIED_FILE_COUNT					:= $$(git status --porcelain | wc -l)
GIT_IS_REPO_UP_TO_DATE					:= $$(git fetch; git status | grep "^Your branch is up-to-date" | wc -l)
GIT_DOES_PACKAGE_VERSION_ALREADY_EXIST	:= $$(git tag -l "v${PACKAGE_VERSION}" | wc -l)

# inotifywait

WATCH_SASS_IGNORE 					:= \.(js,json,html,vue)

#------------------------------
# helpers
#------------------------------

define echo_help
	if [ ! -z $(3) ] ; \
		then echo -e "\033[34m$(1)\033[0m –$(2) \033[36m[$(3) ]\033[0m" ; \
		else echo -e "\033[34m$(1)\033[0m –$(2)" ; \
	fi
endef

define echo_warning
	echo -e "\033[33m$(1)\033[0m"
endef

define echo_danger
	echo -e "\033[31m$(1)\033[0m"
endef

define echo_success
	echo -e "\033[32m$(1)\033[0m"
endef

define echo_info
	echo -e "\033[34m$(1)\033[0m"
endef

#------------------------------
# help
#------------------------------

help:
	@$(call echo_help, "todo", "Lists all TODOs in source JavaScript.")
	@$(call echo_help, "jslint", "Lints source JavaScript.")
	@$(call echo_help, "jslint-w", "Lints source JavaScript and watches files for change.")
	@$(call echo_help, "sasslint", "Lints SASS.")
	@$(call echo_help, "sasslint-w", "Lints SASS and watches files for change.")
	@$(call echo_help, "test", "Tests the source JavaScript.", "GREP")
	@$(call echo_help, "test-w", "Tests the source JavaScript and watches files for change.", "GREP")
	@$(call echo_help, "coverage", "Generates a testing coverage report for source JavaScript.")
	@$(call echo_help, "serve", "Runs webpack-dev-server with live reloading.")
	@$(call echo_help, "build", "Creates a production build for distribution and copies assets directory.")
	@$(call echo_help, "push", "Pushes local repository to GitHub.")
	@$(call echo_help, "publish", "Creates a new annotated GitHub tag and pushes release.", "MESSAGE")

#------------------------------
# todo
#
# Lists all TODOs in source JavaScript.
#------------------------------

todo:
	@grep "TODO" -n -r "$(DIR_SRC)" --colour=always ; exit 0

#------------------------------
# jslint
#
# Lints source JavaScript.
#------------------------------

jslint:
	@esw --color --ext=".js,.vue" ; exit 0

jslint-w:
	@esw --color --ext=".js,.vue" -w ; exit 0

#------------------------------
# sasslint
#
# Lints SASS.
#------------------------------

sasslint:
	@sass-lint -c .sasslintrc.yaml "$(FILES_SASS)" -v -q

sasslint-w:
	@sass-lint -c .sasslintrc.yaml "$(FILES_SASS)" -v -q ; \
	while inotifywait -r -e modify "$(DIR_SRC)" --exclude "$(WATCH_SASS_IGNORE)" ; \
		do sass-lint -c .sasslintrc.yaml "$(FILES_SASS)" -v -q ; \
	done

#------------------------------
# test
#
# Tests source JavaScript.
#
# args:
#  * GREP (allows you to run only tests whose describe statements match the GREP value")
#
#------------------------------

test: jslint
	@if [ -n "$(GREP)" ] ; \
		then grep="--grep $(GREP)" ; \
		else grep="" ; \
	fi ; \
	NODE_PATH="$(DIR_SRC)" mocha -R "$(REPORTER)" "$(FILES_TEST)" --compilers js:babel-core/register $${grep}; exit 0
	# NODE_PATH="./src" ./node_modules/.bin/mocha -R "spec" "src/**/*test.js" --compilers js:babel-core/register

test-w: jslint
	@if [ -n "$(GREP)" ] ; \
		then grep="--grep $(GREP)" ; \
		else grep="" ; \
	fi ; \
	NODE_PATH="$(DIR_SRC)" mocha -w -R "$(REPORTER)" "$(FILES_TEST)" --compilers js:babel-core/register $${grep}; exit 0

#------------------------------
# coverage
#
# Generates a testing coverage report for source JavaScript.
#------------------------------

coverage: jslint
	@rm -rf "$(DIR_COVERAGE)"
		@NODE_PATH="$(DIR_SRC)" babel-node "$(DIR_BIN)/"babel-istanbul cover --root "$(DIR_SRC)" "$(DIR_BIN)/"_mocha -- "$(FILES_TEST)" -R dot --compilers js:babel-register,css:ignore-import ; exit 0
		@google-chrome "$$(pwd)/coverage/lcov-report/index.html"

#------------------------------
# report-coverage
#
# Generates a testing coverage report for Coveralls CI.
#------------------------------

report-coverage:
	@rm -rf "$(DIR_COVERAGE)"
		@NODE_PATH="$(DIR_SRC)" babel-node "$(DIR_BIN)/"babel-istanbul cover --root "$(DIR_SRC)" "$(DIR_BIN)/"_mocha --report lcovonly -- "$(FILES_TEST)" -R spec --compilers js:babel-register,css:ignore-import && cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js && rm -rf ./coverage

#------------------------------
# serve
#
# Runs webpack-dev-server with live reloading.
#------------------------------

#serve: sasslint jslint test
serve:
	@webpack-dev-server --config "$(FILE_WEBPACK_CONFIG_DEV)" --hot --inline --open

#------------------------------
# build
#
# Creates a production build for distribution and copies assets directory.
#------------------------------

build: sasslint jslint test
	@rm -rf "$(DIR_DIST)"
		@mkdir "$(DIR_DIST)"
		@cp -R "$(DIR_SRC)/assets" "$(DIR_DIST)/assets"
		@webpack --config "$(FILE_WEBPACK_CONFIG_PROD)" -p

#------------------------------
# push
#
# Pushes local repo to GitHub.
#------------------------------

push: sasslint jslint test
	@if [ "$(GIT_MODIFIED_FILE_COUNT)" != "0" ] ; \
		then \
			$(call echo_warning,"Unclean working tree. Commit or stash changes first.") ; \
			git status; \
			exit 1 ; \
	fi
	@git push

#------------------------------
# publish
#
# Creates a new annotated GitHub tag and pushes release.
# Will use package.json version number and MESSAGE (if provided).
#
# args:
#  * MESSAGE (message for annotated tag, defaults to "v$(PACKAGE_VERSION)")
#
# checks:
#  * local repo is clean (no outstanding commits)
#  * local repo is up to date with remote
#  * package.json version is new
#------------------------------

publish: sasslint jslint test
	@if [ "$(GIT_MODIFIED_FILE_COUNT)" != "0" ] ; \
		then \
			$(call echo_warning,"Unclean working tree. Commit or stash changes first.") ; \
			git status; \
			exit 1 ; \
	elif [ "$(GIT_IS_REPO_UP_TO_DATE)" = "0" ] ; \
		then \
			$(call echo_warning,"Local/Remote histories differ. Please push/pull changes.") ; \
			exit 1 ; \
	elif [ "$(GIT_DOES_PACKAGE_VERSION_ALREADY_EXIST)" != "0" ] ; \
		then \
			$(call echo_warning,"v$(PACKAGE_VERSION) already exists. Update package.json") ; \
			exit 1 ; \
	fi

	@version="v$(PACKAGE_VERSION)" ; \
	if [ -n "$(MESSAGE)" ] ; \
		then message="$(MESSAGE)" ; \
		else message="$${version}" ; \
	fi ; \
	git tag -a "$${version}" -m "$${message}" && git push origin "$${version}" ; \
	$(call echo_success,"New GitHub release for $${version} successfully created")

#------------------------------

.PHONY: todo jslint jslint-w sasslint sasslint-w test test-w coverage report-coverage serve build push publish
