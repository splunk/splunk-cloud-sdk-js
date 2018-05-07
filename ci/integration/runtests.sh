#!/bin/bash

source ./ci/integration/okta.sh
yarn test:integration || exit 1