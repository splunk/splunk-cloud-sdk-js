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
import { mlModels } from '../../ml';
import { SplunkCloud } from '../../splunk';
import config from '../config';

const splunkCloud = new SplunkCloud({
    urls: {
        api: config.stagingApiHost,
        app: config.stagingAppsHost,
    },
    tokenSource: config.stagingAuthToken,
    defaultTenant: config.stagingMLTenant,
});

const hostTrain = 'server_power_train_ef5wlcd4njiovmdl';
const hostTest = 'server_power_test_ef5wlcd4njiovmdl';
const hostOut = 'server_power_out_ef5wlcd4njiovmdl';

const workflowName = 'PredictServerPowerConsumption';
const buildSpl = `| from mlapishowcase.mlapishowcase where host="${hostTrain}"`;
const runSpl = `| from mlapishowcase.mlapishowcase where host="${hostTest}"`;

describe('integration tests using ML service', () => {
    describe('Create tests', () => {
        it('should create workflow', () => {
            return newWorkflow().then(workflow => {
                assert.isNotNull(workflow.id);
                assert.equal(workflow.name, workflowName);
                assert.isNotNull(workflow.creationTime);
                assert.isNotEmpty(workflow.tasks);
                return cleanupWorkflow(workflow.id as string);
            });
        });
        it('should create workflow build', () => {
            return newWorkflow().then(workflow => {
                assert.isNotNull(workflow);
                return newWorkflowBuild(workflow.id as string).then(workflowBuild => {
                    assert.isNotNull(workflowBuild.id);
                    assert.isNotNull(workflowBuild.creationTime);
                    assert.notEqual(mlModels.WorkflowBuildStatusEnum.Failed, workflowBuild.status);
                    // Deleting a workflow will delete the builds also
                    return cleanupWorkflow(workflow.id as string);
                });
            });
        });
        it('should create workflow run', () => {
            return newWorkflow().then(workflow => {
                assert.isNotNull(workflow);
                return newWorkflowBuild(workflow.id as string).then(workflowBuild => {
                    assert.isNotNull(workflowBuild.id);
                    return newWorkflowRun(workflow.id as string, workflowBuild.id as string).then(workflowRun => {
                        assert.isNotNull(workflowRun.id);
                        assert.notEqual(mlModels.WorkflowRunStatusEnum.Failed, workflowRun.status);
                        // Deleting a workflow will delete the builds and runs also
                        return cleanupWorkflow(workflow.id as string);
                    });
                });
            });
        });
    });

    describe('Delete tests', () => {
        it('should delete workflow', () => {
            return newWorkflow().then(workflow => {
                return cleanupWorkflow(workflow.id as string);
            });
        });
        it('should delete workflow build', () => {
            return newWorkflow().then(workflow => {
                return newWorkflowBuild(workflow.id as string).then(workflowBuild => {
                    return cleanupWorkflowBuild(workflow.id as string, workflowBuild.id as string).then(() => {
                        return cleanupWorkflow(workflow.id as string);
                    });
                });
            });
        });
        it('should delete workflow run', () => {
            return newWorkflow().then(workflow => {
                return newWorkflowBuild(workflow.id as string).then(workflowBuild => {
                    return newWorkflowRun(workflow.id as string, workflowBuild.id as string).then(workflowRun => {
                        return cleanupWorkflowRun(workflow.id as string, workflowBuild.id as string, workflowRun.id as string).then(() => {
                            return cleanupWorkflowBuild(workflow.id as string, workflowBuild.id as string).then(() => {
                                return cleanupWorkflow(workflow.id as string);
                            });
                        });
                    });
                });
            });
        });
    });

    describe('List tests', () => {
        it('should list workflows', () => {
            return splunkCloud.ml.listWorkflows().then(workflows => {
                assert.isArray(workflows);
            });
        });
        it('should list workflow builds', () => {
            return newWorkflow().then(workflow => {
                assert.isNotNull(workflow);
                return splunkCloud.ml.listWorkflowBuilds(workflow.id as string).then(workflowBuilds => {
                    assert.isArray(workflowBuilds);
                    return cleanupWorkflow(workflow.id as string);
                });
            });
        });
        it('should list workflow runs', () => {
            return newWorkflow().then(workflow => {
                assert.isNotNull(workflow);
                return newWorkflowBuild(workflow.id as string).then(workflowBuild => {
                    assert.isNotNull(workflowBuild.id);
                    return splunkCloud.ml.listWorkflowRuns(workflow.id as string, workflowBuild.id as string).then(workflowRuns => {
                        assert.isArray(workflowRuns);
                        // Deleting a workflow will delete the builds also
                        return cleanupWorkflow(workflow.id as string);
                    });
                });
            });
        });
    });

    describe('Get tests', () => {
        it('should get workflow', () => {
            return newWorkflow().then(workflow => {
                return splunkCloud.ml.getWorkflow(workflow.id as string).then(wf => {
                    assert.equal(wf.id, workflow.id);
                    return cleanupWorkflow(workflow.id as string);
                });
            });
        });
        it('should get workflow build', () => {
            return newWorkflow().then(workflow => {
                return newWorkflowBuild(workflow.id as string).then(workflowBuild => {
                    return splunkCloud.ml.getWorkflowBuild(workflow.id as string, workflowBuild.id as string).then(wfb => {
                        assert.equal(wfb.id, workflowBuild.id);
                        return cleanupWorkflow(workflow.id as string);
                    });
                });
            });
        });
        it('should get workflow run', () => {
            return newWorkflow().then(workflow => {
                return newWorkflowBuild(workflow.id as string).then(workflowBuild => {
                    return newWorkflowRun(workflow.id as string, workflowBuild.id as string).then(workflowRun => {
                        return splunkCloud.ml.getWorkflowRun(workflow.id as string, workflowBuild.id as string, workflowRun.id as string).then(wfr => {
                            assert.equal(wfr.id, workflowRun.id);
                            return cleanupWorkflow(workflow.id as string);
                        });
                    });
                });
            });
        });
    });
});


// Utility functions

function newWorkflow(): Promise<mlModels.Workflow> {
    const task: mlModels.FitTask = {
        kind: mlModels.FitTaskKindEnum.Fit,
        algorithm: 'LinearRegression',
        fields: {
            features: [
                'total-unhalted_core_cycles',
                'total-instructions_retired',
                'total-last_level_cache_references',
                'total-memory_bus_transactions',
                'total-cpu-utilization',
                'total-disk-accesses',
                'total-disk-blocks',
                'total-disk-utilization'
            ],
            target: 'ac_power'
        },
        outputTransformer: 'example_server_power',
        parameters: {
            fit_intercept: 'true',
            normalize: 'false',
        }
    };

    const workflow: mlModels.Workflow = {
        name: workflowName,
        tasks: [task]
    };

    return splunkCloud.ml.createWorkflow(workflow);
}

function newWorkflowBuild(workflowId: string): Promise<mlModels.WorkflowBuild> {
    const source: mlModels.SPL = {
        module: 'mlapishowcase',
        query: buildSpl,
        extractAllFields: true,
        queryParameters: {
            earliest: '0',
            latest: 'now'
        }
    };

    const inputData: mlModels.InputData = {
        source,
        kind: mlModels.InputDataKindEnum.SPL,
    };

    const workflowBuild: mlModels.WorkflowBuild = {
        input: inputData
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
    const source: mlModels.InputDataSource = {
        module: 'mlapishowcase',
        query: runSpl,
        extractAllFields: true,
        queryParameters: {
            earliest: '0',
            latest: 'now'
        }
    };

    const inputData: mlModels.InputData = {
        source,
        kind: mlModels.InputDataKindEnum.SPL
    };

    const destination: mlModels.OutputDataDestination = {
        attributes: {
            index: 'mlapishowcase',
            module: 'mlapishowcase'
        },
        source: 'mlapi-showcase',
        host: hostOut
    };

    const outputData: mlModels.OutputData = {
        destination,
        kind: mlModels.OutputDataKindEnum.Events,
    };

    const workflowRun: mlModels.WorkflowRun = {
        input: inputData,
        output: outputData,
    };
    return splunkCloud.ml.createWorkflowRun(workflowId, workflowBuildId, workflowRun);
}


function cleanupWorkflow(workflowId: string): Promise<object> {
    return splunkCloud.ml.deleteWorkflow(workflowId);
}

function cleanupWorkflowBuild(workflowId: string, workflowBuildId: string): Promise<object> {
    return splunkCloud.ml.deleteWorkflowBuild(workflowId, workflowBuildId);
}

function cleanupWorkflowRun(workflowId: string, workflowBuildId: string, workflowRunId: string): Promise<object> {
    return splunkCloud.ml.deleteWorkflowRun(workflowId, workflowBuildId, workflowRunId);
}
