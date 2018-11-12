import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import { SplunkCloud } from '../../splunk';
import { PipelineRequest, PipelineStatus } from '../../streams';
import config from '../config';

chai.use(chaiAsPromised);

const { expect, assert } = chai;

const splunkCloud = new SplunkCloud({ urls: { api: config.stagingApiHost, app: config.stagingAppsHost }, tokenSource: config.stagingAuthToken, defaultTenant: config.stagingTenant });


describe('Integration tests for Streams Pipeline Endpoints', () => {
    const testPipelineName1 = `testPipeline01${Date.now()}`;
    const testPipelineName2 = `testPipeline02${Date.now()}`;
    const testUpdatedPipelineName = `updated${testPipelineName1}`;
    const testPipelineDescription = 'integration test pipeline';

    let pipelineId1: string | null;
    let pipelineId2: string | null;

    beforeEach(() => {
        pipelineId1 = null;
        pipelineId2 = null;
    });

    afterEach(() => {
        if (pipelineId1 !== null) {
            return splunkCloud.streams.deletePipeline(pipelineId1)
                .catch(err => console.log(`Error cleaning the test pipeline1: ${err}`));
        }
    });

    afterEach(() => {
        if (pipelineId2 !== null) {
            return splunkCloud.streams.deletePipeline(pipelineId2)
                .catch(err => console.log(`Error cleaning the test pipeline2: ${err}`));
        }
    });

    describe('Test GET all Pipelines', () => {
        it('Should return all the pipelines', () => {
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

                    return splunkCloud.streams.getPipelines();
                })
                .then(getPipelinesResponse1 => {
                    assert.isNotNull(getPipelinesResponse1);

                    const activatePipelineRequest = {
                        ids: [
                            pipelineId2 as string
                        ],
                        skipSavePoint: true
                    };
                    return splunkCloud.streams.activatePipeline(activatePipelineRequest);
                })
                .then(activatePipelineResponse => {
                    assert.isNotNull(activatePipelineResponse);
                    assert(activatePipelineResponse.activated, pipelineId2 as string);

                    const queryParams = { name: testPipelineName2 };
                    return splunkCloud.streams.getPipelines(queryParams);
                })
                .then(getPipelinesResponse2 => {
                    assert.isNotNull(getPipelinesResponse2);
                    assert.equal(getPipelinesResponse2.items.length, 1);
                    assert.equal(getPipelinesResponse2.items[0].name, testPipelineName2);
                });
        });
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
                    assert.typeOf(createPipelineResponse1.data.nodes, 'array', 'Nodes response data should be an array');
                    assert.equal(createPipelineResponse1.data.nodes.length, 4);

                    for (const node of createPipelineResponse1.data.nodes) {
                        assert('id' in node, 'node should contain key: id');
                        assert('op' in node, 'node should contain key: op');
                    }

                    assert.isNotNull(createPipelineResponse1.data.edges);
                    assert.typeOf(createPipelineResponse1.data.edges, 'array', 'Edges response data should be an array');
                    assert.equal(createPipelineResponse1.data.edges.length, 3);
                    for (const edge of createPipelineResponse1.data.edges) {
                        assert('sourceNode' in edge, 'edge should contain key: sourceNode');
                        assert('sourcePort' in edge, 'edge should contain key: sourcePort');
                        assert('targetNode' in edge, 'edge should contain key: targetNode');
                        assert('targetPort' in edge, 'edge should contain key: targetPort');
                    }

                    return splunkCloud.streams.getPipeline(pipelineId1 as string);
                })
                .then(getPipelineResponse => {
                    assert.isNotNull(getPipelineResponse);
                    assert.equal(getPipelineResponse.name, testPipelineName1);
                    assert.equal(getPipelineResponse.description, testPipelineDescription);
                });
        });
    });

    describe('Test Activate Pipeline', () => {
        it('Should activate the newly created pipeline', () => {
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

                    const activatePipelineRequest = {
                        ids: [
                            pipelineId1 as string
                        ],
                        skipSavePoint: true
                    };
                    return splunkCloud.streams.activatePipeline(activatePipelineRequest);
                })
                .then(activatePipelineResponse => {
                    assert.isNotNull(activatePipelineResponse);
                    expect(activatePipelineResponse.activated).to.contain(pipelineId1 as string);

                    return splunkCloud.streams.getPipeline(pipelineId1 as string);
                }).then(getPipelineResponse => {
                    assert.isNotNull(getPipelineResponse);
                    assert.equal(getPipelineResponse.name, testPipelineName1);
                    assert.equal(getPipelineResponse.description, testPipelineDescription);
                    assert.equal(getPipelineResponse.status, PipelineStatus.Activated);
                });
        });
    });

    describe('Test Deactivate Pipeline', () => {
        it('Should deactivate the newly created pipeline', () => {
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

                    const activatePipelineRequest = {
                        ids: [
                            pipelineId1 as string
                        ],
                        skipSavePoint: true
                    };
                    return splunkCloud.streams.activatePipeline(activatePipelineRequest);
                })
                .then(activatePipelineResponse => {
                    assert.isNotNull(activatePipelineResponse);
                    expect(activatePipelineResponse.activated).to.contain(pipelineId1 as string);

                    const deactivatePipelineRequest = {
                        ids: [
                            pipelineId1 as string
                        ],
                        skipSavePoint: true
                    };
                    return splunkCloud.streams.deactivatePipeline(deactivatePipelineRequest);
                }).then(deactivatePipelineResponse => {
                    assert.isNotNull(deactivatePipelineResponse);
                    assert.isNotNull(deactivatePipelineResponse);
                    expect(deactivatePipelineResponse.deactivated).to.contain(pipelineId1 as string);

                    return splunkCloud.streams.getPipeline(pipelineId1 as string);
                }).then(getPipelineResponse => {
                    assert.isNotNull(getPipelineResponse);
                    assert.equal(getPipelineResponse.name, testPipelineName1);
                    assert.equal(getPipelineResponse.description, testPipelineDescription);
                    assert.equal(getPipelineResponse.statusMessage, PipelineStatus.Deactivated);
                });
        });
    });

    describe('Test Update Pipeline', () => {
        it('Should update an existing pipeline', () => {
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

                    return createPipelineRequest(testUpdatedPipelineName, 'Updated Integration Test Pipeline');
                })
                .then(createPipelineRequestResponse2 => {
                    assert.isNotNull(createPipelineRequestResponse2);
                    return splunkCloud.streams.updatePipeline(pipelineId1 as string, createPipelineRequestResponse2);
                })
                .then(updatePipelineResponse => {
                    assert.isNotNull(updatePipelineResponse);

                    assert.equal(updatePipelineResponse.id, pipelineId1);
                    assert.equal(updatePipelineResponse.name, testUpdatedPipelineName);
                    assert.equal(updatePipelineResponse.description, 'Updated Integration Test Pipeline');

                    return splunkCloud.streams.getPipeline(pipelineId1 as string);
                })
                .then(getPipelineResponse => {
                    assert.isNotNull(getPipelineResponse);
                    assert.equal(getPipelineResponse.name, testUpdatedPipelineName);
                    assert.equal(getPipelineResponse.description, 'Updated Integration Test Pipeline');
                });
        });
    });
});

// Creates a test pipeline request
function createPipelineRequest(name: string, description: string) : Promise<PipelineRequest> {
    const dsl = {
        dsl: 'kafka-brokers="localhost:9092";input-topic = "intopic";output-topic-1 = "output-topic-1";events = deserialize-events(unauthenticated-read-kafka(kafka-brokers, input-topic, {}));unauthenticated-write-kafka(serialize-events(events, output-topic-1), kafka-brokers, {});'
    };
    return splunkCloud.streams.compileDslToUpl(dsl).then(response => {
        assert.isNotNull(response);
        return {
            description,
            name,
            bypassValidation: true,
            createUserId: config.stagingTenant,
            data: response
        } as PipelineRequest;
    }).catch(error => {
        throw error;
    });
}
