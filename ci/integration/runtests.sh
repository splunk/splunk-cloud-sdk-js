#!/bin/bash

CONFIG_FILE="./okta/.token"
if [ -f $CONFIG_FILE ]; then
    echo "Token found in $CONFIG_FILE"
    cat $CONFIG_FILE
else
    echo "Token was not set to $CONFIG_FILE"
    exit 1
fi
exit 0

if [ "$allow_failures" -eq "1" ]; then
    echo "Running integration tests but not gating on failures..."
    set +e
    yarn test:integration
    exit 0
else
    echo "Running integration tests and gating on failures..."
    yarn test:integration || exit 1
fi