# Git Commit Conventions
We have a set of conventions on how git commit messages should be formatted. Specifically, we've decided to follow [conventional commits](https://www.conventionalcommits.org/) to make project commit history more readable and generate changelog automatically.

The commit message formatting can be enforced by using a CLI wizard ([Commitizen](https://github.com/commitizen/cz-cli)). After staging your changes, run `yarn run commit` and follow the prompt to finish formatting your commit messages.

## Commit Message Format
Each commit message should follow the format described below:
```
<type>(<scope>): <subject>
<body>
<footer>
```

## Pre-defined Types
Type must be one of the following:
* feat: A new feature
* fix: A bug fix
* docs: Documentation only changes
* style: Changes that do not affect the meaning of the code
* refactor: A code change that neither fixes a bug nor adds a feature
* release: An aggregation of code changes to be used for a release
* perf: A code change that improves performance
* test: A code change that adds, updates or fixes tests
* ci: A code change in CI pipeline
* revert: Revert to a commit

## Scope
Scopes are broken down at service level and  must be one of the following:
* action
* auth
* catalog
* core
* examples
* identity
* ingest
* kvstore
* search
* streams

Note: scope is optional, use `*` if your changes do not apply to any of the scopes above. `*` can also be used when your changes affect more than one scope.

## Subject
The subject is a short description of the change:
* Start the sentence with present tense: "Add", not "added" nor "adds"
* Don't capitalize first letter
* Don't put any references to JIRA tickets, Github issue number in subject

## Body
Same rule as subject. The body should contain more detailed descriptions of the code changes.


# Pull Request Submission
Before submit your pull request, please follow these guidelines:

* Configure your [development environment](https://github.com/splunk/splunk-cloud-sdk-js/wiki/Development#development-environment)
* Create a new git branch
```
git checkout -b my-branch develop
```
* Make code changes in your branch **with tests** following [code style and convention](https://github.com/splunk/splunk-cloud-sdk-js/wiki/Development#code-styling-and-conventions)
* Check if you have any lint error
```
yarn run tslint
```
* Commit your changes using conventional commit. Adherence to the commit conventions is required since release notes are automatically generated from these commits.
```
yarn commit
```
* Push your branch to Github
```
git push origin my-branch
```
* In Github UI, create a pull request targeting develop branch. This will trigger CI to run automatically.
* After pull request is merged, delete your branch by clicking the button from the UI.
* Pull changes from develop branch 
``` 
git checkout develop
git pull develop
```


