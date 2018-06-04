#!/bin/bash

TOKEN_FILE="./.config/okta/token"
if [ -f $TOKEN_FILE ]; then
    echo "Token found in $TOKEN_FILE"
    BEARER_TOKEN=$(cat $TOKEN_FILE)
    export BEARER_TOKEN
else
    echo "Token was not set to $TOKEN_FILE"
    exit 1
fi

TENANT_FILE="./.config/ssc/tenant_id"
if [ -f $TENANT_FILE ]; then
    echo "Tenant found in $TENANT_FILE"
    TENANT_ID=$(cat $TENANT_FILE)
    export TENANT_ID
else
    echo "Tenant was not set to $TENANT_FILE"
    exit 1
fi

if [ "$allow_failures" -eq "1" ]; then
    echo "Running integration tests but not gating on failures..."
    set +e
    yarn codecov:integration
    exit 0
else
    echo "Running integration tests and gating on failures..."
    yarn codecov:integration || exit 1
fi
