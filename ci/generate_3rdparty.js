const crawler = require('npm-license-crawler');
const path = require('path');
const markdownlint = require('markdownlint');
const fs = require('fs');

const thirdPartyLicenseFileName = 'THIRD-PARTY-CREDITS.md';
const thirdPartyLicenseFile = path.join(__dirname, '..', thirdPartyLicenseFileName);

function createMarkdown(deps) {
    let document = '\n# Third-party software credits\n\n';
    document += 'The Splunk Developer Cloud SDK for JavaScript contains some libraries that were written by others, and are being redistributed as part of the SDK, under their respective open source licenses.\n';
    document += '\nWe want to thank the contributors to these projects:\n';

    for (const dependencyKey of Object.keys(deps)) {
        // Deps can be in the formats: @scope/name@x.y.z, name@x.y.z so we need to split on the last @
        const splitPosition = dependencyKey.lastIndexOf('@');
        const name = dependencyKey.substring(0, splitPosition);
        const version = dependencyKey.substring(splitPosition+1, dependencyKey.length);

        const currentDependency = deps[dependencyKey];

        document += `\n## ${name}\n\n`;
        document += `Name: ${name}\n\n`;
        document += `Version: ${version}\n\n`;

        if (typeof currentDependency.licenses !== 'string') {
            throw new Error(`Unexpected licenses: ${currentDependency.licenses} of type: ${typeof currentDependency.licenses}`);
        }

        document += `License: [${currentDependency.licenses}](${currentDependency.licenseUrl})\n\n`;

        if (currentDependency.repository) {
            document += `Repository: [${currentDependency.repository}](${currentDependency.repository})\n`;
        }

    }

    return document;
}

const crawlerOptions = {
    start: [path.join(__dirname, '..')],
    exclude: [path.join(__dirname, '..', 'node_modules')],
    noColor: true,
    onlyDirectDependencies: true,
    development: true
};

crawler.dumpLicenses(crawlerOptions,(error, res) => {
    if (error) {
        throw error;
    }
    else {
        const thirdPartyCredits = createMarkdown(res);
        const markdownlintOptions = {
            strings: { thirdPartyCredits },
            config: { 'line-length': false }
        };

        const markdownErrors = markdownlint.sync(markdownlintOptions);
        if (markdownErrors.thirdPartyCredits.length > 0) {
            console.log(markdownErrors.toString());
            throw new Error('Invalid markdown');
        }

        const currentFile = fs.readFileSync(thirdPartyLicenseFile).toString();
        if (currentFile === thirdPartyCredits) {
            console.log(`Nothing to update in ${thirdPartyLicenseFileName}.`);
        } else {
            // If running in CI, fail if this file is stale
            if (process.env.CI) {
                throw new Error(`${thirdPartyLicenseFileName} is stale, please run 'yarn third-party-licenses'.`);
            }
            else {
                fs.writeFileSync(thirdPartyLicenseFile, thirdPartyCredits);
                console.log(`Successfully updated ${thirdPartyLicenseFileName}`);
            }
        }
    }
});
