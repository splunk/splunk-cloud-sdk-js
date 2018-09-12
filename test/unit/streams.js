const { assert } = require("chai");
const config = require("../config");
const SplunkCloud = require("../../splunk").SplunkCloud;

const splunk = new SplunkCloud(
    `http://${config.stubbyHost}:8882`,
    config.stubbyAuthToken,
    config.stubbyTenant
);

// Test variables
var TestPipelineID = "TEST_PIPELINE_01";
var TestPipelineName = "TEST_PIPELINE";

describe("Stubby tests for Streams Pipeline Endpoints", () => {
    describe("Compile DSL to UPL Pipeline JSON", () => {
        it("should return the UPL Pipeline in JSON format for the input DSL", () => {
            const dsl = {
                "dsl": "kafka-brokers=\"localhost:9092\";input-topic = \"intopic\";output-topic-1 = \"output-topic-1\";events = deserialize-events(read-kafka(kafka-brokers, input-topic, {}));write-kafka(serialize-events(events, output-topic-1), kafka-brokers, {});"
            };

            const expectedResponse = {
                "version": 3,
                "nodes": [
                    {
                        "op": "read-kafka",
                        "id": "7c2f2c37-50a7-466d-b1d3-cc3fc63728e1",
                        "attributes": {},
                        "brokers": "localhost:9092",
                        "consumer-properties": {},
                        "topic": "intopic"
                    },
                    {
                        "op": "deserialize-events",
                        "id": "0965ce4d-e097-49de-8051-87bde9f7bd03",
                        "attributes": {}
                    },
                    {
                        "op": "serialize-events",
                        "id": "81a53c51-aed1-4438-8cd8-8a08df0d3654",
                        "attributes": {},
                        "topic": "output-topic-1"
                    },
                    {
                        "op": "write-kafka",
                        "id": "a44ead45-9f30-4913-8615-6ab0b145b0c6",
                        "attributes": {},
                        "producer-properties": {},
                        "brokers": "localhost:9092"
                    }
                ],
                "edges": [
                    {
                        "sourceNode": "7c2f2c37-50a7-466d-b1d3-cc3fc63728e1",
                        "sourcePort": "output",
                        "targetNode": "0965ce4d-e097-49de-8051-87bde9f7bd03",
                        "targetPort": "input"
                    },
                    {
                        "sourceNode": "0965ce4d-e097-49de-8051-87bde9f7bd03",
                        "sourcePort": "output",
                        "targetNode": "81a53c51-aed1-4438-8cd8-8a08df0d3654",
                        "targetPort": "input"
                    },
                    {
                        "sourceNode": "81a53c51-aed1-4438-8cd8-8a08df0d3654",
                        "sourcePort": "output",
                        "targetNode": "a44ead45-9f30-4913-8615-6ab0b145b0c6",
                        "targetPort": "input"
                    }
                ],
                "root-node": [
                    "a44ead45-9f30-4913-8615-6ab0b145b0c6"
                ]
            };
            return splunk.streams.compileDslToUpl(dsl).then(uplPipeline => {
                assert.isNotNull(uplPipeline);
                assert.deepEqual(uplPipeline, expectedResponse, "response doesnot match the posted DSL.");
                assert.typeOf(uplPipeline.nodes, "array", "Nodes response data should be an array");
                uplPipeline.nodes.forEach(node => {
                    assert("id" in node, "node should contain key: id");
                    assert("op" in node, "node should contain key: op");
                });

                assert.typeOf(uplPipeline.edges, "array", "Edges response data should be an array");
                uplPipeline.edges.forEach(edge => {
                    assert("sourceNode" in edge, "edge should contain key: sourceNode");
                    assert("sourcePort" in edge, "edge should contain key: sourcePort");
                    assert("targetNode" in edge, "edge should contain key: targetNode");
                    assert("targetPort" in edge, "edge should contain key: targetPort");
                });
                assert.equal(uplPipeline.version, 3);
                assert.typeOf(uplPipeline["root-node"], "array", "Root-node response data should be an array");
            });
        });
    });

    describe("Get all pipelines", () => {
        it("should return all the pipelines", () => {
            return splunk.streams.getPipelines().then(pipelines => {
                assert.isNotNull(pipelines);
                assert.typeOf(pipelines.items, "array", "Pipeline items should be an array");
                assert.equal(pipelines.items.length, 1);
                assert.equal(pipelines.total, 1);
                assert.equal(pipelines.items[0].id, TestPipelineID);
                assert.equal(pipelines.items[0].name, TestPipelineName);
                assert.equal(pipelines.items[0].createUserId, config.stubbyTenant);
            });
        });
    });

    describe("Post a new pipeline", () => {
        it("should create a new pipeline", () => {
            const testPipelineRequest = {
                "bypassValidation": true,
                "description": "Stubby Test Pipeline",
                "name": "TEST_PIPELINE",
                "createUserId": "TEST_TENANT",
                "data": {
                    "nodes": [
                        {
                            "op": "read-kafka",
                            "id": "TEST_NODE_01",
                            "attributes": null,
                            "brokers": "localhost:9092",
                            "consumer-properties": {},
                            "topic": "intopic"
                        },
                        {
                            "op": "deserialize-events",
                            "id": "TEST_NODE_02",
                            "attributes": null
                        },
                        {
                            "op": "serialize-events",
                            "id": "TEST_NODE_03",
                            "attributes": null,
                            "topic": "output-topic-1"
                        },
                        {
                            "op": "write-kafka",
                            "id": "TEST_NODE_04",
                            "attributes": null,
                            "producer-properties": {},
                            "brokers": "localhost:9092"
                        }
                    ],
                    "edges": [
                        {
                            "attributes": null,
                            "sourceNode": "TEST_NODE_01",
                            "sourcePort": "output",
                            "targetNode": "TEST_NODE_02",
                            "targetPort": "input"
                        },
                        {
                            "attributes": null,
                            "sourceNode": "TEST_NODE_02",
                            "sourcePort": "output",
                            "targetNode": "TEST_NODE_03",
                            "targetPort": "input"
                        },
                        {
                            "attributes": null,
                            "sourceNode": "TEST_NODE_03",
                            "sourcePort": "output",
                            "targetNode": "TEST_NODE_04",
                            "targetPort": "input"
                        }
                    ],
                    "root-node": [
                        "TEST_NODE_04"
                    ],
                    "version": 3
                }
            };
            return splunk.streams.createPipeline(testPipelineRequest).then(pipeline => {
                assert.isNotNull(pipeline);

                assert.equal(pipeline.id, TestPipelineID);
                assert.equal(pipeline.name, TestPipelineName);
                assert.equal(pipeline.createUserId, config.stubbyTenant);
                assert.equal(pipeline.version, 1);
                assert.isNotNull(pipeline.data);

                assert.typeOf(pipeline.data.nodes, "array", "Nodes response data should be an array");
                pipeline.data.nodes.forEach(node => {
                    assert("id" in node, "node should contain key: id");
                    assert("op" in node, "node should contain key: op");
                });

                assert.typeOf(pipeline.data.edges, "array", "Edges response data should be an array");
                pipeline.data.edges.forEach(edge => {
                    assert("sourceNode" in edge, "edge should contain key: sourceNode");
                    assert("sourcePort" in edge, "edge should contain key: sourcePort");
                    assert("targetNode" in edge, "edge should contain key: targetNode");
                    assert("targetPort" in edge, "edge should contain key: targetPort");
                });
                assert.equal(pipeline.data.version, 3);
                assert.typeOf(pipeline.data["root-node"], "array", "Root-node response data should be an array");
            });
        });
    });

    describe("Activate a pipeline", () => {
        it("should activate the pipeline as per the ids provided by the user", () => {
            const testActivatePipelineRequest = {
                "ids": ["TEST_PIPELINE_01"]
            };
            return splunk.streams.activatePipeline(testActivatePipelineRequest).then(response => {
                assert.isNotNull(response);
                assert.equal(response["activated"][0], TestPipelineID);
            });
        });
    });

    describe("Deactivate a pipeline", () => {
        it("should deactivate the pipeline as per the ids provided by the user", () => {
            var ids = ["TEST_PIPELINE_01"];
            const testDeactivatePipelineRequest = {
                "ids": ids
            };
            return splunk.streams.deactivatePipeline(testDeactivatePipelineRequest).then(response => {
                assert.isNotNull(response);
                assert.equal(response["deactivated"][0], TestPipelineID);
            });
        });
    });

    describe("Get a pipeline", () => {
        it("should return the pipeline based on the id provided by the user", () => {
            return splunk.streams.getPipeline(TestPipelineID).then(pipeline => {
                assert.isNotNull(pipeline);

                assert.equal(pipeline.id, TestPipelineID);
                assert.equal(pipeline.name, TestPipelineName);
                assert.equal(pipeline.createUserId, config.stubbyTenant);
                assert.isNotNull(pipeline.data);

                assert.typeOf(pipeline.data.nodes, "array", "Nodes response data should be an array");
                pipeline.data.nodes.forEach(node => {
                    assert("id" in node, "node should contain key: id");
                    assert("op" in node, "node should contain key: op");
                });

                assert.typeOf(pipeline.data.edges, "array", "Edges response data should be an array");
                pipeline.data.edges.forEach(edge => {
                    assert("sourceNode" in edge, "edge should contain key: sourceNode");
                    assert("sourcePort" in edge, "edge should contain key: sourcePort");
                    assert("targetNode" in edge, "edge should contain key: targetNode");
                    assert("targetPort" in edge, "edge should contain key: targetPort");
                });
                assert.equal(pipeline.data.version, 3);
                assert.typeOf(pipeline.data["root-node"], "array", "Root-node response data should be an array");
            });
        });
    });

    describe("Update a pipeline", () => {
        it("should update an existing pipeline", () => {
            const testPipelineRequest = {
                "bypassValidation": true,
                "description": "Updated Stubby Test Pipeline",
                "name": "UPDATED_TEST_PIPELINE",
                "createUserId": "TEST_TENANT",
                "data": {
                    "nodes": [
                        {
                            "op": "read-kafka",
                            "id": "TEST_NODE_01",
                            "attributes": null,
                            "brokers": "localhost:9092",
                            "consumer-properties": {},
                            "topic": "intopic"
                        },
                        {
                            "op": "deserialize-events",
                            "id": "TEST_NODE_02",
                            "attributes": null
                        },
                        {
                            "op": "serialize-events",
                            "id": "TEST_NODE_03",
                            "attributes": null,
                            "topic": "output-topic-1"
                        },
                        {
                            "op": "write-kafka",
                            "id": "TEST_NODE_04",
                            "attributes": null,
                            "producer-properties": {},
                            "brokers": "localhost:9092"
                        }
                    ],
                    "edges": [
                        {
                            "attributes": null,
                            "sourceNode": "TEST_NODE_01",
                            "sourcePort": "output",
                            "targetNode": "TEST_NODE_02",
                            "targetPort": "input"
                        },
                        {
                            "attributes": null,
                            "sourceNode": "TEST_NODE_02",
                            "sourcePort": "output",
                            "targetNode": "TEST_NODE_03",
                            "targetPort": "input"
                        },
                        {
                            "attributes": null,
                            "sourceNode": "TEST_NODE_03",
                            "sourcePort": "output",
                            "targetNode": "TEST_NODE_04",
                            "targetPort": "input"
                        }
                    ],
                    "root-node": [
                        "TEST_NODE_04"
                    ],
                    "version": 3
                }
            };
            return splunk.streams.updatePipeline(TestPipelineID, testPipelineRequest).then(pipeline => {
                assert.isNotNull(pipeline);

                assert.equal(pipeline.id, TestPipelineID);
                assert.equal(pipeline.name, "UPDATED_TEST_PIPELINE");
                assert.equal(pipeline.description, "Updated Stubby Test Pipeline");
                assert.equal(pipeline.createUserId, config.stubbyTenant);
                assert.equal(pipeline.version, 1);
                assert.isNotNull(pipeline.data);

                assert.typeOf(pipeline.data.nodes, "array", "Nodes response data should be an array");
                pipeline.data.nodes.forEach(node => {
                    assert("id" in node, "node should contain key: id");
                    assert("op" in node, "node should contain key: op");
                });

                assert.typeOf(pipeline.data.edges, "array", "Edges response data should be an array");
                pipeline.data.edges.forEach(edge => {
                    assert("sourceNode" in edge, "edge should contain key: sourceNode");
                    assert("sourcePort" in edge, "edge should contain key: sourcePort");
                    assert("targetNode" in edge, "edge should contain key: targetNode");
                    assert("targetPort" in edge, "edge should contain key: targetPort");
                });
                assert.equal(pipeline.data.version, 3);
                assert.typeOf(pipeline.data["root-node"], "array", "Root-node response data should be an array");
            });
        });
    });

    describe("Delete a pipeline", () => {
        it("should return a pipelineDeleteResponse", () => {
            return splunk.streams.deletePipeline(TestPipelineID).then(response => {
                assert.isNotNull(response);

                assert.equal(response["couldDeactivate"], true);
                assert.equal(response["running"], true);
            });
        });
    });
});
