import { assert } from 'chai';
import 'mocha';
import { SplunkCloud } from '../../splunk';
import { streamsModels } from '../../streams';
import config from '../config';

const splunkCloud = new SplunkCloud({
    urls: { api: config.stagingApiHost, app: config.stagingAppsHost },
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
                    assert.equal(response.status, streamsModels.PipelineResponseStatusEnum.CREATED);
                    assert.equal(response.name, testPipelineName1);
                    assert.equal(response.description, testPipelineDescription);
                    assert.isNotNull(response.id);
                    pipelineId1 = response.id;
                    assert.isNotNull(response.data);

                    const pipeline = response.data as streamsModels.UplPipeline;
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
                    assert.equal(createPipelineResponse2.status, streamsModels.PipelineResponseStatusEnum.CREATED);
                    assert.equal(createPipelineResponse2.name, testPipelineName2);
                    assert.equal(createPipelineResponse2.description, testPipelineDescription);
                    assert.isNotNull(createPipelineResponse2.id);
                    pipelineId2 = createPipelineResponse2.id;
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
                            assert.equal(getPipelineResponse.status, streamsModels.PipelineResponseStatusEnum.ACTIVATED);
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
                //     assert.equal(getPipelineResponse.statusMessage, streamsModels.PipelineStatus.Deactivated);
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
function createPipelineRequest(name: string, description: string): Promise<streamsModels.PipelineRequest> {
    const dsl = {
        dsl: 'events = read-splunk-firehose(); write-index(events, "index", "main");',
    };
    return splunkCloud.streams
        .compileDSL(dsl)
        .then(response => {
            assert.isNotNull(response);
            return {
                description,
                name,
                bypassValidation: true,
                createUserId: config.stagingTenant,
                data: response,
            } as streamsModels.PipelineRequest;
        })
        .catch(error => {
            throw error;
        });
}
