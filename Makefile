# SPEC_REPO format: <host.com>/<owner>/<project>
SPEC_REPO_URL_WITH_AUTH := https://$(SPEC_REPO_USERNAME):$(SPEC_REPO_PASSWORD)@$(SPEC_REPO)
SPEC_REPO_BRANCH_OR_COMMIT := $(if $(SPEC_REPO_BRANCH_OR_COMMIT),$(SPEC_REPO_BRANCH_OR_COMMIT),master)
TMPDIR = $(PWD)/tmp/out

.PHONY: generate test deploy

generate:
	docker run -e LANGUAGES=typescript \
		-e SPEC_REPO_URL="$(SPEC_REPO_URL_WITH_AUTH)" \
		-e SPEC_REPO_BRANCH_OR_COMMIT="$(SPEC_REPO_BRANCH_OR_COMMIT)" \
		-e SERVICES="app-registry identity ingest catalog collect provisioner action kvstore search ml forwarders streams" \
		-p 5005:5005 \
		-v $(TMPDIR):/opt/generated \
		--rm \
		scpcodegen:latest \
		generate
	rm -r src/services/*
	cp -r tmp/out/typescript/* src/services/
	rm -rf $(TMPDIR)

update_dependencies:
	yarn update

test:
	yarn test

deploy:
	yarn release
