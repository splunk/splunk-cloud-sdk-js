#!/bin/bash

CONFIG_FILE="./.token"
if [[ -f ${CONFIG_FILE} ]]; then
    echo "Token found in $CONFIG_FILE"
    export BEARER_TOKEN=$(cat $CONFIG_FILE)
else
    echo "Token was not set to $CONFIG_FILE"
    exit 1
fi

echo "Building src ..."
yarn build

if [[ "$allow_failures" -eq "1" ]]; then
    echo "Running examples tests but not gating on failures..."
    set +e
    yarn test:examples
    exit 0
else
    echo "Running examples tests and gating on failures..."
    yarn test:examples || exit 1
fi
