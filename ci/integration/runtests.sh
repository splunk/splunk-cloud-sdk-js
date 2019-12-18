#!/bin/bash

# Setting up the BEARER_TOKEN
CONFIG_FILE="./.token"
if [ -f $CONFIG_FILE ]; then
    echo "Token found in $CONFIG_FILE"
    export BEARER_TOKEN=$(cat $CONFIG_FILE)
else
    echo "Token was not set to $CONFIG_FILE"
    exit 1
fi

if [[ "$allow_failures" -eq "1" ]]; then
    echo "Running integration tests but not gating on failures..."
    set +e
    npm run test:integration
    exit 0
else
    echo "Running integration tests and gating on failures..."
    npm run test:integration || exit 1
fi
