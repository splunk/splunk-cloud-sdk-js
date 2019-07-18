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

import { assert } from 'chai';
import { execFile } from 'child_process';
import * as fs from 'fs';
import 'mocha';
import * as path from 'path';

// Reads all examples in and executes them using the appropriate runner

const runners: any = {
    '.js': 'node',
    '.ts': 'ts-node'
};


const examplesPath = path.join(__dirname, '..', '..', 'examples');
const examples = fs.readdirSync(examplesPath);

examples.forEach((exampleFile: string) => {
    const extension = path.extname(exampleFile);
    if (extension === '.js' || extension === '.ts') {
        describe(`Testing ${exampleFile} example`, () => {
            it('should execute successfully', (done) => {
                execFile(runners[path.extname(exampleFile)], [path.join(examplesPath, exampleFile)], (error: any, stdout: string, stderr: string) => {
                    console.log('========================== STDERR ==========================');
                    console.log(stderr);
                    console.log('========================== STDOUT ==========================');
                    console.log(stdout);
                    if (error) {
                        console.log('======================== NODE ERROR ========================');
                    }
                    console.log('============================================================');
                    assert.isEmpty(stderr);
                    done(error);
                });
            });
        });
    }
});
