# Contribution Guidelines

For general information about contributing to Splunk projects, see: 

-  [Splunk and open source](http://dev.splunk.com/view/opensource/SP-CAAAEDM)
-  [Individual contributions](http://dev.splunk.com/goto/individualcontributions)
-  [Company contributions](http://dev.splunk.com/view/companycontributions/SP-CAAAEDR)

## Issues and bug reports

If you see unexpected behavior with this project, please [create an issue on GitHub](/issues) with the following information:

-  A title and a clear description of the issue.
-  The project version (for example "0.1.4").
-  The framework version (for example "Node.js 8.11.3").
-  The browser version (for example "Chrome 67.0.3396.99").

If possible, include the following to help us reproduce the issue: 
-  A code sample that demonstrates the issue.
-  Any unit test cases that show how the expected behavior is not occurring.
-  An executable test case. 

If you have a question about Splunk, see [Splunk Answers](https://answers.splunk.com).

## Code formatting and styling

We recommend the following tools for formatting and styling JavaScript code:

-   [ESLint](https://eslint.org), a linting utility

    For configuration details, see [Configuring ESLint](https://eslint.org/docs/4.0.0/user-guide/configuring) on the ESLint website.

-   [Prettier](https://prettier.io), a code formatter

    For configuration details, see [Configuration File](https://prettier.io/docs/en/configuration.html) on the Prettier website.

-   [JSDoc](https://devdocs.io/jsdoc/), a tool for generating API documentation

## Development environment for Mac OS X

This section describes recommended tools for the Mac OS X development environment. 

### Install development tools

We recommend the [Homebrew](https://brew.sh/) package manager for *nix development environments. 

Run the following command to install Homebrew:

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Next, run the following command to update Homebrew: 

```
brew update
```

Use Homebrew to install additional tools:

-  [Node.js](https://nodejs.org), a JavaScript runtime

   ```
   brew install node
   ```

-  [Yarn](https://yarnpkg.com), a dependency manager

   ```
   brew install yarn
   ```

Install [Docker](https://www.docker.com/), a container platform. For installation details, see [Install Docker Desktop for Mac](https://docs.docker.com/docker-for-mac/install) on the Docker Docs website.

### Configure the repository environment

To install JavaScript dependencies, run the following command from the root of the project repository: 

```
yarn
```

## Git commit conventions

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format for Git commit messages. Using the format makes the commit history for the project more readable and generates a changelog automatically.

To enforce formatting of commit messages, use the [Commitizen](https://github.com/commitizen/cz-cli) CLI wizard:

1.  After staging your changes, run the following command: 

    ```
    yarn run commit
    ```

2.  Follow the prompts to finish formatting your commit messages.

### Commit message format

Use the following format for commit messages: 

```
<type>(<scope>): <subject>
<blank_line>
<body>
<blank_line>
<footer>
```

Use one of the following values for "type": 

| type     | Description                                                |
| :------- | :--------------------------------------------------------- |
| feat     | A new feature                                              |
| fix      | A bug fix                                                  |
| docs     | Documentation-only changes                                 |
| style    | Changes that do not affect the meaning of the code         |
| refactor | A code change that neither fixes a bug nor adds a feature  |
| release  | An aggregation of code changes to be used for a release    |
| perf     | A code change that improves performance                    |
| test     | A code change that adds, updates, or fixes tests           |
| ci       | A code change in the CI pipeline                           |
| revert   | Revert to a commit                                         |

Scopes are broken down at a service level. The value for "scope" must be one of the following:

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

**Note:**  If your changes do not apply to any of the scopes above, or if your changes affect more than one scope, use a scope value of "*". 

### Subject and body rules

For the subject of the commit message, use a short description of the change:
* Start the description with present tense (for example, "add", not "added" nor "adds").
* Don't capitalize the first letter.
* Don't include references to JIRA tickets or GitHub issue numbers.

For the body of the commit, follow the rules above and include detailed descriptions of the code changes.

## Submit a pull request

1. Fill out the [Individual Contributor Agreement](http://dev.splunk.com/goto/individualcontributions).

2. Configure your development environment as described above.

3. Create a new branch. For example:

    ```
    git checkout -b my-branch develop
    ```

3. Make code changes in your branch with tests, using the code formatting and styling tools listed above. 

4. Check for lint errors.

    ```
    yarn run tslint
    ```

5. Commit your changes. Be sure to adhere to the Conventional Commits format.

    ```
    yarn commit
    ```

6. Push your branch to GitHub.

    ```
    git push origin my-branch
    ```

7. In GitHub, create a pull request that targets the **develop** branch. CI tests are run automatically.
8. After the pull request is merged, delete your branch.
9. Pull changes from the **develop** branch.

    ```
    git checkout develop
    git pull develop
    ```

## Generate documentation

To generate documentation, enter the following command: 

```
yarn ts:docs
```

## Contact us

If you have questions, reach out to us on [Slack](https://splunkdevplatform.slack.com) in the **#sdc** channel or email us at _sdcbeta@splunk.com_.