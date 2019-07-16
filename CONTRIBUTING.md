# Contributing Guidelines

## How to contribute

If you would like to contribute to this project, go here for more information:

* [Splunk and open source][contributions]
* [Individual contributions][indivcontrib]
* [Company contributions][companycontrib]

## Issues & Bug Reports

If you're seeing some unexpected behavior with this project, please create an [issue on GitHub][issues] with the following information:

0. Version of this project you're using (ex: 0.1.4)
0. Framework version (ex: Node.js 8.11.3) or Browser (ex: Chrome 67.0.3396.99)

Alternatively, if you have a Splunk question please ask on [Splunk Answers][answers]


# Development
## Code Styling and Conventions
- Auto-formatters and Linters
    - [eslint Documentation](https://eslint.org/)
        - See [.eslintrc](.eslintrc.js)
    - [Prettier Documentation](https://prettier.io/)
        - See [.prettierrc](.prettierrc)
- Documentation Generation
    - [JSDoc Documentation](http://usejsdoc.org/)
        - See [jsdoc.json](jsdoc.json)

## Configurations
## Development Environment
### OSX
- Install Homebrew
    - [Homebrew installation documentation](https://brew.sh/)
    - Command(s)
        - `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
- Update Homebrew
    - Command(s)
        - `brew update`
- Install node
    - Command(s)
        - `brew install node`
- Install yarn
    - [Yarn installation documentation](https://yarnpkg.com/lang/en/docs/install/)
    - Command(s)
        - `brew install yarn`
- Install Docker
    - [Docker for Mac installation documentation](https://docs.docker.com/docker-for-mac/install/)
    - Command(s)
        - See 'Docker for Mac installation documentation'

## Repository Environment
### OSX
- Install JavaScript dependencies
    - Command(s)
        - From the root of the repository
        - `yarn`

# Git Commit Conventions
We have a set of conventions on how git commit messages should be formatted. Specifically, we've decided to follow [conventional commits](https://www.conventionalcommits.org/) to make project commit history more readable and generate changelog automatically.

The commit message formatting can be enforced by using a CLI wizard ([Commitizen](https://github.com/commitizen/cz-cli)). After staging your changes, run `yarn run commit` and follow the prompt to finish formatting your commit messages.

## Commit Message Format
Each commit message should follow the format described below:
```
<type>(<scope>): <subject>
<blank_line>
<body>
<blank_line>
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

# Testing
## Test Coverage
The SDK team has decided to use stubby as a functional testing resource in lieu of making redundant unit tests.

## Local Testing
### Local With - Ad-Hoc Functional Testing
To create a local stubby environment for testing. Download and build the stubby Docker image:
```
git clone https://github.com/splunk/splunk-cloud-sdk-shared.git
cd splunk-cloud-sdk-shared/stubby
docker build . -t cloudrepo-docker-playground.jfrog.io/sdk/shared/stubby:latest
```

Then, back in this repo:
- `yarn start:stubserver`
    - This spins up a local stubby server
- `yarn test`
    - This will run the tests
- `yarn stop:stubserver`
    - This will terminate the stubby server

# Documentation
Enter the command `yarn apidocs` to automatically generate the documentation.

## Pull requests

We love to see pull requests!

To create a pull request:

0. Fill out the [Individual Contributor Agreement][indivcontrib].
0. Fork [the repository][repo].
0. Make changes to the **`develop`** branch, preferably with tests.
0. Create a [pull request][pulls] against the **`develop`** branch.

## Contact us

You can reach Splunk support at _support@splunk.com_ if you have Splunk related questions.

You can reach the Developer Platform team at _devinfo@splunk.com_.

# TODO CHANGE THESE FOR CORRECT URLS

[contributions]:            http://dev.splunk.com/view/opensource/SP-CAAAEDM
[indivcontrib]:             http://dev.splunk.com/goto/individualcontributions
[companycontrib]:           http://dev.splunk.com/view/companycontributions/SP-CAAAEDR
[answers]:                  http://answers.splunk.com/
[repo]:                     https://github.com/splunk/splunk-cloud-sdk-js
[issues]:                   https://github.com/splunk/splunk-cloud-sdk-js/issues
[pulls]:                    https://github.com/splunk/splunk-cloud-sdk-js/pulls
[wiki]:                     https://github.com/splunk/splunk-cloud-sdk-js/wiki/Development
