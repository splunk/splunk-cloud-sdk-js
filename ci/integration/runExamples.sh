#!/bin/bash

source ./ci/integration/okta.sh
if [ "$allow_failures" -eq "1" ]; then
    echo "Running integration tests but not gating on failures..."
    set +e
    yarn example
    exit 0
else
    echo "Running integration tests and gating on failures..."
    yarn example || exit 1
fi
