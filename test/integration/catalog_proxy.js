const config = require('../config');
const SplunkCloud = require('../../splunk').SplunkCloud;
const { assert } = require('chai');

const splunkCloudHost = config.playgroundHost;
const token = config.playgroundAuthToken;
const tenantID = config.playgroundTenant;

const splunkCloud = new SplunkCloud(splunkCloudHost, token, tenantID);

describe('catalog v2', () => {
    const indexName = `idx_${Date.now()}`;
    // Create an index to ensure there is something to return
    before(() => createIndexDataset(indexName));
    after(() =>
        splunkCloud.catalog
            .deleteDatasetByName(indexName)
            .catch(err => console.log('Error cleaning index: ' + err))
    );

    describe("datasets", () => {
        it("should return datasets", () => splunkCloud.catalog.getDatasets().then((dslist) => {
            assert(dslist.length > 0);
            assert(dslist[0].kind);
        }));

        it("should return datasets with filter", () => splunkCloud.catalog.getDatasets('kind=="index"').then((dslist) => {
            assert(dslist.length > 0);
            assert(dslist[0].kind === "index");
        }));

        it("should allow create/delete of datasets", () => {
            const name = "foobar";
            return createIndexDataset(name).then(ds => {
                assert(ds.name === name);
                assert(ds.kind === "index");
                return ds.id;
            }).then(id => splunkCloud.catalog.deleteDataset(id));

        });

        it("should allow delete of datasets by name", () => {
            const name = "foobar1";
            return createIndexDataset(name).then(() => splunkCloud.catalog.deleteDatasetByName(name));
        });

        it("should throw an error when deleting a dataset that doesn't exist", () => {
            return splunkCloud.catalog.deleteDatasetByName("queequeg")
                .then(() => assert.fail("Should have thrown"), () => true /* success */)
        });
    }).timeout(10000);

    describe('rules', () => {
        it('should allow creation, listing, deletion of rules', () => {
            const ruleName = 'testRule';
            return createRule(ruleName).then(rule =>
                splunkCloud.catalog
                    .getRules()
                    .then(ruleList => {
                        assert(
                            ruleList.length >= 1,
                            'We should have at least one rule after creating one'
                        );
                    })
                    .then(() =>
                        splunkCloud.catalog.getRules(`name=="${rule.name}"`).then(rules => {
                            assert(
                                rules.length >= 1,
                                'We should have a rule with the name we just created'
                            );
                            assert(rules[0].name === ruleName, 'The name should match');
                            const ids = rules.map(r => r.id);
                            return Promise.all(ids.map(id => splunkCloud.catalog.deleteRule(id)));
                        })
                    )
            );
        });
    }).timeout(10000);

    describe("dataset fields", () => {
        const integrationTestField1 = "integ_test_field1";
        const integrationTestField2 = "integ_test_field2";
        it("should create a test dataset, its fields, list its fields and delete the test dataset", () => {
            return splunkCloud.catalog.createDataset({
                name: "integ_dataset_1000",
                owner: "Splunk",
                kind: "lookup",
                capabilities: "1101-00000:11010",
                externalKind: "kvcollection",
                externalName: "test_externalName"
            }).then((resultDataset) => splunkCloud.catalog.postDatasetField(resultDataset.id, {
                "name": integrationTestField1,
                "datasetid": resultDataset.id,
                "datatype": "S",
                "fieldtype": "D",
                "prevalence": "A"
            }).then(resultDatasetField1 => splunkCloud.catalog.getDatasetField(resultDataset.id, resultDatasetField1.id).then((getResultDatasetField) => {
                assert(getResultDatasetField.name, integrationTestField1);
            })).then(() => splunkCloud.catalog.postDatasetField(resultDataset.id, {
                "name": integrationTestField2,
                "datasetid": resultDataset.id,
                "datatype": "S",
                "fieldtype": "D",
                "prevalence": "A"
            })).then((resultDatasetField2) => splunkCloud.catalog.getDatasetField(resultDataset.id, resultDatasetField2.id).then((getResultDatasetField) => {
                assert(getResultDatasetField.name, integrationTestField2);
            }).then(() => splunkCloud.catalog.getDatasetFields(resultDataset.id).then((resultDatasetFields) => {
                assert(resultDatasetFields.length === 2, "Two dataset fields should be created");
            })).then(() => splunkCloud.catalog.getDatasetFields(resultDataset.id, "name==\"integ_test_field2\"").then((resultDatasetFields) => {
                assert(resultDatasetFields.length === 1, "One dataset fields should be created");
                assert(resultDatasetFields[0].name === integrationTestField2, "The name should match");
            })).then(() => splunkCloud.catalog.patchDatasetField(resultDataset.id, resultDatasetField2.id, { "name": "integ_test_field3" }).then((patchResultDatasetField) => {
                assert(patchResultDatasetField.name === "integ_test_field3", "The name should match");
            })).then(() => splunkCloud.catalog.deleteDatasetField(resultDataset.id, resultDatasetField2.id).then((response) => {
                assert(!response)
            }))).then(() => splunkCloud.catalog.deleteDataset(resultDataset.id)));
        });
    }).timeout(10000);
});

function createIndexDataset(collection) {
    // Gets the datasets
    return (
        splunkCloud.catalog
            .getDatasets()
            // Filters the data set
            .then(datasets => {
                return datasets.filter(element => {
                    if (element['name'] == collection) {
                        return element;
                    }
                });
            })
            // Deletes the dataset should only be one data set
            .then(datasets => {
                return Promise.all(
                    datasets.map(dataset => {
                        return splunkCloud.catalog.deleteDataset(dataset.id);
                    })
                );
            })
            // Creates the data sets
            .then(() => {
                return splunkCloud.catalog.createDataset({
                    name: collection,
                    owner: 'test@splunk.com',
                    kind: 'index',
                    capabilities: '1101-00000:11010',
                    disabled: false,
                });
            })
            // Return the dataset for testing
            .then(response => {
                return response;
            })
            .catch(error => {
                console.log('An error was encountered while cleaning up datasests');
                console.log(error);
            })
    );
}

function createKVCollectionDataset(namespace, collection) {
    // Gets the datasets
    return (
        splunkCloud.catalog
            .getDatasets()
            // Filters the data set
            .then(datasets => {
                return datasets.filter(element => {
                    if (element['module'] == namespace && element['name'] == collection) {
                        return element;
                    }
                });
            })
            // Deletes the dataset there should only be one dataset
            .then(datasets => {
                return Promise.all(
                    datasets.map(dataset => {
                        return splunkCloud.catalog.deleteDataset(dataset.id);
                    })
                );
            })
            // Creates the data sets
            .then(() => {
                return splunkCloud.catalog.createDataset({
                    name: collection,
                    owner: 'splunk',
                    kind: 'kvcollection',
                    capabilities: '1101-00000:11010',
                    module: namespace,
                });
            })
            // Finally set the dataset for testing
            .then(response => {
                return response;
            })
            .catch(error => {
                console.log('An error was encountered while cleaning up datasests');
                console.log(error);
            })
    );
}

function deleteAllDatasets() {
    // Gets the datasets
    return (
        splunkCloud.catalog
            .getDatasets()
            // Deletes the dataset there should only be one dataset
            .then(datasets => {
                return Promise.all(
                    datasets.map(dataset => {
                        return splunkCloud.catalog.deleteDataset(dataset.id);
                    })
                );
            })
            // Finally set the dataset for testing
            .then(response => {
                return response;
            })
            .catch(error => {
                console.log('An error was encountered while cleaning up datasests');
                console.log(error);
            })
    );
}

function createRecord(collection, record) {
    return splunkCloud.kvstore
        .insertRecord(collection, record)
        .then(response => {
            assert.notEqual(response['_key'], null);
            assert.typeOf(response['_key'], 'string');
            return response;
        })
        .catch(error => {
            throw error;
        });
}

function createRule(ruleName) {
    return (
        splunkCloud.catalog
            .getRules()
            // Filters the rules
            .then(rules => {
                return rules.filter(element => {
                    if (element['name'] == ruleName) {
                        return element;
                    }
                });
            })
            // Deletes the rule - there should only be one rule
            .then(rules => {
                return Promise.all(
                    rules.map(rules => {
                        return splunkCloud.catalog.deleterules(dataset.id);
                    })
                );
            })
            // Creates the rule
            .then(() => {
                return splunkCloud.catalog.createRule({
                    name: ruleName,
                    owner: 'SDKJSTEST@splunk.com',
                    match: 'sourcetype::newtype',
                });
            })
            // Return the rule testing
            .then(response => {
                return response;
            })
            .catch(error => {
                console.log('An error was encountered while cleaning up the rules');
                console.log(error);
            })
    );
}

module.exports = {
    createIndexDataset: createIndexDataset,
    createKVCollectionDataset: createKVCollectionDataset,
    createRecord: createRecord,
    createRule: createRule,
    deleteAllDatasets: deleteAllDatasets,
};
