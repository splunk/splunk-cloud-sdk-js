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
REPOSITORY_URL="https://github.com/splunk/splunk-cloud-sdk-js"
echo "Checking out a $BRANCH_NAME branch ..."
git checkout -b $BRANCH_NAME

print_header_line
echo "Installing dependencies for tooling ..."
yarn

print_header_line
echo "Updating Version in package.json ..."
yarn version --new-version $NEW_VERSION \
             --no-git-tag-version

print_header_line
echo "Building resouces for documentation ..."
yarn build

print_header_line
echo "Updating docs and generating ci/cd-publish artifact ..."
yarn run docs
git add docs

print_header_line
echo "Re-adding package.json because it gets updated sometimes ..."
git add package.json

print_header_line
echo "Showing changes with `git status` ..."
git status

print_header_line
echo "Enter 'Y', then press [ENTER] after reviewing the git status above and confirming the changes are correct. This will push the release branch and release tag to the repository:"
read PUSH_TO_GIT
if [ "$PUSH_TO_GIT" = "Y" ]
then
    print_header_line
    echo "Creating commit for client_info.go and docs/ changes ..."
    yarn commit

    print_header_line
    echo "Pushing branch $BRANCH_NAME ..."
    git push --set-upstream origin $BRANCH_NAME
else
    echo "No changes pushed, branch $BRANCH_NAME only created locally ..."
fi


print_header_line
echo "Please complete these steps in order to finish the release!"
echo ""
echo "Please create a pull request from $BRANCH_NAME targeting master"
echo "AFTER the the pull request has been merged go to https://github.com/splunk/splunk-cloud-sdk-js/releases/new and create a release"
echo " - Make the tag '$NEW_VERSION'"
echo " - Make the target 'master'"
echo " - Make sure the release includes the change notes in the write section"
echo " - Make sure the release is marked set as a 'pre-release'"
echo "Please inform relevant parties of the release."
echo "Deliver the documentation in \"ci/docs/build\" to the developer portal team"
echo "Push the created build artifact to artifactory"