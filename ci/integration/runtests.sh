#!/bin/bash

source ./ci/integration/okta.sh
if [ "$allow_failures" -eq "1" ]; then
    echo "Running integration tests but not gating on failures..."
    set +e
    yarn test:integration
    exit 0
else
    echo "Running integration tests and gating on failures..."
    yarn test:integration || exit 1
fi