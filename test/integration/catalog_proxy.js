const config = require("../config");
const SplunkSSC = require("../../src/splunk");
const {assert} = require("chai");

const token = process.env.BEARER_TOKEN;
const tenantID = process.env.TENANT_ID;

const splunk = new SplunkSSC(`https://${config.novaHost}:443`, token, tenantID);
const splunkWithIncorrectCredentials = new SplunkSSC(`https://${config.novaHost}:443`, config.invalidAuthToken, config.testTenant);

// Scenario 1:
// Integration tests for Data set endpoints
// 1. Create multiple data sets
// 2. Get and validate a particular data set
// 3. Get all data sets and validate
// 4. Delete the data sets created in the test
describe('integration tests for Datasets Endpoints', () => {
    const integrationTestDatasetName1 = "ds1";
    const integrationTestDatasetName2 = "ds2";
    const integrationTestDatasetName3 = "ds3";

    describe('Post a Data set', () => {
        const testPostDataset1 =
            {
                "name": integrationTestDatasetName1,
                "kind": "VIEW",
                "todo": "string",
            };
        const testPostDataset2 =
            {
                "name": integrationTestDatasetName2,
                "kind": "INDEX",
                "todo": "string",
            };
        const testPostDataset3 =
            {
                "name": integrationTestDatasetName3,
                "kind": "VIEW",
                "todo": "string",
                "rules": [
                    "rule12"
                ]
            };
        it('should return the created dataset with post', () => splunk.catalog.createDataset(testPostDataset1).then(response => {
            assert(response);
            assert(response.id);
            assert.equal(response.name, integrationTestDatasetName1, "Name should be equal")
            assert.equal(response.kind, "VIEW")
        }));

        it('should return the created dataset with post', () => splunk.catalog.createDataset(testPostDataset2).then(response => {
            assert(response);
            assert(response.id);
            assert.equal(response.name, integrationTestDatasetName2, "Name should be equal")
            assert.equal(response.kind, "INDEX")
        }));

        it('should return the created dataset with post', () => splunk.catalog.createDataset(testPostDataset3).then(response => {
            assert(response);
            assert(response.id);
            assert.equal(response.name, integrationTestDatasetName3, "Name should be equal")
            assert.equal(response.kind, "VIEW")
            assert.equal(response.rules.length, 1)
        }));
    });

    describe('Get a Data set', () => {
        it('should return an array of datasets', () => splunk.catalog.getDataset(integrationTestDatasetName1).then(dataset => {
            assert.typeOf(dataset, 'object', 'response data should be an object');
            assert('id' in dataset, 'dataset should contain key: id');
            assert('name' in dataset, 'dataset should contain key: name');
            assert('kind' in dataset, 'dataset should contain key: kind');
            assert.equal(dataset.name, integrationTestDatasetName1)
            assert.equal(dataset.kind, "VIEW")
        }))
    });

    describe('Get all the datasets', () => {
        it('should return an array of datasets', () => splunk.catalog.getDatasets().then(data => {
            assert.typeOf(data, 'array', 'response should be an array');
            assert.isAtLeast(data.length, 3)
            data.forEach(dataset => {
                assert('id' in dataset, 'dataset should contain key: id');
                assert('name' in dataset, 'dataset should contain key: name');
                assert('kind' in dataset, 'dataset should contain key: kind');
            });
        }));
    });

    // Clean up the data sets after tests are done
    after(() => {
        splunk.catalog.deleteDataset(integrationTestDatasetName1)
        splunk.catalog.deleteDataset(integrationTestDatasetName2)
        splunk.catalog.deleteDataset(integrationTestDatasetName3)
    });
});

// Scenario 2:
// Integration tests for Data set endpoints - Error scenarios
// 1. Post a Data set, repeat post a dataset with the same name, validate 409 conflict
// 2. Post an invalid Data set, validate a 400 response
// 3. Delete a unknown Data set, validate a 404
// 4. Get on a non-existent dataset 404
describe('integration error tests for Datasets Endpoints', () => {
    const integrationTestErrorDatasetName = "ds400";

    describe('Test Post a Data set', () => {
        const testPostDataset =
            {
                "name": integrationTestErrorDatasetName,
                "kind": "VIEW",
                "todo": "string",
            };
        const testInvalidPostDataset =
            {
                "name": integrationTestErrorDatasetName,
                "kind": "VIEW",
                "rules": [
                    {
                        "name": "test"
                    }
                ]
            };
        it('should return the created dataset with post for error test', () => splunk.catalog.createDataset(testPostDataset).then(response => {
            assert(response);
            assert(response.id);
            assert.equal(response.name, integrationTestErrorDatasetName, "Name should be equal")
            assert.equal(response.kind, "VIEW")
        }));

        it('should throw a 409 CONFLICT response when creating an already existing Data set', () => splunk.catalog.createDataset(testPostDataset).then(success =>
            assert.fail(success), err => assert.equal(err.code, "409")
        ));

        it('should throw a 400 BAD REQUEST response when invalid post data specified to create a Data set', () => splunk.catalog.createDataset(testInvalidPostDataset).then(success =>
            assert.fail(success), err => assert.equal(err.code, "400")
        ));

        it('should throw a 404 NOT FOUND response when Get on non-existing Data set', () => splunk.catalog.getDataset("Invalid").then(success =>
            assert.fail(success), err => assert.equal(err.code, "404")
        ));

        it('should throw a 404 NOT FOUND response when Delete on non-existing Data Set', () => splunk.catalog.deleteDataset("Invalid").then(success =>
            assert.fail(success), err => assert.equal(err.code, "404")
        ));

    });

    // Clean up the data sets after tests are done
    after(() => {
        splunk.catalog.deleteDataset(integrationTestErrorDatasetName)
    });
});

// Scenario 3: Integration tests for Rules endpoints
// 1. Create multiple test rules
// 2. Get all the test rules and validate the number of rules
// 3. Delete the test rules
// 4. Delete an invalid rule: should return '404 not found' error
// 5. Delete a valid rule but with invalid auth credentials: should return '401 Unauthorized' error
// 6. Create a duplicate/already existing rule: should return '409 conflict' error
describe('integration tests for Rules Endpoints', () => {

    const integrationTestRuleName1 = "rule1"
    const integrationTestRuleName2 = "rule2"
    const integrationTestRuleName3 = "rule3"
    const integrationTestRuleName4 = "rule4"

    describe('Post new test rules', () => {
        const testPostRule1 =
            {
                "name": integrationTestRuleName1,
                "match": "newrule",
                "priority": 7,
                "description": "first test rule",
                "actions": [
                    {
                        "kind": "AUTOKV",
                        "mode": "NONE",
                        "trim": true
                    },
                    {
                        "kind": "EVAL",
                        "expression": "string",
                        "result": "string"
                    },
                    {
                        "kind": "LOOKUP",
                        "expression": "string"
                    }
                ]
            };
        const testPostRule2 =
            {
                "name": integrationTestRuleName2,
                "match": "newrule",
                "priority": 8,
                "description": "second test rule",
                "actions": [
                    {
                        "kind": "AUTOKV",
                        "mode": "NONE",
                        "trim": true
                    },
                    {
                        "kind": "EVAL",
                        "expression": "string",
                        "result": "string"
                    }
                ]
            };
        const testPostRule3 =
            {
                "name": integrationTestRuleName3,
                "match": "newrule",
                "priority": 9,
                "description": "third test rule",
                "actions": [
                    "string",
                    {
                        "kind": "AUTOKV",
                        "mode": "NONE",
                        "trim": true
                    },
                    {
                        "kind": "EVAL",
                        "expression": "string",
                        "result": "string"
                    }
                ]
            };

        it('should return the created rule rule1 in the response', () => splunk.catalog.createRule(testPostRule1).then(response => {
            assert(response);
            assert(response.id);
            assert.equal(response.name, integrationTestRuleName1, "Name should be equal")
            assert.equal(response.match, "newrule")
            assert.equal(response.priority, 7)
            assert.equal(response.description, "first test rule")
            assert.equal(response.actions.length, 3)
        }));

        it('should throw a 409 CONFLICT response when creating an already existing rule', () => splunk.catalog.createRule(testPostRule1).then(success =>
            assert.fail(success), err => assert.equal(err.code, "409")
        ));

        it('should return the created rule rule2 in the response', () => splunk.catalog.createRule(testPostRule2).then(response => {
            assert(response);
            assert(response.id);
            assert.equal(response.name, integrationTestRuleName2, "Name should be equal")
            assert.equal(response.match, "newrule")
            assert.equal(response.priority, 8)
            assert.equal(response.description, "second test rule")
            assert.equal(response.actions.length, 2)
        }));

        it('should throw a 400 BAD REQUEST response when invalid post data specified to create a test rule', () => splunk.catalog.createRule(testPostRule3).then(success =>
            assert.fail(success), err => assert.equal(err.code, "400")
        ));
    });

    describe('Get test rules', () => {
        it('should return an array of rules', () => splunk.catalog.getRules("").then(data => {
            assert.typeOf(data, 'array', 'response should be an array')
            assert.isAtLeast(data.length, 2)
            data.forEach(rule => {
                assert('name' in rule, 'rule should contain key: name')
                assert('match' in rule, 'rule should contain key: match')
                assert('priority' in rule, 'rule should contain key: priority')
                assert('description' in rule, 'rule should contain key: description')
                assert('actions' in rule, 'rule should contain key: actions')
            });
        }));
    });

    describe('Delete an invalid test rule', () => {
        it('should throw a 404 NOT FOUND response when trying to delete a rule not present in nova store', () => splunk.catalog.deleteRule(integrationTestRuleName4).then(success =>
            assert.fail(success), err => assert.equal(err.code, "404")
        ));
    });

    describe('Delete valid test rule with invalid authToken', () => {
        it('should throw a 401 NOT AUTHORIZED response when trying to delete a valid rule with invalid authToken', () => splunkWithIncorrectCredentials.catalog.deleteRule(integrationTestRuleName1).then(success =>
            assert.fail(success), err => assert.equal(err.code, "401")
        ));
    });

    // clean up the created rules else would get 409 conflict error
    after(() => {
        splunk.catalog.deleteRule(integrationTestRuleName1)
        splunk.catalog.deleteRule(integrationTestRuleName2)
    });

});

// Scenario 4: Integration tests for Delete Dataset
// 1. Create Data set
// 2. Delete Data set
// 3. Get Data set: should return '404 not found' error
describe('integration tests for Delete Dataset Endpoint', () => {
    const integrationTestDeleteDatasetName = "dsDelete";

    describe('Delete a Data set and validate', () => {
        const postDatasetDelete =
                {
                    "name": integrationTestDeleteDatasetName,
                    "kind": "VIEW",
                    "todo": "string",
                    "rules": [
                        "rule14"
                    ]
                };
        it('should return the created dataset with post for delete test', () => splunk.catalog.createDataset(postDatasetDelete).then(response => {
            assert(response);
            assert(response.id);
            assert.equal(response.name, integrationTestDeleteDatasetName, "Name should be equal")
            assert.equal(response.kind, "VIEW")
        }));
        it('should delete data set', () => splunk.catalog.deleteDataset(integrationTestDeleteDatasetName).then(() => {
            it('should throw a 404 Invalid', () => splunk.catalog.getDataset(integrationTestDeleteDatasetName).then(success =>
                assert.fail(success), err => assert.equal(err.code, "404")
            ));
        }));
    });
});



