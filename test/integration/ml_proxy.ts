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
import 'mocha';
import { ingestModels } from '../../ingest';
import { EventBatcher } from '../../ingest_event_batcher';
import { mlModels } from '../../ml';
import { SplunkCloud } from '../../splunk';
import config from '../config';
import * as rawdata from '../data/ml/iris.json';

const splunkCloud = new SplunkCloud({
    urls: {
        api: config.stagingApiHost,
        app: config.stagingAppsHost,
    },
    tokenSource: config.stagingAuthToken,
    defaultTenant: config.stagingMLTenant,
});

const workflowName = 'PCAIris';
const base64DATA = 'LHNlcGFsX2xlbmd0aCxzZXBhbF93aWR0aCxwZXRhbF9sZW5ndGgscGV0YWxfd2lkdGgsc3BlY2llcw0KMCw1LjEsMy41LDEuNCwwLjIsSXJpcyBTZXRvc2ENCjUwLDcuMCwzLjIsNC43LDEuNCxJcmlzIFZlcnNpY29sb3INCjEwMCw2LjMsMy4zLDYuMCwyLjUsSXJpcyBWaXJnaW5pY2ENCg==';

describe('integration tests using ML service', () => {
    // ingest testing data
    before(() => {
        const events = generateEvents(rawdata);
        const eb: EventBatcher = new EventBatcher(splunkCloud.ingest, 1000, events.length, 3000);
        try {
            for (const e of events) {
                const event = e as ingestModels.Event;
                eb.add(event).then(response => {
                    assert.isNotNull(response);
                    assert.deepEqual(response.code, 'SUCCESS');
                    console.log(response);
                }).catch(err => {
                    assert.fail(err);
                });
            }
        } finally {
            eb.stop().then(response => {
                console.log('Stopping the event batcher (flushing pending events in the queue, if any):', response);
            }).catch(err => console.log(err));
        }
    });
    describe('workflow operations', () => {
        let workflowID: string;
        let buildID: string;
        let runID: string;
        let deploymentID: string;
        before(() => {
            const tasks = createFitTasks();
            return splunkCloud.ml.createWorkflow({ tasks, name: workflowName }).then(workflow => {
                assert.isNotNull(workflow);
                workflowID = workflow.id as string;
                assert.equal(workflow.name, workflowName);
                assert.isNotNull(workflow.creationTime);
                assert.isNotEmpty(workflow.tasks);
            });
        });
        after(async () => {
            try {
                await splunkCloud.ml.deleteWorkflowDeployment(workflowID as string, buildID as string, deploymentID as string);
                await splunkCloud.ml.deleteWorkflowRun(workflowID as string, buildID as string, runID as string);
                await splunkCloud.ml.deleteWorkflowBuild(workflowID as string, buildID as string);
                await splunkCloud.ml.deleteWorkflow(workflowID as string);
            } catch (error) {
                assert.fail(error);
            }
        });
        it('should get workflow', () => {
            return splunkCloud.ml.getWorkflow(workflowID as string).then(wf => {
                assert.equal(wf.id, workflowID);
            });
        });
        it('should list workflows', () => {
            return splunkCloud.ml.listWorkflows().then(workflows => {
                assert.isArray(workflows);
            });
        });
        it('should create workflow build', () => {
            return newWorkflowBuild(workflowID as string).then(workflowBuild => {
                assert.isNotNull(workflowBuild.id);
                buildID = workflowBuild.id as string;
                assert.isNotNull(workflowBuild.creationTime);
                assert.notEqual(mlModels.WorkflowBuildStatusEnum.Failed, workflowBuild.status);
            });
        });
        it('should get workflow build', () => {
            return splunkCloud.ml.getWorkflowBuild(workflowID as string, buildID as string).then(wfb => {
                assert.equal(wfb.id, buildID);
            });
        });
        it('should create workflow run', () => {
            return newWorkflowRun(workflowID as string, buildID as string).then(workflowRun => {
                assert.isNotNull(workflowRun.id);
                runID = workflowRun.id as string;
                assert.notEqual(mlModels.WorkflowRunStatusEnum.Failed, workflowRun.status);
            });
        });
        it('should get workflow run', () => {
            return splunkCloud.ml.getWorkflowRun(workflowID as string, buildID as string, runID as string).then(wfr => {
                assert.equal(wfr.id, runID);
            });
        });
        it('should create workflow deployment', () => {
            return splunkCloud.ml.createWorkflowDeployment(workflowID as string, buildID as string, { spec: {} } as mlModels.WorkflowDeployment).then(wfd => {
                assert.isNotNull(wfd.id);
                deploymentID = wfd.id as string;
            });
        });
        it('should get workflow deployment', () => {
            return splunkCloud.ml.getWorkflowDeployment(workflowID as string, buildID as string, deploymentID as string).then(wfd => {
                assert.equal(wfd.id, deploymentID);
            });
        });
        it('should list workflow builds', () => {
            return splunkCloud.ml.listWorkflowBuilds(workflowID as string).then(workflowBuilds => {
                assert.isArray(workflowBuilds);
                assert.isAtLeast(workflowBuilds.length, 1);
            });
        });
        it('should list workflow runs', () => {
            return splunkCloud.ml.listWorkflowRuns(workflowID as string, buildID as string).then(workflowRuns => {
                assert.isArray(workflowRuns);
                assert.isAtLeast(workflowRuns.length, 1);
            });
        });
    });
});


// Utility functions

function createFitTasks(): mlModels.FitTask[] {
    const task1: mlModels.FitTask = {
        name: 'PCA_js',
        kind: mlModels.FitTaskKindEnum.Fit,
        algorithm: 'PCA',
        fields: {
            features: [
                'petal_length',
                'petal_width',
                'sepal_length',
                'sepal_width'
            ],
            target: '',
            created: ['PC_1', 'PC_2', 'PC_3']
        },
        outputTransformer: 'PCA_model',
        parameters: {
            k: 3
        }
    };

    const task2: mlModels.FitTask = {
        name: 'RandomForestClassifier',
        kind: mlModels.FitTaskKindEnum.Fit,
        algorithm: 'RandomForestClassifier',
        fields: {
            features: [
                'PC_1',
                'PC_2',
                'PC_3'],
            target: 'species',
            created: ['predicted(species)'],
        },
        outputTransformer: 'RFC_model',
        parameters: {
            n_estimators: 25,
            max_depth: 10,
            min_samples_split: 5,
            max_features: 'auto',
            criterion: 'gini'
        }
    };
    return [task1];
}

function newWorkflowBuild(workflowId: string): Promise<mlModels.WorkflowBuild> {
    const source: mlModels.RawData = {
        data: base64DATA
    };

    const inputData: mlModels.InputData = {
        source,
        kind: mlModels.InputDataKindEnum.RawData,
    };

    const workflowBuild: mlModels.WorkflowBuild = {
        input: inputData,
        name: 'testWorkflowbBuildJS'
    };

    return splunkCloud.ml.createWorkflowBuild(workflowId, workflowBuild).then(createdBuild => {

        // Wait for the build to complete
        return new Promise<mlModels.WorkflowBuild>((resolve, reject) => {
            const interval = setInterval(() => {
                // We don't return this promise because we're creating an async wait
                // tslint:disable-next-line
                splunkCloud.ml.getWorkflowBuild(workflowId, createdBuild.id as string).then(fetchedBuild => {
                    switch (fetchedBuild.status) {
                        case mlModels.WorkflowBuildStatusEnum.Failed:
                        case mlModels.WorkflowBuildStatusEnum.Success:
                            clearInterval(interval);
                            return resolve(fetchedBuild);
                    }
                }).catch((err) => {
                    clearInterval(interval);
                    return reject(err);
                });
            }, 5000);
        });
    });
}

function newWorkflowRun(workflowId: string, workflowBuildId: string): Promise<mlModels.WorkflowRun> {
    const source: mlModels.RawData = {
        data: base64DATA
    };

    const inputData: mlModels.InputData = {
        source,
        kind: mlModels.InputDataKindEnum.RawData
    };

    const destination: mlModels.OutputDataDestination = {
        attributes: {
            key: 'iris.json'
        }
    };

    const outputData: mlModels.OutputData = {
        destination,
        kind: mlModels.OutputDataKindEnum.Events,
    };

    const workflowRun: mlModels.WorkflowRun = {
        name: 'tesWorkflowRunJS',
        input: inputData,
        output: outputData,
    };
    return splunkCloud.ml.createWorkflowRun(workflowId, workflowBuildId, workflowRun);
}

function generateEvents(dataset: any[]): ingestModels.Event[] {
    return dataset.map(data => {
        return {
            body: JSON.stringify(data),
            sourcetype: 'json',
            source: 'jssdk-ml-tests',
            attributes: { index: 'main' }
        } as ingestModels.Event;
    });
}