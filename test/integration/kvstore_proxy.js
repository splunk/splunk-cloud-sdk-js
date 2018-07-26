const config = require('../config');
const SplunkSSC = require('../../splunk');
const { assert } = require('chai');

const sscHost = config.playgroundHost;
const token = config.playgroundAuthToken;
const tenantID = config.playgroundTenant;

const ssc = new SplunkSSC(sscHost, token, tenantID);

const testNamespace = config.testNamespace;
const testCollection = config.testCollection;

describe('Integration tests for KVStore Admin Endpoints', () => {
    describe('Ping Endpoint', () => {
        it('Should return a "healthy" response', () => {
            return ssc.kvstore.getHealthStatus().then(response => {
                assert.equal(response.status, 'healthy', 'response status should be `healthy`');
            });
        });
    });
});

describe('Integration tests for KVStore Collection Stats Endpoints', () => {
    let testDataset;

    beforeEach(() => {
        // Gets the datasets
        return (
            ssc.catalog
                .getDatasets()
                // Filters the data set
                .then(datasets => {
                    return datasets.filter(element => {
                        element['module'] == testNamespace && element['name'] == testCollection;
                        return element;
                    });
                })
                // Deletes the dataset should only be one data set
                .then(datasets => {
                    if (datasets.length > 0) {
                        dataset = datasets[0];
                        return ssc.catalog.deleteDataset(dataset.id);
                    } else {
                        // do nothing
                    }
                })
                // Creates the data sets
                .then(() => {
                    return ssc.catalog.createDataset({
                        name: testCollection,
                        owner: 'splunk',
                        kind: 'kvcollection',
                        capabilities: '1101-00000:11010',
                        module: testNamespace,
                    });
                })
                // Finally set the dataset for testing
                .then(response => {
                    testDataset = response;
                })
        );
    });

    describe('Get the stats of a new collections', () => {
        it('Should return expected defaults', () => {
            return ssc.kvstore
                .getCollectionStats(testNamespace, testCollection)
                .then(statsResponse => {
                    assert.equal(statsResponse.count, 0);
                    assert.equal(statsResponse.nindexes, 1);
                    // This is a bug, the `ns` property is actually the
                    // collection and will need to be updated when kv
                    // store fixes it
                    // See https://jira.splunk.com/browse/SSC-4205
                    assert.equal(statsResponse.ns, testCollection);
                });
        });
    });

    // BUG: this is broken and doesn't run because for some reason the `beforeEach`
    //      is not running to completion before executing the test, so when this
    //      gets called the `testDataset` is null
    afterEach(() => {
        if (testDataset != null) {
            ssc.catalog
                .deleteDatasetByName(testDataset.name)
                .catch(err => console.log(`Error cleaning the test dataset: ${err}`));
        }
    });
});
