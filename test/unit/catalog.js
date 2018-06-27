const config = require("../config");
const {SplunkSSC} = require("../../splunk");
const {assert} = require("chai");

const splunk = new SplunkSSC(`http://${config.stubbyHost}:8882`, config.stubbyAuthToken, config.stubbyTenant);

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
