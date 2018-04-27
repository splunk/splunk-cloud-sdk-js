const config = require("./config");
const SplunkSSC = require("../src/splunk");
const {assert} = require("chai");

const splunk = new SplunkSSC(`https://${config.novaHost}:443`, config.authToken, config.testTenant);

describe('Datasets Endpoints', () => {

    let datasetName
    before(() => {
        // Make sure the NOVA playground is stable.
    });

    describe('Post a dataset', () => {
        const postDataset =
            {
                "name": "ds5",
                "kind": "VIEW",
                "todo": "string",
                "rules": [
                    "rule1"
                ]
            };
        it('should return the created dataset with post', () => {
            return splunk.catalog.createDataset(postDataset).then(response => {
                assert(response);
                assert(response.id);
                datasetName = postDataset.name;
                assert.equal(response.name, postDataset.name, "Name should be equal")
                assert.equal(response.kind, "VIEW")
                assert.equal(response.rules.length, 1)
                assert.equal(response.rules[0].name, "string")
            });
        });
    });

    // Delete the created dataset else would get 409 conflict error
    after(() => {
        splunk.catalog.deleteDataset(datasetName)
    });
});
