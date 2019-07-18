/**
 * Copyright 2019 Splunk, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"): you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

const Handlebars = require('handlebars');
const child_process = require('child_process');
const fs = require('fs');
const package = require('../package.json');

const templateData = fs.readFileSync('src/version.ts.template', {encoding: 'utf-8'});
const template = Handlebars.compile(templateData);
const branch = child_process.execSync('git rev-parse --abbrev-ref HEAD', {encoding: 'utf-8'}).trim();
const commit = child_process.execSync('git rev-parse --short HEAD', {encoding: 'utf-8'}).trim();

const versionFileData = template({
    useragent: 'client-js',
    version: package.version || 'unknown',
    branch: branch || 'unknown',
    commit: commit || 'unknown',
});
fs.writeFileSync('src/version.ts', versionFileData, {encoding: 'utf-8'});

