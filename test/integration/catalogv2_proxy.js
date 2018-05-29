const config = require("../config");
const SplunkSSC = require("../../src/splunk");
const {assert} = require("chai");

const token = process.env.BEARER_TOKEN;
const tenantID = process.env.TENANT_ID;

const ssc = new SplunkSSC(process.env.SSC_HOST, token, tenantID);

describe("catalog v2", () => {
    describe("datasets", () => {
        it("should return datasets", () => ssc.catalog.getDatasets().then((dslist) => {
            assert(dslist.length > 0);
            assert(dslist[0].kind);
        }));

        it("should return datasets with filter", () => ssc.catalog.getDatasets('kind=="index"').then((dslist) => {
            assert(dslist.length > 0);
            assert(dslist[0].kind === "index");
        }));

        it("should allow create/delete of datasets", () => {
            const name = "FooBar";
            const dataset = {
                name,
                owner: "test@splunk.com",
                kind: "index",
                capabilities: "1101-00000:11010",
                disabled: false
            };
            return ssc.catalog.createDataset(dataset).then(ds => {
                assert(ds.name === name);
                assert(ds.kind === "index");
                return ds.id;
            }).then(id => ssc.catalog.deleteDataset(id));

        });
    }).timeout(10000);

    describe("rules", () => {
        it("should allow creation, listing, deletion of rules", () => {
            const ruleName = "testRule";
            return ssc.catalog.createRule({
                name: ruleName,
                owner: "dponcelow@splunk.com",
                match: "host::192.168.0.1"
            }).then((rule) => ssc.catalog.getRules().then(ruleList => {
                assert(ruleList.length >= 1, "We should have at least one rule after creating one");
            }).then(() => ssc.catalog.getRules(`name=="${rule.name}"`).then((rules) => {
                assert(rules.length >= 1, "We should have a rule with the name we just created");
                assert(rules[0].name === ruleName, "The name should match");
                const ids = rules.map(r => r.id);
                return Promise.all(ids.map(id => ssc.catalog.deleteRule(id)));
            })));
        });

    }).timeout(10000);

});
