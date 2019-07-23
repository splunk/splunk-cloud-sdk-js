# define variables
PACKAGE_VERSION=$(node -pe "require('./package.json').version")

set -e
echo "Check package info on public registry..."
npm info @splunkdev/cloud-sdk@$PACKAGE_VERSION
TAG=$(npm dist-tag ls @splunkdev/cloud-sdk)
if [[ $TAG == *"latest: $PACKAGE_VERSION"* ]]; then
  echo "package @splunkdev/cloud-sdk@$PACKAGE_VERSION is tagged latest"
else
  exit 1
fi