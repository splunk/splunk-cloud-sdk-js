#!/bin/bash

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
