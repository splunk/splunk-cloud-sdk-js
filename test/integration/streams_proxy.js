const { assert } = require("chai");
const config = require("../config");
const { SplunkCloud } = require('../../splunk');

const splunkCloudHost = config.playgroundHost;
const token = config.playgroundAuthToken;
const tenantID = config.playgroundTenant;

const splunkCloud = new SplunkCloud(splunkCloudHost, token, tenantID);

// TODO: Replace strings 'CREATED', 'ACTIVATED' with enum PipelineStatus values
describe("Integration tests for Streams Pipeline Endpoints", () => {
    const TestPipelineName1 = `testPipeline01${Date.now()}`;
    const TestPipelineName2 = `testPipeline02${Date.now()}`;
    const TestUpdatedPipelineName = `updated${TestPipelineName1}`;
    const TestPipelineDescription = "integration test pipeline";

    var pipelineId1;
    var pipelineId2;

    beforeEach(() => {
        pipelineId1 = null;
        pipelineId2 = null;
    });

    afterEach(() => {
        if (pipelineId1 != null) {
            return splunkCloud.streams.deletePipeline(pipelineId1)
                .catch(err => console.log(`Error cleaning the test pipeline1: ${err}`));
        }
    });

    afterEach(() => {
        if (pipelineId2 != null) {
            return splunkCloud.streams.deletePipeline(pipelineId2)
                .catch(err => console.log(`Error cleaning the test pipeline2: ${err}`));
        }
    });

    describe("Test GET all Pipelines", () => {
        it("Should return all the pipelines", () => {
            return createPipelineRequest(TestPipelineName1, TestPipelineDescription)
                .then(createPipelineRequestResponse1 => {
                    return splunkCloud.streams.createPipeline(createPipelineRequestResponse1);
                })
                .then(createPipelineResponse1 => {
                    assert.isNotNull(createPipelineResponse1);
                    assert.equal(createPipelineResponse1["status"], 'CREATED');
                    assert.equal(createPipelineResponse1["name"], TestPipelineName1);
                    assert.equal(createPipelineResponse1["description"], TestPipelineDescription);
                    pipelineId1 = createPipelineResponse1["id"];

                    return createPipelineRequest(TestPipelineName2, TestPipelineDescription);
                })
                .then(createPipelineRequestResponse2 => {
                    return splunkCloud.streams.createPipeline(createPipelineRequestResponse2);
                })
                .then(createPipelineResponse2 => {
                    assert.isNotNull(createPipelineResponse2);
                    assert.equal(createPipelineResponse2["status"], 'CREATED');
                    assert.equal(createPipelineResponse2["name"], TestPipelineName2);
                    assert.equal(createPipelineResponse2["description"], TestPipelineDescription);
                    pipelineId2 = createPipelineResponse2["id"];

                    return splunkCloud.streams.getPipelines();
                })
                .then(getPipelinesResponse1 => {
                    assert.isNotNull(getPipelinesResponse1);

                    const activatePipelineRequest = {
                        "ids": [
                            pipelineId2
                        ],
                        "skipSavepoint": true
                    };
                    return splunkCloud.streams.activatePipeline(activatePipelineRequest);
                })
                .then(activatePipelineResponse => {
                    assert.isNotNull(activatePipelineResponse);
                    assert.equal(activatePipelineResponse["activated"], pipelineId2);

                    const queryParams = { name: TestPipelineName2 };
                    return splunkCloud.streams.getPipelines(queryParams);
                })
                .then(getPipelinesResponse2 => {
                    assert.isNotNull(getPipelinesResponse2);
                    assert.equal(getPipelinesResponse2["items"].length, 1);
                    assert.equal(getPipelinesResponse2["items"][0]["name"], TestPipelineName2);
                });
        });
    });

    describe("Test Create Pipeline", () => {
        it("Should return the newly created pipeline", () => {
            return createPipelineRequest(TestPipelineName1, TestPipelineDescription)
                .then(createPipelineRequestResponse1 => {
                    return splunkCloud.streams.createPipeline(createPipelineRequestResponse1);
                })
                .then(createPipelineResponse1 => {
                    assert.isNotNull(createPipelineResponse1);
                    assert.equal(createPipelineResponse1['status'], 'CREATED');
                    assert.equal(createPipelineResponse1["name"], TestPipelineName1);
                    assert.equal(createPipelineResponse1["description"], TestPipelineDescription);
                    pipelineId1 = createPipelineResponse1["id"];
                    assert.isNotNull(createPipelineResponse1["data"]);

                    assert.isNotNull(createPipelineResponse1["data"]["nodes"]);
                    assert.typeOf(createPipelineResponse1["data"]["nodes"], "array", "Nodes response data should be an array");
                    assert.equal(createPipelineResponse1["data"]["nodes"].length, 4);

                    createPipelineResponse1["data"]["nodes"].forEach(node => {
                        assert("id" in node, "node should contain key: id");
                        assert("op" in node, "node should contain key: op");
                    });

                    assert.isNotNull(createPipelineResponse1["data"]["edges"]);
                    assert.typeOf(createPipelineResponse1["data"]["edges"], "array", "Edges response data should be an array");
                    assert.equal(createPipelineResponse1["data"]["edges"].length, 3);
                    createPipelineResponse1["data"]["edges"].forEach(edge => {
                        assert("sourceNode" in edge, "edge should contain key: sourceNode");
                        assert("sourcePort" in edge, "edge should contain key: sourcePort");
                        assert("targetNode" in edge, "edge should contain key: targetNode");
                        assert("targetPort" in edge, "edge should contain key: targetPort");
                    });

                    return splunkCloud.streams.getPipeline(pipelineId1);
                })
                .then(getPipelineResponse => {
                    assert.isNotNull(getPipelineResponse);
                    assert.equal(getPipelineResponse["name"], TestPipelineName1);
                    assert.equal(getPipelineResponse["description"], TestPipelineDescription);
                });
        });
    });

    describe("Test Activate Pipeline", () => {
        it("Should activate the newly created pipeline", () => {
            return createPipelineRequest(TestPipelineName1, TestPipelineDescription)
                .then(createPipelineRequestResponse1 => {
                    return splunkCloud.streams.createPipeline(createPipelineRequestResponse1);
                })
                .then(createPipelineResponse1 => {
                    assert.isNotNull(createPipelineResponse1);
                    assert.equal(createPipelineResponse1['status'], 'CREATED');
                    assert.equal(createPipelineResponse1["name"], TestPipelineName1);
                    assert.equal(createPipelineResponse1["description"], TestPipelineDescription);
                    pipelineId1 = createPipelineResponse1["id"];

                    const activatePipelineRequest = {
                        "ids": [
                            pipelineId1
                        ],
                        "skipSavepoint": true
                    };
                    return splunkCloud.streams.activatePipeline(activatePipelineRequest);
                })
                .then(activatePipelineResponse => {
                    assert.isNotNull(activatePipelineResponse);
                    assert.equal(activatePipelineResponse["activated"], pipelineId1);

                    return splunkCloud.streams.getPipeline(pipelineId1);
                }).then(getPipelineResponse => {
                    assert.isNotNull(getPipelineResponse);
                    assert.equal(getPipelineResponse["name"], TestPipelineName1);
                    assert.equal(getPipelineResponse["description"], TestPipelineDescription);
                    assert.equal(getPipelineResponse["status"], "ACTIVATED");
                });
        });
    });

    describe("Test Deactivate Pipeline", () => {
        it("Should deactivate the newly created pipeline", () => {
            return createPipelineRequest(TestPipelineName1, TestPipelineDescription)
                .then(createPipelineRequestResponse1 => {
                    return splunkCloud.streams.createPipeline(createPipelineRequestResponse1);
                })
                .then(createPipelineResponse1 => {
                    assert.isNotNull(createPipelineResponse1);
                    assert.equal(createPipelineResponse1['status'], 'CREATED');
                    assert.equal(createPipelineResponse1["name"], TestPipelineName1);
                    assert.equal(createPipelineResponse1["description"], TestPipelineDescription);
                    pipelineId1 = createPipelineResponse1["id"];

                    const activatePipelineRequest = {
                        "ids": [
                            pipelineId1
                        ],
                        "skipSavepoint": true
                    };
                    return splunkCloud.streams.activatePipeline(activatePipelineRequest);
                })
                .then(activatePipelineResponse => {
                    assert.isNotNull(activatePipelineResponse);
                    assert.equal(activatePipelineResponse["activated"], pipelineId1);

                    const deactivatePipelineRequest = {
                        "ids": [
                            pipelineId1
                        ],
                        "skipSavepoint": true
                    };
                    return splunkCloud.streams.deactivatePipeline(deactivatePipelineRequest);
                }).then(deactivatePipelineResponse => {
                    assert.isNotNull(deactivatePipelineResponse);
                    assert.isNotNull(deactivatePipelineResponse);
                    assert.equal(deactivatePipelineResponse["deactivated"], pipelineId1);

                    return splunkCloud.streams.getPipeline(pipelineId1);
                }).then(getPipelineResponse => {
                    assert.isNotNull(getPipelineResponse);
                    assert.equal(getPipelineResponse["name"], TestPipelineName1);
                    assert.equal(getPipelineResponse["description"], TestPipelineDescription);
                    assert.equal(getPipelineResponse["statusMessage"], "Deactivated");
                });
        });
    });

    describe("Test Update Pipeline", () => {
        it("Should update an existing pipeline", () => {
            return createPipelineRequest(TestPipelineName1, TestPipelineDescription)
                .then(createPipelineRequestResponse1 => {
                    return splunkCloud.streams.createPipeline(createPipelineRequestResponse1);
                })
                .then(createPipelineResponse1 => {
                    assert.isNotNull(createPipelineResponse1);
                    assert.equal(createPipelineResponse1['status'], 'CREATED');
                    assert.equal(createPipelineResponse1["name"], TestPipelineName1);
                    assert.equal(createPipelineResponse1["description"], TestPipelineDescription);
                    pipelineId1 = createPipelineResponse1["id"];
                    assert.isNotNull(createPipelineResponse1["data"]);

                    return createPipelineRequest(TestUpdatedPipelineName, "Updated Integration Test Pipeline");
                })
                .then(createPipelineRequestResponse2 => {
                    assert.isNotNull(createPipelineRequestResponse2);
                    return splunkCloud.streams.updatePipeline(pipelineId1, createPipelineRequestResponse2);
                })
                .then(updatePipelineResponse => {
                    assert.isNotNull(updatePipelineResponse);

                    assert.equal(updatePipelineResponse["id"], pipelineId1);
                    assert.equal(updatePipelineResponse["name"], TestUpdatedPipelineName);
                    assert.equal(updatePipelineResponse["description"], "Updated Integration Test Pipeline");

                    return splunkCloud.streams.getPipeline(pipelineId1);
                })
                .then(getPipelineResponse => {
                    assert.isNotNull(getPipelineResponse);
                    assert.equal(getPipelineResponse["name"], TestUpdatedPipelineName);
                    assert.equal(getPipelineResponse["description"], "Updated Integration Test Pipeline");
                });
        });
    });
});

// Creates a test pipeline request
function createPipelineRequest(name, description) {
    const dsl = {
        "dsl": "kafka-brokers=\"localhost:9092\";input-topic = \"intopic\";output-topic-1 = \"output-topic-1\";events = deserialize-events(unauthenticated-read-kafka(kafka-brokers, input-topic, {}));unauthenticated-write-kafka(serialize-events(events, output-topic-1), kafka-brokers, {});"
    };
    return splunkCloud.streams.compileDslToUpl(dsl).then(response => {
        assert.isNotNull(response);
        const TestPipelineRequest = {
            bypassValidation: true,
            name: name,
            description: description,
            createUserID: config.playgroundTenant,
            data: response
        };
        return TestPipelineRequest;
    })
        .catch(error => {
            throw error;
        });
}
