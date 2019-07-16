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
