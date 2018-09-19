#!/bin/sh

print_header_line() {
    echo "\n------------------------------------------------------------"
}

echo "Input the version to release omitting the leading 'v' (e.g. 0.7.1) followed by [ENTER]:"
read NEW_VERSION

print_header_line
echo "Preparing v$NEW_VERSION for release ..."
echo "Running `git checkout develop` ..."
git checkout develop

print_header_line
echo "Running `git fetch --all && git pull --all` ..."
git fetch --all && git pull --all

print_header_line
BRANCH_NAME=release/v$NEW_VERSION
LATEST_COMMIT_ID=$(git rev-parse HEAD)
REPOSITORY_URL="https://github.com/splunk/splunk-cloud-sdk-js"
echo "Checking out a $BRANCH_NAME branch ..."
git checkout -b $BRANCH_NAME

print_header_line
echo "Installing dependencies for tooling ..."
yarn

print_header_line
echo "Updating Version in package.json ..."
yarn version

print_header_line
echo "Updating docs and generating ci/cd-publish artifact ..."
yarn run docs
git add docs

print_header_line
echo "Showing changes with `git status` ..."
git status

print_header_line
echo "Review the git status above and if your changes look good press y followed by [ENTER] to commit and push your release branch and release tag:"
read PUSH_TO_GIT
if [ "$PUSH_TO_GIT" = "y" ]
then
    echo "Creating commit for client_info.go and docs/ changes ..."
    git commit -m "Release v$NEW_VERSION"

    echo "Pushing branch $BRANCH_NAME ..."
    git push --set-upstream origin $BRANCH_NAME

    echo "TODO: PRs should be created for $BRANCH_NAME -> master AND $BRANCH_NAME -> develop ..."
    echo "Creating a pull request for the latest commit: $LATEST_COMMIT_ID"
    echo "Pull request is targeting the url: $REPOSITORY_URL"
    git request-pull $LATEST_COMMIT_ID $REPOSITORY_URL
else
    echo "No changes pushed, branch $BRANCH_NAME only created locally ..."
fi


print_header_line
echo "Please complete these steps in order to finish the release!"
echo "Run the command: [git tag -a v$NEW_VERSION -m \"Release v$NEW_VERSION\"]"
echo "Run the command: [git push origin v$NEW_VERSION]"
echo "Deliver the documentation in \"ci/docs/build\" to the developer portal team"