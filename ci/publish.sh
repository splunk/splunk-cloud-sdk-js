#!/bin/sh

echo "Writing .npmrc file to allow access to internal Splunk npm ..."
echo $NPM_TOKEN >> .npmrc

echo "Publishing ssc-client package to npm ..."
npm publish

echo "Publishing docs to docshub ..."
echo "TODO: publishing to docshub must be performed manually for now until docshub is moved out of repo.splunk.com, the next command will fail."
# yarn publish:docs