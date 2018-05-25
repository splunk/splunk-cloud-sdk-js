const config = require("../config");
const SplunkSSC = require("../../src/splunk");
const {assert} = require("chai");

const token = process.env.BEARER_TOKEN;
const tenantID = process.env.TENANT_ID;
// const token = 'eyJraWQiOiI3cXV0SjFleUR6V2lOeGlTbktsakZHRWhmU0VzWFlMQWt0NUVNbzJaNFk4IiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULnoySmFta3ozQW90U2Z3MFRVaDg2V3hhLUc2RldSYmZUbzB2UUhHeDJyQ3ciLCJpc3MiOiJodHRwczovL3NwbHVuay1jaWFtLm9rdGEuY29tL29hdXRoMi9kZWZhdWx0IiwiYXVkIjoiYXBpOi8vZGVmYXVsdCIsImlhdCI6MTUyNjkyNDI5NywiZXhwIjoxNTI2OTI3ODk3LCJjaWQiOiIwb2FwYmcyem1MYW1wV2daNDJwNiIsInVpZCI6IjAwdXpreDNmbDUyeElVS2llMnA2Iiwic2NwIjpbIm9wZW5pZCIsImVtYWlsIiwicHJvZmlsZSJdLCJzdWIiOiJkcG9uY2Vsb3dAc3BsdW5rLmNvbSJ9.Ylpm2u5H_-mC3y8RaA1oTYPN_S5tQPmibdxSclPOhvz9uqL7wnVhY0Zbpe4-qAPX8DkrLJXhNtQl8VzDq4fMRnkUma9q_Ml-dR0s5c-p9b4vrWPWOFtfJ_Zo1IQDAhyNgLIeIdee7SdvUFQJYb8TO8-s3gX8MRGgAutuM5HCGK_S1M-qSzoL0g2f3K-SUZsogJ_EwhxboQCZYJf2beFLpEIDieMLvPc78T2ukoe2RgA0wcArlcsmrC-JpW2jo2xrWLTaUn0iXC08GpoG8HhfVSLpt_nJLoaCivP4K7ggBkbAe9BIDX592nB646as7vkCXreJLN7BZwxH6rxf5JNmHQ';
// const tenantID = 'da719d83-3f32-49f0-a891-9ca7c92f5d0a';

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
                owner: "dponcelow@splunk.com",
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
