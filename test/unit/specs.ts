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
import * as fs from 'fs';
import 'mocha';
import * as path from 'path';

const generatedDir = path.join(__dirname, '..', '..', 'src', 'generated');
const services = fs.readdirSync(generatedDir);

// These dynamic tests ensure we have a spec file for reach codegen service, models & API files in the correct places
services.forEach((svc: string) => {
    if (svc === '.' || svc === '..' || svc === '.DS_Store') {
        return;
    }

    describe(`Checking ${svc} for spec, generated modles & generated API`, () => {
        const svcVersionsPath = path.join(generatedDir, svc);
        const svcVersions = fs.readdirSync(svcVersionsPath);
        svcVersions.forEach((svcVersion: string) => {
            if (svcVersion === '.DS_Store') {
                return;
            }
            it(`${svcVersion}`, (done) => {
                const svcVersionFiles = fs.readdirSync(path.join(svcVersionsPath, svcVersion));

                let foundSpec = false;
                let foundModels = false;
                let foundAPI = false;
                for (const filename of svcVersionFiles) {
                    switch(filename) {
                        case `${svc}.yaml`:
                            foundSpec = true;
                            break;
                        case 'models':
                            foundModels = true;
                            break;
                        case 'api.ts':
                            foundAPI = true;
                            break;
                    }
                }
                assert.ok(foundSpec, 'Spec was missing');
                assert.ok(foundModels, 'Models were missing');
                assert.ok(foundAPI, 'API was missing');
                done();
            });
        });
    });
});
