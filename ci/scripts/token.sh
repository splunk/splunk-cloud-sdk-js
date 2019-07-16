# If any of the required env variables are unset, fail fast

if [[ -z "$BASE64_ENCODED_BASIC_AUTH" ]]; then
    echo "BASE64_ENCODED_BASIC_AUTH was not set"
    exit 1
fi

if [[ -z "$IAC_HOST" ]]; then
    echo "IAC_HOST was not set"
    exit 1
fi

# Optional env variables
IDP_TOKEN_BODY="grant_type=client_credentials"

echo "Fetching access token..."
CURL_RESPONSE=$(curl --request POST --url $IAC_HOST/token \
 --header 'accept: application/json' \
 --header "Authorization: Basic $BASE64_ENCODED_BASIC_AUTH" \
 --header 'content-type: application/x-www-form-urlencoded' --data "$IDP_TOKEN_BODY")

ACCESS_TOKEN=$(printf "$CURL_RESPONSE" | jq -r ".access_token")

if [ -z "$ACCESS_TOKEN" ] || [ "$ACCESS_TOKEN" = "null" ]; then
    echo "Unable to set ACCESS_TOKEN, response from idp:\n\n$CURL_RESPONSE"
    exit 1

fi

CONFIG_FILE="./.token"
printf "$ACCESS_TOKEN" > $CONFIG_FILE

if [ -f $CONFIG_FILE ]; then
    echo "access_token output to $CONFIG_FILE"
else
    echo "access_token WAS NOT output to $CONFIG_FILE, please check permissions..."
    exit 1
fi
