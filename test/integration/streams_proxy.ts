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
import * as streams from '../../services/streams';
import { SplunkCloud } from '../../splunk';
import config from '../config';

const splunkCloud = new SplunkCloud({
    urls: {
        api: config.stagingApiHost
    },
    tokenSource: config.stagingAuthToken,
    defaultTenant: config.stagingTenant,
});

describe('Integration tests for Streams Pipeline Endpoints', () => {
    const testPipelineName1 = `testPipeline01${Date.now()}`;
    const testPipelineName2 = `testPipeline02${Date.now()}`;
    const testUpdatedPipelineName = `updated${testPipelineName1}`;
    const testPipelineDescription = 'integration test pipeline';

    let pipelineId1: any;
    let pipelineId2: any;

    after(() => {
        if (pipelineId1 !== null) {
            return splunkCloud.streams
                .deletePipeline(pipelineId1)
                .catch(err => console.log(`Error cleaning the test pipeline1: ${err}`));
        }
    });

    after(() => {
        if (pipelineId2 !== null) {
            return splunkCloud.streams
                .deletePipeline(pipelineId2)
                .catch(err => console.log(`Error cleaning the test pipeline2: ${err}`));
        }
    });

    describe('Test Create Pipeline', () => {
        it('Should return the newly created pipeline', () => {
            return createPipelineRequest(testPipelineName1, testPipelineDescription)
                .then(createPipelineRequestResponse1 => {
                    return splunkCloud.streams.createPipeline(createPipelineRequestResponse1);
                })
                .then(response => {
                    assert.isNotNull(response);
                    assert.equal(response.status, streams.PipelineResponseStatusEnum.CREATED);
                    assert.equal(response.name, testPipelineName1);
                    assert.equal(response.description, testPipelineDescription);
                    assert.isNotNull(response.id);
                    pipelineId1 = response.id;
                    assert.isNotNull(response.data);

                    const pipeline = response.data!;
                    assert.isNotNull(pipeline.nodes);
                    assert.typeOf(pipeline.nodes, 'array');
                    assert.equal(pipeline.nodes.length, 2);

                    for (const node of pipeline.nodes) {
                        assert.isNotNull(node.id);
                        assert.isNotNull(node.op);
                    }

                    assert.isNotNull(pipeline.edges);
                    assert.typeOf(pipeline.edges, 'array');
                    assert.equal(pipeline.edges.length, 1);
                    for (const edge of pipeline.edges) {
                        assert.isNotNull(edge.sourceNode);
                        assert.isNotNull(edge.sourcePort);
                        assert.isNotNull(edge.targetNode);
                        assert.isNotNull(edge.targetPort);
                    }
                    return splunkCloud.streams.validatePipeline({ upl: pipeline });
                }).then(validateResp => {
                    assert.isTrue(validateResp.success);
                    assert.isNotNull(validateResp.validationMessages);
                    return createPipelineRequest(testPipelineName2, testPipelineDescription);
                })
                .then(createPipelineRequestResponse2 => {
                    return splunkCloud.streams.createPipeline(createPipelineRequestResponse2);
                })
                .then(createPipelineResponse2 => {
                    assert.isNotNull(createPipelineResponse2);
                    assert.equal(createPipelineResponse2.status, streams.PipelineResponseStatusEnum.CREATED);
                    assert.equal(createPipelineResponse2.name, testPipelineName2);
                    assert.equal(createPipelineResponse2.description, testPipelineDescription);
                    assert.isNotNull(createPipelineResponse2.id);
                    pipelineId2 = createPipelineResponse2.id;
                });
        });
    });

    describe('Stream upload file', () => {
        const path = require('path');
        it('should return a successful response', () => {
            return splunkCloud.streams.uploadFile(path.join(__dirname, 'data', 'fileupload.csv')).then(response => {
                assert.equal(response.filename, 'fileupload.csv');
            });
        });
    });

    describe('Test GET a Pipeline by id', () => {
        it('Should expected pipeline', () => {
            return splunkCloud.streams
                .getPipeline(pipelineId1 as string)
                .then(getPipelineResponse => {
                    assert.isNotNull(getPipelineResponse);
                    assert.equal(getPipelineResponse.name, testPipelineName1);
                    assert.equal(getPipelineResponse.description, testPipelineDescription);
                });
        });
    });

    describe('Test GET all Pipelines', () => {
        it('Should return all the pipelines', () => {
            return splunkCloud.streams.listPipelines().then(getPipelinesResponse1 => {
                assert.isNotNull(getPipelinesResponse1);
            });
        });
    });

    describe('Test Activate Pipeline', () => {
        it('Should activate the newly created pipeline', () => {
            return splunkCloud.streams
                .activatePipeline(pipelineId1 as string, { activateLatestVersion: true })
                .then(activatePipelineResponse => {
                    assert.isNotNull(activatePipelineResponse);
                    assert.include(activatePipelineResponse.activated as string, pipelineId1);

                    return splunkCloud.streams
                        .getPipeline(pipelineId1 as string)
                        .then(getPipelineResponse => {
                            assert.isNotNull(getPipelineResponse);
                            assert.equal(getPipelineResponse.name, testPipelineName1);
                            assert.equal(getPipelineResponse.description, testPipelineDescription);
                            assert.oneOf(getPipelineResponse.status, [streams.PipelineResponseStatusEnum.ACTIVATED, streams.PipelineResponseStatusEnum.ACTIVATING]);
                        });
                });
        });
    });

    describe('Test Update Pipeline', () => {
        it('Should update an existing pipeline with new name and description', () => {
            const updatedDescription = 'Updated Integration Test Pipeline';
            return createPipelineRequest(testUpdatedPipelineName, updatedDescription)
                .then(createPipelineRequestResponse2 =>
                    splunkCloud.streams.updatePipeline(
                        pipelineId1 as string,
                        createPipelineRequestResponse2
                    )
                )
                .then(updatePipelineResponse => {
                    assert.isNotNull(updatePipelineResponse);

                    assert.equal(updatePipelineResponse.id, pipelineId1);
                    assert.equal(updatePipelineResponse.name, testUpdatedPipelineName);
                    assert.equal(updatePipelineResponse.description, updatedDescription);

                    return splunkCloud.streams.getPipeline(pipelineId1 as string);
                })
                .then(getPipelineResponse => {
                    assert.isNotNull(getPipelineResponse);
                    assert.equal(getPipelineResponse.name, testUpdatedPipelineName);
                    assert.equal(getPipelineResponse.description, updatedDescription);
                });
        });
    });

    describe('Test Deactivate Pipeline', () => {
        it('Should deactivate the newly created pipeline', () => {
            return splunkCloud.streams
                .deactivatePipeline(pipelineId1 as string, {})
                .then(deactivatePipelineResponse => {
                    assert.isNotNull(deactivatePipelineResponse);
                    assert.include(deactivatePipelineResponse.deactivated as string, pipelineId1);
                    // return splunkCloud.streams.getPipeline(pipelineId1 as string);
                });
            // .then(getPipelineResponse => {
            //     assert.isNotNull(getPipelineResponse);
            //     assert.equal(getPipelineResponse.statusMessage, streams.PipelineStatus.Deactivated);
            // });
        });
    });

    describe('Test DELETE a Pipeline', () => {
        it('Should delete pipeline by id', () => {
            return splunkCloud.streams.deletePipeline(pipelineId1 as string).then(() => {
                // Set the id to null to indicate this has been successfully deleted,
                // avoid deleting again in the after() hook
                pipelineId1 = null;
            });
        });
    });
});

// Creates a test pipeline request
function createPipelineRequest(name: string, description: string): Promise<streams.PipelineRequest> {
    const splCompileRequest: streams.SplCompileRequest = {
        spl: '| from splunk_firehose() | into index("index", "main");',
        validate: true,
    };

    return splunkCloud.streams
        .compile(splCompileRequest)
        .then(response => {
            assert.isNotNull(response);
            return {
                description,
                name,
                bypassValidation: true,
                createUserId: config.stagingTenant,
                data: response,
            } as streams.PipelineRequest;
        })
        .catch(error => {
            throw error;
        });
}
