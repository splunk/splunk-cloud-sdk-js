#!/bin/bash

CONFIG_FILE="./okta/.token"
if [ -f $CONFIG_FILE ]; then
    echo "Token found in $CONFIG_FILE"
    export BEARER_TOKEN=$(cat $CONFIG_FILE)
else
    echo "Token was not set to $CONFIG_FILE"
    exit 1
fi

if [ "$allow_failures" -eq "1" ]; then
    echo "Running examples but not gating on failures..."
    set +e
    yarn example
    exit 0
else
    echo "Running examples and gating on failures..."
    yarn example || exit 1
fi
