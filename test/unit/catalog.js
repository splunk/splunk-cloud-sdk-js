const config = require("../config");
const SplunkSSC = require("../../src/splunk");
const {assert} = require("chai");

const splunk = new SplunkSSC(`http://${config.host}:8882`, config.authToken, 'TEST_TENANT');

describe('Datasets Endpoints', () => {

    describe('Get', () => {
        it('should return an array of datasets', () => splunk.catalog.getDatasets().then(data => {
            assert.typeOf(data, 'array', 'response should be an array');
            data.forEach(dataset => {
                assert('id' in dataset, 'dataset should contain key: id');
                assert('name' in dataset, 'dataset should contain key: name');
                assert('kind' in dataset, 'dataset should contain key: kind');
                assert('capabilities' in dataset, 'dataset should contain key: capabilities');
                assert('owner' in dataset, 'dataset should contain key: owner')
            });
        }));
        it('should return a dataset with given name', () => {
            splunk.catalog.getRules()
            return splunk.catalog.getDataset('ds1').then(dataset => {
                assert.typeOf(dataset, 'object', 'response data should be an object');
                assert('id' in dataset, 'dataset should contain key: id');
                assert('name' in dataset, 'dataset should contain key: name');
                assert('kind' in dataset, 'dataset should contain key: kind');
            })
        })
    });

    describe('Post', () => {
        it('should return the created dataset with post', () => {
            const postBody =
                {
                    "owner": "Splunk",
                    "name": "stubby_dataset_1",
                    "kind": "index",
                    "capabilities": "1101-00000:11010",
                    "disabled": true
                };
            const expectedResponse =
                {
                    "owner": "Splunk",
                    "created": "2018-05-30 05:43:08.000915",
                    "modified": "2018-05-30 05:43:08.000915",
                    "version": 1,
                    "id": "ds1",
                    "module": "catalog",
                    "name": "stubby_dataset_1",
                    "kind": "index",
                    "capabilities": "1101-00000:11010",
                    "fields": [],
                    "createdby": "Splunk",
                    "modifiedby": "Splunk",
                    "disabled": false
                }
            return splunk.catalog.createDataset(postBody).then(response => {
                assert.deepEqual(response, expectedResponse, 'response should contain the same dataset posted.')
            });
        });
    });
});

describe('Rules Endpoints', () => {

    describe('Get', () => {
        it('should return an array of rules', () => splunk.catalog.getRules().then(rules => {
            assert.typeOf(rules, 'array', 'response should be an array');
            rules.forEach(rule => {
                assert('name' in rule, 'rule should contain key: name');
                assert('match' in rule, 'rule should contain key: match');
            });
            assert.deepEqual(rules.length, 2, 'two rules should be returned');
        }));
    });

    describe('Post', () => {
        it('should return the created rule with post', () => {
            const rule =
                {
                    "name":"_internal",
                    "module":"splunk",
                    "match":"test_match",
                    "actions":
                        [
                            {
                                "kind":"AUTOKV",
                                "owner":"Splunk",
                                "mode":"NONE"
                            },
                            {
                                "kind":"EVAL",
                                "owner":"Splunk",
                                "field":"Splunk",
                                "expression":"string"
                            },
                            {
                                "kind":"LOOKUP",
                                "owner":"Splunk",
                                "expression":"string"
                            }
                        ],
                    "owner":"Splunk"
                };
            const expectedResponse =
                {
                    "owner": "Splunk",
                    "created": "2018-05-30 08:26:22.000265",
                    "modified": "2018-05-30 08:26:22.000265",
                    "version": 1,
                    "id": "rule1",
                    "name": "_internal",
                    "module": "splunk",
                    "match": "test_match",
                    "createdby": "Splunk",
                    "modifiedby": "Splunk",
                    "actions": [
                        {
                            "owner": "Splunk",
                            "created": "2018-05-30 08:26:22.000265",
                            "modified": "2018-05-30 08:26:22.000265",
                            "version": 1,
                            "id": "action1",
                            "kind": "EVAL",
                            "createdby": "Splunk",
                            "modifiedby": "Splunk",
                            "ruleid": "rule1",
                            "expression": "string",
                            "field": "test_field"
                        },
                        {
                            "owner": "Splunk",
                            "created": "2018-05-30 08:26:22.000265",
                            "modified": "2018-05-30 08:26:22.000265",
                            "version": 1,
                            "id": "action2",
                            "kind": "AUTOKV",
                            "createdby": "Splunk",
                            "modifiedby": "Splunk",
                            "ruleid": "rule1",
                            "mode": "NONE"
                        },
                        {
                            "owner": "Splunk",
                            "created": "2018-05-30 08:26:22.000265",
                            "modified": "2018-05-30 08:26:22.000265",
                            "version": 1,
                            "id": "action3",
                            "kind": "LOOKUP",
                            "createdby": "Splunk",
                            "modifiedby": "Splunk",
                            "ruleid": "5b0e602eef3bf0000adad9f3",
                            "expression": "string"
                        }
                    ]
                };
            return splunk.catalog.createRule(rule).then(response => {
                assert.typeOf(response, 'object', 'response should be an object');
                assert.deepEqual(response, expectedResponse, 'response should contain the same object posted');
            });
        });
    });
});

describe('Field Endpoints', () => {

    describe('Get a dataset field', () => {
        it('should return a dataset field based on datasetID and datasetFieldID', () => splunk.catalog.getDatasetField('TEST_DATASET_ID', 'TEST_FIELD_ID_01').then(field => {
            assert.typeOf(field, 'object', 'response data should be an object');
            assert('name' in field, 'date_second');
            assert('datatype' in field, 'NUMBER');
            assert('fieldtype' in field, 'DIMENSION');
            assert('prevalence' in field, 'ALL');
        }));
    });

    describe('Get all the dataset fields', () => {
        it('should return an array of dataset fields', () => splunk.catalog.getDatasetFields('TEST_DATASET_ID').then(fields => {
            assert.typeOf(fields, 'array', 'response should be an array');
            fields.forEach(field => {
                assert('name' in field, 'field should contain key: name');
                assert('datatype' in field, 'field should contain key: datatype');
                assert('fieldtype' in field, 'field should contain key: fieldtype');
                assert('prevalence' in field, 'field should contain key: prevalence');
            });
            assert.deepEqual(fields.length, 3, 'Three fields should be returned');
        }));
    });

    describe('Post a new dataset field', () => {
        it('should return the created dataset field with post', () => {
            const datasetField =
                {
                    "datasetid": "TEST_DATASET_ID",
                    "name": "test_data",
                    "datatype": "S",
                    "fieldtype": "D",
                    "prevalence": "A"
                };
            const expectedResponse =
                {
                    "id": "TEST_FIELD_ID_01",
                    "datasetid": "TEST_DATASET_ID",
                    "name": "test_data",
                    "datatype": "STRING",
                    "fieldtype": "DIMENSION",
                    "prevalence": "ALL",
                    "created": "2018-06-22 05:13:51.000730",
                    "modified": "2018-06-22 05:13:51.000730",
                    "readroles": [],
                    "writeroles": []
                };
            return splunk.catalog.postDatasetField('TEST_DATASET_ID', datasetField).then(response => {
                assert.typeOf(response, 'object', 'response should be an object');
                assert.deepEqual(response, expectedResponse, 'response should contain the same object posted');
            });
        });
    });

    describe('Patch an existing dataset field', () => {
        it('should update an existing dataset field with new values', () => {
            const datasetField =
                {
                    "datasetid": "TEST_DATASET_ID",
                    "name": "test_data",
                    "datatype": "N",
                    "fieldtype": "D",
                    "prevalence": "A"
                };
            const expectedResponse =
                {
                    "id": "TEST_FIELD_ID_01",
                    "datasetid": "TEST_DATASET_ID",
                    "name": "test_data",
                    "datatype": "NUMBER",
                    "fieldtype": "DIMENSION",
                    "prevalence": "ALL",
                    "created": "2018-06-22 05:13:51.000730",
                    "modified": "2018-06-22 05:13:51.000730",
                    "readroles": [],
                    "writeroles": []
                };
            return splunk.catalog.patchDatasetField('TEST_DATASET_ID', 'TEST_FIELD_ID_01', datasetField).then(response => {
                assert.typeOf(response, 'object', 'response should be an object');
                assert.deepEqual(response, expectedResponse, 'response should contain the same object posted');
            });
        });
    });

    describe('Delete a dataset field', () => {
        it('should return no response body', () => splunk.catalog.deleteDatasetField('TEST_DATASET_ID', 'TEST_FIELD_ID_01').then(response => {
            assert(!response);
        }));
    });
});
