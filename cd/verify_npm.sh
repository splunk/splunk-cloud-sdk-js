# define variables
TEST_REPO="test_app"
PACKAGE_VERSION=$(node -pe "require('./package.json').version")
PACKAGE_NAME="splunkdev-cloud-sdk-$PACKAGE_VERSION.tgz"

set -e
echo "running pre-release verification on $PACKAGE_NAME"
echo "creating a testing app: $TEST_REPO"
npm_config_registry=https://repo.splunk.com/artifactory/api/npm/npm npx @splunk/cloud-create-app $TEST_REPO
cd $TEST_REPO

echo "install package from private npm registry.."
yarn add @splunkdev/cloud-sdk@$PACKAGE_VERSION
cd src

echo "import SDK client from the installed package..."
echo "import { SplunkCloud } from '@splunkdev/cloud-sdk';" > temp.jsx
cat index.jsx >> temp.jsx
mv temp.jsx index.jsx

echo "build the test app..."
cd .. & yarn build