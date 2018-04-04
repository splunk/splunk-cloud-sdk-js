let client = require("../dist/splunk");
let assert = require("chai").assert;

let splunk = new client.Splunk('http://localhost:8882', 'admin', 'changeme');

describe('Datasets Endpoints', () => {

  describe('Get', () => {
    it('should return an array of datasets', () => {
      return splunk.catalog.getDatasets().then(data => {
        assert.typeOf(data, 'array', 'response should be an array');
        data.forEach(dataset => {
          assert('id' in dataset, 'dataset should contain key: id');
          assert('name' in dataset, 'dataset should contain key: name');
          assert('kind' in dataset, 'dataset should contain key: kind');
          assert('todo' in dataset, 'dataset should contain key: todo');
          });
        })
    });
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
      const dataset = 
      {
        "id": "string",
        "name": "myname",
        "kind": "VIEW",
        "rules": [
          "string"
        ],
        "todo": "string"
      };
      return splunk.catalog.createDataset(dataset).then(response => {
        assert.deepEqual(response, dataset, 'response should contain the same dataset posted.')
      });
    });
  });
});

describe('Rules Endpoints', () => {

  describe('Get', () => {
    it('should return an array of rules', () => {
      return splunk.catalog.getRules().then(rules => {
        assert.typeOf(rules, 'array', 'response should be an array');
        rules.forEach(rule => {
          assert('name' in rule, 'rule should contain key: name');
          assert('match' in rule, 'rule should contain key: match');
        });
      });
    });
  });

  describe('Post', () => {
    it('should return the created rule with post', () => {
      const rule =
      {
        "name": "rule1",
        "match": "newrule",
        "priority": 7,
        "description": "first rule",
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
      return splunk.catalog.createRule(rule).then(response => {
        assert.typeOf(response, 'object', 'response should be an object');
        assert.deepEqual(response, rule, 'response should contain the same object posted');
      });
    });
  });
});