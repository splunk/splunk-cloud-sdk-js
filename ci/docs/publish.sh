#!/bin/bash
set -e
yarn ts:docs
# Escape < and > to &lt; and &gt; per portal requirements
if [ "$(uname)" == "Darwin" ]; then
    # MacOS
    sed -E -i '' -e "s/\</\&lt\;/g" -e "s/\>/\&gt\;/g" $(find docs/md/ -type f)
else
    # Linux
    sed -r -i '' -e "s/\</\&lt\;/g" -e "s/\>/\&gt\;/g" $(find docs/md/ -type f)
fi
rm -rf build/
npm add --no-save @splunk/cicd-tools --registry https://repo.splunk.com/artifactory/api/npm/npm
yarn cicd-publish-docs --force --preflight docs/md
echo "Docs built and packaged into build/"