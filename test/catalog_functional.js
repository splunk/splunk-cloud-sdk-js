const config = require("./config");
const SplunkSSC = require("../src/splunk");
const {assert} = require("chai");

const token = process.env.BEARER_TOKEN;
const tenantID = process.env.TENANT_ID;

const splunk = new SplunkSSC(`https://${config.novaHost}:443`, token, tenantID);

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

    describe('Get', () => {
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

// Scenario2: Error scenarios
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
        // const invalidPostDataset =
        //     {
        //         "name": dataSetName,
        //         "kind": "VIEW",
        //         "rules": [
        //             {
        //                 "name":"test"
        //             }
        //         ]
        //     };
        it('should return the created dataset with post for error test', () => splunk.catalog.createDataset(postDataset).then(response => {
            assert(response);
            assert(response.id);
            assert.equal(response.name, dataSetName, "Name should be equal")
            assert.equal(response.kind, "VIEW")
        }));

        it('should throw a 409 conflict response when creating an already existing Data set', () => splunk.catalog.createDataset(postDataset).then(success =>
            assert.fail(success), err => assert.equal(err.code,"409")
        ));

        // it('should throw a 400 response when invalid post data specified to create a Data set', () => splunk.catalog.createDataset(invalidPostDataset).then(success =>
        //     assert.fail(success), err => assert.equal(err.code,"400")
        // ));

        it('should throw a 404 response when Get on non-existing Data set', () => splunk.catalog.getDataset("Invalid").then(success =>
            assert.fail(success), err => assert.equal(err.code,"404")
        ));

        it('should throw a 404 response when Delete on non-existing Data Set', () => splunk.catalog.deleteDataset("Invalid").then(success =>
            assert.fail(success), err => assert.equal(err.code,"404")
        ));

    });

    // Clean up the data sets after tests are done
    after(() => {
        splunk.catalog.deleteDataset(dataSetName)
    });
});
