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
