import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import { SplunkCloud } from '../../src/splunk';
import { PipelineRequest, PipelineStatus } from '../../src/streams';
import config from '../config';

chai.use(chaiAsPromised);

const { expect, assert } = chai;

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

    let pipelineId1: string | null = null;
    let pipelineId2: string | null = null;

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
                .then(createPipelineResponse1 => {
                    assert.isNotNull(createPipelineResponse1);
                    assert.equal(createPipelineResponse1.status, PipelineStatus.Created);
                    assert.equal(createPipelineResponse1.name, testPipelineName1);
                    assert.equal(createPipelineResponse1.description, testPipelineDescription);
                    pipelineId1 = createPipelineResponse1.id;
                    assert.isNotNull(createPipelineResponse1.data);

                    assert.isNotNull(createPipelineResponse1.data.nodes);
                    assert.typeOf(createPipelineResponse1.data.nodes, 'array');
                    assert.equal(createPipelineResponse1.data.nodes.length, 2);

                    for (const node of createPipelineResponse1.data.nodes) {
                        assert.isNotNull(node.id);
                        assert.isNotNull(node.op);
                    }

                    assert.isNotNull(createPipelineResponse1.data.edges);
                    assert.typeOf(createPipelineResponse1.data.edges, 'array');
                    assert.equal(createPipelineResponse1.data.edges.length, 1);
                    for (const edge of createPipelineResponse1.data.edges) {
                        assert.isNotNull(edge.sourceNode);
                        assert.isNotNull(edge.sourcePort);
                        assert.isNotNull(edge.targetNode);
                        assert.isNotNull(edge.targetPort);
                    }

                    return createPipelineRequest(testPipelineName2, testPipelineDescription);
                })
                .then(createPipelineRequestResponse2 => {
                    return splunkCloud.streams.createPipeline(createPipelineRequestResponse2);
                })
                .then(createPipelineResponse2 => {
                    assert.isNotNull(createPipelineResponse2);
                    assert.equal(createPipelineResponse2.status, PipelineStatus.Created);
                    assert.equal(createPipelineResponse2.name, testPipelineName2);
                    assert.equal(createPipelineResponse2.description, testPipelineDescription);
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
            return splunkCloud.streams.getPipelines().then(getPipelinesResponse1 => {
                assert.isNotNull(getPipelinesResponse1);
            });
        });
    });

    describe('Test Activate Pipeline', () => {
        it('Should activate the newly created pipeline', () => {
            const activatePipelineRequest = {
                ids: [pipelineId1 as string],
                skipSavePoint: true,
            };
            return splunkCloud.streams
                .activatePipeline(activatePipelineRequest)
                .then(activatePipelineResponse => {
                    assert.isNotNull(activatePipelineResponse);
                    expect(activatePipelineResponse.activated).to.contain(pipelineId1 as string);

                    return splunkCloud.streams
                        .getPipeline(pipelineId1 as string)
                        .then(getPipelineResponse => {
                            assert.isNotNull(getPipelineResponse);
                            assert.equal(getPipelineResponse.name, testPipelineName1);
                            assert.equal(getPipelineResponse.description, testPipelineDescription);
                            assert.equal(getPipelineResponse.status, PipelineStatus.Activated);
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
            const deactivatePipelineRequest = {
                ids: [pipelineId1 as string],
                skipSavePoint: true,
            };
            return splunkCloud.streams
                .deactivatePipeline(deactivatePipelineRequest)
                .then(deactivatePipelineResponse => {
                    assert.isNotNull(deactivatePipelineResponse);
                    expect(
                        deactivatePipelineResponse.deactivated
                    ).to.contain(pipelineId1 as string);

                    return splunkCloud.streams.getPipeline(pipelineId1 as string);
                })
                .then(getPipelineResponse => {
                    assert.isNotNull(getPipelineResponse);
                    assert.equal(getPipelineResponse.statusMessage, PipelineStatus.Deactivated);
                });
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
function createPipelineRequest(name: string, description: string): Promise<PipelineRequest> {
    const dsl = {
        dsl: 'events = read-splunk-firehose(); write-splunk-index(events);',
    };
    return splunkCloud.streams
        .compileDslToUpl(dsl)
        .then(response => {
            assert.isNotNull(response);
            const pipelineRequest = {
                description,
                name,
                bypassValidation: true,
                createUserId: config.stagingTenant,
                data: response,
            } as PipelineRequest;
            return pipelineRequest;
        })
        .catch(error => {
            throw error;
        });
}
