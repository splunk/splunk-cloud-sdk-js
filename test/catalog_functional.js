const config = require("./config");
const SplunkSSC = require("../src/splunk");
const {assert} = require("chai");

const token = process.env.BEARER_TOKEN;
const tenantID = process.env.TENANT_ID;

const splunk = new SplunkSSC(`https://${config.novaHost}:443`, token, tenantID);

// Scenario1: Create multiple datasets of different kinds
// Get and validate a particular data set
// Get all datasets and validate
// Delete the datasets created in the test

describe('integration tests for Datasets Endpoints', () => {
    const dataSetName1 = "ds200";
    const dataSetName2 = "ds300";
    const dataSetName3 = "ds400";

    before(() => {
        // add any set up tasks here

    });

    describe('Post a dataset', () => {
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
            // assert.equal(response.rules[0].name, "rule12")
        }));
    });

    describe('Get a dataset', () => {
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


