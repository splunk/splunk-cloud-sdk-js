#!/bin/bash

TOKEN_FILE="./.config/okta/token"
if [ -f $TOKEN_FILE ]; then
    echo "Token found in $TOKEN_FILE"
    BEARER_TOKEN=$(cat $TOKEN_FILE)
else
    echo "Token was not set to $TOKEN_FILE"
    exit 1
fi

TENANT_FILE="./.config/ssc/tenant_id"
if [ -f $TENANT_FILE ]; then
    echo "Tenant found in $TENANT_FILE"
    TEST_TENANT=$(cat $TENANT_FILE)
else
    echo "Tenant was not set to $TENANT_FILE"
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
