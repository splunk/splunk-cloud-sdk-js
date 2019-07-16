#!/bin/sh

echo "Installing dependencies ..."
yarn install

echo "Building package ..."
yarn build

PACKAGE_VERSION=$(node -p -e "require('./package.json').version")
if [[ $PACKAGE_VERSION == *"alpha"* ]]; then
  echo "It's alpha!"
  echo "Publishing pre-release version of @splunkdev/cloud-sdk package to artifactory ..."
  npm publish --tag alpha --registry https://repo.splunk.com/artifactory/api/npm/npm-solutions-local/
else
  echo "Publishing latest version of @splunkdev/cloud-sdk package to artifactory ..."
  npm publish --tag latest --registry https://repo.splunk.com/artifactory/api/npm/npm-solutions-local/
fi

echo "Publishing docs to artifactory ..."
yarn publish:docs