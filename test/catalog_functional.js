const config = require("./config");
const SplunkSSC = require("../src/splunk");
const {assert} = require("chai");

const token = process.env.BEARER_TOKEN;
const tenantID = process.env.TENANT_ID;

const splunk = new SplunkSSC(`https://${config.novaHost}:443`, token, tenantID);
const splunkWithIncorrectCredentials = new SplunkSSC(`https://${config.novaHost}:443`, config.invalidAuthToken, config.testTenant);

// Scenario1:
// Create multiple data sets
// Get and validate a particular data set
// Get all data sets and validate
// Delete the data sets created in the test

describe('integration tests for Datasets Endpoints', () => {
    const dataSetName1 = "ds1";
    const dataSetName2 = "ds2";
    const dataSetName3 = "ds3";

    before(() => {
        // add any set up tasks here
    });

    describe('Post a Data set', () => {
        const postDataset1 =
            {
                "name": dataSetName1,
                "kind": "VIEW",
                "todo": "string",
            };
        const postDataset2 =
            {
                "name": dataSetName2,
                "kind": "INDEX",
                "todo": "string",
            };
        const postDataset3 =
            {
                "name": dataSetName3,
                "kind": "VIEW",
                "todo": "string",
                "rules": [
                    "rule12"
                ]
            };
        it('should return the created dataset with post', () => splunk.catalog.createDataset(postDataset1).then(response => {
            assert(response);
            assert(response.id);
            assert.equal(response.name, dataSetName1, "Name should be equal")
            assert.equal(response.kind, "VIEW")
        }));

        it('should return the created dataset with post', () => splunk.catalog.createDataset(postDataset2).then(response => {
            assert(response);
            assert(response.id);
            assert.equal(response.name, dataSetName2, "Name should be equal")
            assert.equal(response.kind, "INDEX")
        }));

        it('should return the created dataset with post', () => splunk.catalog.createDataset(postDataset3).then(response => {
            assert(response);
            assert(response.id);
            assert.equal(response.name, dataSetName3, "Name should be equal")
            assert.equal(response.kind, "VIEW")
            assert.equal(response.rules.length, 1)
        }));
    });

    describe('Get a Data set', () => {
        it('should return an array of datasets', () => splunk.catalog.getDataset(dataSetName1).then(dataset => {
            assert.typeOf(dataset, 'object', 'response data should be an object');
            assert('id' in dataset, 'dataset should contain key: id');
            assert('name' in dataset, 'dataset should contain key: name');
            assert('kind' in dataset, 'dataset should contain key: kind');
            assert.equal(dataset.name, dataSetName1)
            assert.equal(dataset.kind, "VIEW")


        }))

    });

    describe('Get all the datasets', () => {
        it('should return an array of datasets', () => splunk.catalog.getDatasets().then(data => {
            assert.typeOf(data, 'array', 'response should be an array');
            data.forEach(dataset => {
                assert('id' in dataset, 'dataset should contain key: id');
                assert('name' in dataset, 'dataset should contain key: name');
                assert('kind' in dataset, 'dataset should contain key: kind');
            });
        }));
    });

    // Clean up the data sets after tests are done
    after(() => {
        splunk.catalog.deleteDataset(dataSetName1)
        splunk.catalog.deleteDataset(dataSetName2)
        splunk.catalog.deleteDataset(dataSetName3)
    });
});

// Scenario 2: Error scenarios
// Post a Data set, repeat post a dataset with the same name, validate 409 conflict
// Post an invalid Data set, validate a 400 response
// Delete a unknown Data set, validate a 404
// Get on a non-existent dataset 404// types kind  One of "catalog", "EXTERN", "INDEX", "KVSTORE", "TOPIC"," VIEW"

describe('integration error tests for Datasets Endpoints', () => {
    const dataSetName = "ds400";

    before(() => {
        // add any set up tasks here

    });

    describe('Test Post a Data set', () => {
        const postDataset =
            {
                "name": dataSetName,
                "kind": "VIEW",
                "todo": "string",
            };
        const invalidPostDataset =
             {
                 "name": dataSetName,
                 "kind": "VIEW",
                 "rules": [
                     {
                         "name":"test"
                     }
                 ]
             };
        it('should return the created dataset with post for error test', () => splunk.catalog.createDataset(postDataset).then(response => {
            assert(response);
            assert(response.id);
            assert.equal(response.name, dataSetName, "Name should be equal")
            assert.equal(response.kind, "VIEW")
        }));

        it('should throw a 409 CONFLICT response when creating an already existing Data set', () => splunk.catalog.createDataset(postDataset).then(success =>
            assert.fail(success), err => assert.equal(err.code,"409")
        ));

        it('should throw a 400 BAD REQUEST response when invalid post data specified to create a Data set', () => splunk.catalog.createDataset(invalidPostDataset).then(success =>
            assert.fail(success), err => assert.equal(err.code,"400")
        ));

        it('should throw a 404 NOT FOUND response when Get on non-existing Data set', () => splunk.catalog.getDataset("Invalid").then(success =>
            assert.fail(success), err => assert.equal(err.code,"404")
        ));

        it('should throw a 404 NOT FOUND response when Delete on non-existing Data Set', () => splunk.catalog.deleteDataset("Invalid").then(success =>
            assert.fail(success), err => assert.equal(err.code,"404")
        ));

    });

    // Clean up the data sets after tests are done
    after(() => {
        splunk.catalog.deleteDataset(dataSetName)
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

    const ruleName1 = "rule1"
    const ruleName2 = "rule2"
    const ruleName3 = "rule3"
    before(() => {
        // Make sure the NOVA playground is stable.
        // Health check on Nova playground
    });

    describe('Post new test rules', () => {
        const postRule1 =
            {
                "name": ruleName1,
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
        const postRule2 =
            {
                "name": ruleName2,
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

        it('should return the created rule rule1 in the response', () => splunk.catalog.createRule(postRule1).then(response => {
            assert(response);
            assert(response.id);
            assert.equal(response.name, ruleName1, "Name should be equal")
            assert.equal(response.match, "newrule")
            assert.equal(response.priority, 7)
            assert.equal(response.description, "first test rule")
            assert.equal(response.actions.length, 3)
        }));

        it('should throw a 409 CONFLICT response when creating an already existing rule', () => splunk.catalog.createRule(postRule1).then(success =>
            assert.fail(success), err => assert.equal(err.code,"409")
        ));

        it('should return the created rule rule2 in the response', () => splunk.catalog.createRule(postRule2).then(response => {
            assert(response);
            assert(response.id);
            assert.equal(response.name, ruleName2, "Name should be equal")
            assert.equal(response.match, "newrule")
            assert.equal(response.priority, 8)
            assert.equal(response.description, "second test rule")
            assert.equal(response.actions.length, 2)
        }));
    });

    describe('Get test rules', () => {
        it('should return an array of rules', () => splunk.catalog.getRules("").then(data => {
            assert.typeOf(data, 'array', 'response should be an array')
            assert.equal(data.length, 2)
            data.forEach(rule => {
                assert('name' in rule, 'rule should contain key: name')
                assert('match' in rule, 'rule should contain key: match')
                assert('priority' in rule, 'rule should contain key: priority')
                assert('description' in rule, 'rule should contain key: description')
                assert('actions' in rule, 'rule should contain key: actions')
            });
        }));
    });

    describe('Delete an invaild test rule', () => {
        it('should throw a 404 NOT FOUND response when trying to delete a rule not present in nova store', () => splunk.catalog.deleteRule(ruleName3).then(success =>
            assert.fail(success), err => assert.equal(err.code, "404")
        ));
    });

    describe('Delete valid test rule with invalid authToken', () => {
        it('should throw a 401 NOT AUTHORIZED response when trying to delete a valid rule with invalid authToken', () => splunkWithIncorrectCredentials.catalog.deleteRule(ruleName1).then(success =>
            assert.fail(success), err => assert.equal(err.code, "401")
        ));
    });

    // clean up the created rules else would get 409 conflict error
    after(() => {
        splunk.catalog.deleteRule(ruleName1)
        splunk.catalog.deleteRule(ruleName2)
    });
});

