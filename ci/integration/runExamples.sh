#!/bin/bash

CONFIG_FILE="./okta/.token"
if [ -f $CONFIG_FILE ]; then
    echo "Token found in $CONFIG_FILE"
    export BEARER_TOKEN=$(cat $CONFIG_FILE)
else
    echo "Token was not set to $CONFIG_FILE"
    exit 1
fi

echo "Building src ..."
yarn build

if [ "$allow_failures" == "1" ]; then
    echo "Running examples but not gating on failures..."
else
    echo "Running examples and gating on failures..."
fi
echo ""

OVERALL_RESULT=0
for EXAMPLE_FILE in $(ls examples/)
do
    echo "Running example: examples/$EXAMPLE_FILE file ..."
    
    set +e
    node examples/$EXAMPLE_FILE
    RESULT=$?
    if [ $RESULT -ne 0 ]
    then
        if [ "$allow_failures" != "1" ]; then
            OVERALL_RESULT=1
        fi
        echo ""
        echo "!!!!!!!!!!!!!!!!!!!!!!!"
        echo "FAIL: There was an error testing the examples/$EXAMPLE_FILE file ... continuing"
        echo "!!!!!!!!!!!!!!!!!!!!!!!"
        echo ""
    fi
done

echo ""
echo "Exiting with code=$OVERALL_RESULT ..."
exit $OVERALL_RESULT