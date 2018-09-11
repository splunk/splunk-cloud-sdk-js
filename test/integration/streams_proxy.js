const { assert } = require("chai");
const config = require("../config");
const SplunkCloud = require("../../splunk");

const splunkCloudHost = config.playgroundHost;
const token = config.playgroundAuthToken;
const tenantID = config.playgroundTenant;

const splunkCloud = new SplunkCloud(splunkCloudHost, token, tenantID);

describe("Integration tests for Streams Pipeline Endpoints", () => {
    const TestPipelineName1 = `testPipeline01${Date.now()}`;
    const TestPipelineName2 = `testPipeline02${Date.now()}`;
    const TestUpdatedPipelineName = `updated${TestPipelineName1}`;
    const TestPipelineDescription = "integration test pipeline";

    var pipelineId1;
    var pipelineId2;

    afterEach(() => {
        if (pipelineId1 != null) {
            return splunkCloud.streams.deletePipeline(pipelineId1)
                .catch(err => console.log(`Error cleaning the test pipeline1: ${err}`));
        }
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
                    assert.notEqual(createPipelineResponse1, null);
                    assert.equal(createPipelineResponse1["status"], "CREATED");
                    assert.equal(createPipelineResponse1["name"], TestPipelineName1);
                    assert.equal(createPipelineResponse1["description"], TestPipelineDescription);
                    pipelineId1 = createPipelineResponse1["id"];

                    return createPipelineRequest(TestPipelineName2, TestPipelineDescription);
                })
                .then(createPipelineRequestResponse2 => {
                    return splunkCloud.streams.createPipeline(createPipelineRequestResponse2);
                })
                .then(createPipelineResponse2 => {
                    assert.notEqual(createPipelineResponse2, null);
                    assert.equal(createPipelineResponse2["status"], "CREATED");
                    assert.equal(createPipelineResponse2["name"], TestPipelineName2);
                    assert.equal(createPipelineResponse2["description"], TestPipelineDescription);
                    pipelineId2 = createPipelineResponse2["id"];

                    return splunkCloud.streams.getPipelines();
                })
                .then(getPipelinesResponse1 => {
                    assert.notEqual(getPipelinesResponse1, null);

                    const ids = {
                        "ids": [
                            pipelineId2
                        ]
                    };
                    return splunkCloud.streams.activatePipeline(ids);
                })
                .then(activatePipelineResponse => {
                    assert.notEqual(activatePipelineResponse, null);
                    assert.equal(activatePipelineResponse["activated"], pipelineId2);

                    const queryParams = { name: TestPipelineName2 };
                    return splunkCloud.streams.getPipelines(queryParams);
                })
                .then(getPipelinesResponse2 => {
                    assert.notEqual(getPipelinesResponse2, null);
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
                    assert.notEqual(createPipelineResponse1, null);
                    assert.equal(createPipelineResponse1['status'], 'CREATED');
                    assert.equal(createPipelineResponse1["name"], TestPipelineName1);
                    assert.equal(createPipelineResponse1["description"], TestPipelineDescription);
                    pipelineId1 = createPipelineResponse1["id"];
                    assert.notEqual(createPipelineResponse1["data"], null);

                    assert.notEqual(createPipelineResponse1["data"]["nodes"], null);
                    assert.typeOf(createPipelineResponse1["data"]["nodes"], "array", "Nodes response data should be an array");
                    assert.equal(createPipelineResponse1["data"]["nodes"].length, 4);

                    createPipelineResponse1["data"]["nodes"].forEach(node => {
                        assert("id" in node, "node should contain key: id");
                        assert("op" in node, "node should contain key: op");
                    });

                    assert.notEqual(createPipelineResponse1["data"]["edges"], null);
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
                    assert.notEqual(getPipelineResponse, null);
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
                    assert.notEqual(createPipelineResponse1, null);
                    //assert.equal(createPipelineResponse1['status'], PipelineStatus.CREATED);
                    assert.equal(createPipelineResponse1["name"], TestPipelineName1);
                    assert.equal(createPipelineResponse1["description"], TestPipelineDescription);
                    pipelineId1 = createPipelineResponse1["id"];

                    const ids = {
                        "ids": [
                            pipelineId1
                        ]
                    };
                    return splunkCloud.streams.activatePipeline(ids);
                })
                .then(activatePipelineResponse => {
                    assert.notEqual(activatePipelineResponse, null);
                    assert.equal(activatePipelineResponse["activated"], pipelineId1);

                    return splunkCloud.streams.getPipeline(pipelineId1);
                }).then(getPipelineResponse => {
                    assert.notEqual(getPipelineResponse, null);
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
                    assert.notEqual(createPipelineResponse1, null);
                    //assert.equal(createPipelineResponse1['status'], PipelineStatus.CREATED);
                    assert.equal(createPipelineResponse1["name"], TestPipelineName1);
                    assert.equal(createPipelineResponse1["description"], TestPipelineDescription);
                    pipelineId1 = createPipelineResponse1["id"];

                    const ids = {
                        "ids": [
                            pipelineId1
                        ]
                    };
                    return splunkCloud.streams.activatePipeline(ids);
                })
                .then(activatePipelineResponse => {
                    assert.notEqual(activatePipelineResponse, null);
                    assert.equal(activatePipelineResponse["activated"], pipelineId1);

                    const ids = {
                        "ids": [
                            pipelineId1
                        ]
                    };
                    return splunkCloud.streams.deactivatePipeline(ids);
                }).then(deactivatePipelineResponse => {
                    assert.notEqual(deactivatePipelineResponse, null);
                    assert.notEqual(deactivatePipelineResponse, null);
                    assert.equal(deactivatePipelineResponse["deactivated"], pipelineId1);

                    return splunkCloud.streams.getPipeline(pipelineId1);
                }).then(getPipelineResponse => {
                    assert.notEqual(getPipelineResponse, null);
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
                    assert.notEqual(createPipelineResponse1, null);
                    //assert.equal(createPipelineResponse1['status'], PipelineStatus.CREATED);
                    assert.equal(createPipelineResponse1["name"], TestPipelineName1);
                    assert.equal(createPipelineResponse1["description"], TestPipelineDescription);
                    pipelineId1 = createPipelineResponse1["id"];
                    assert.notEqual(createPipelineResponse1["data"], null);

                    return createPipelineRequest(TestUpdatedPipelineName, "Updated Integration Test Pipeline");
                })
                .then(createPipelineRequestResponse2 => {
                    assert.notEqual(createPipelineRequestResponse2, null);
                    return splunkCloud.streams.updatePipeline(pipelineId1, createPipelineRequestResponse2);
                })
                .then(updatePipelineResponse => {
                    assert.notEqual(updatePipelineResponse, null);

                    assert.equal(updatePipelineResponse["id"], pipelineId1);
                    assert.equal(updatePipelineResponse["name"], TestUpdatedPipelineName);
                    assert.equal(updatePipelineResponse["description"], "Updated Integration Test Pipeline");

                    return splunkCloud.streams.getPipeline(pipelineId1);
                })
                .then(getPipelineResponse => {
                    assert.notEqual(getPipelineResponse, null);
                    assert.equal(getPipelineResponse["name"], TestUpdatedPipelineName);
                    assert.equal(getPipelineResponse["description"], "Updated Integration Test Pipeline");
                });
        });
    });
});

// Creates a test pipeline request
function createPipelineRequest(name, description) {
    const dsl = {
        "dsl": "kafka-brokers=\"localhost:9092\";input-topic = \"intopic\";output-topic-1 = \"output-topic-1\";events = deserialize-events(read-kafka(kafka-brokers, input-topic, {}));write-kafka(serialize-events(events, output-topic-1), kafka-brokers, {});"
    };
    return splunkCloud.streams
        .compileDslToUpl(dsl)
        .then(response => {
            assert.notEqual(response, null);
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
