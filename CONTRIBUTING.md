# Contributing Guidelines

## How to contribute

If you would like to contribute to this project, go here for more information:

* [Splunk and open source][contributions]
* [Individual contributions][indivcontrib]
* [Company contributions][companycontrib]

## Issues & Bug Reports

If you're seeing some unexpected behavior with this project, please create an [issue on GitHub][issues] with the following information:

0. Version of this project you're using (ex: 1.5.0)
0. Platform version (ex: Windows Server 2012 R2)
0. Framework version (ex: Node.js 0.10.37) or Browser (ex: Chrome 43.0.2357.81)
0. Other relevant information (ex: local/remote environment)

Alternatively, if you have a Splunk question please ask on [Splunk Answers][answers]


# Repository Statues
[![Codeship Status for splunk/ssc-client-js](https://app.codeship.com/projects/efc247e0-15d9-0136-51cc-4ecad654e338/status?branch=develop)](https://app.codeship.com/projects/283657)

[![codecov](https://codecov.io/gh/splunk/ssc-client-js/branch/develop/graph/badge.svg?token=R5kexVYymt)](https://codecov.io/gh/splunk/ssc-client-js)

# Code Styling and Conventions
- Auto-formatters and Linters
    - [eslint Documentation](https://eslint.org/)
        - See [.eslintrc](.eslintrc.js)
    - [Prettier Documentation](https://prettier.io/)
        - See [.prettierrc](.prettierrc)
- Documentation Generation
    - [JSDoc Documentation](http://usejsdoc.org/)
        - See [jsdoc.json](jsdoc.json)

# Configurations
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
- Install Codeship's JET CLI
    - [Codeship JET CLI installation documentation](https://documentation.codeship.com/pro/jet-cli/installation/)
    - Command(s)
        - `brew cask install codeship/taps/jet`

## Repository Environment
### OSX
- Install JavaScript dependencies
    - Command(s)
        - From the root of the repository
        - `yarn`

# Testing
## Test Coverage
The SDK team has decided to use stubby as a functional testing resource in lieu of making redundant unit tests.

## Local Testing
### Local With - Ad-Hoc Functional Testing
To create a local stubby environment for testing

- `yarn start:stubserver`
    - This spins up a local stubby server
- `yarn test`
    - This will run the tests
- `yarn stop:stubserver`
    - This will terminate the stubby server

### Local Testing - Run the Full Suite of Tests

- Go to `https://app.codeship.com/projects/283657/configure`
- Download AES key from the codeship project 
    - Save it as `codeship.aes`
- Place the AES key in the root directory
- From the root directory enter `jet steps`

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

[contributions]:            http://dev.splunk.com/view/opensource/SP-CAAAEDM
[indivcontrib]:             http://dev.splunk.com/goto/individualcontributions
[companycontrib]:           http://dev.splunk.com/view/companycontributions/SP-CAAAEDR
[answers]:                  http://answers.splunk.com/
[repo]:                     https://github.com/splunk/ssc-client-js
[issues]:                   https://github.com/splunk/ssc-client-js/issues
[pulls]:                    https://github.com/splunk/ssc-client-js/pulls
