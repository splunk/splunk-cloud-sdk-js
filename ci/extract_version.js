const Handlebars = require('handlebars');
const child_process = require('child_process');
const fs = require('fs');
const package = require('../package.json');

const templateData = fs.readFileSync('version.ts.template', {encoding: 'utf-8'});
const template = Handlebars.compile(templateData);
const branch = child_process.execSync('git rev-parse --abbrev-ref HEAD', {encoding: 'utf-8'}).trim();
const commit = child_process.execSync('git rev-parse --short HEAD', {encoding: 'utf-8'}).trim();

const versionFileData = template({
    useragent: 'ssc-js-sdk',
    version: package.version || 'unknown',
    branch: branch || 'unknown',
    commit: commit || 'unknown',
});
fs.writeFileSync('version.ts', versionFileData, {encoding: 'utf-8'});

