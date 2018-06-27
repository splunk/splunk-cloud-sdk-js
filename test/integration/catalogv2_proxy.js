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

        it("should allow delete of datasets by name", () => {
            const name = "FooBar1";
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
            }).then(() => ssc.catalog.deleteDatasetByName(name));
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

    describe("dataset fields", () => {
        const integrationTestField1 = "integ_test_field1";
        const integrationTestField2 = "integ_test_field2";
        it("should create a test dataset, its fields, list its fields and delete the test dataset", () => {
            ssc.catalog.createDataset({
                name: "integ_dataset_1000",
                owner: "Splunk",
                kind: "lookup",
                capabilities: "1101-00000:11010",
                externalKind: "kvcollection",
                externalName: "test_externalName"
            }).then((resultDataset) => ssc.catalog.postDatasetField(resultDataset.id, {
                "name": integrationTestField1,
                "datasetid": resultDataset.id,
                "datatype": "S",
                "fieldtype": "D",
                "prevalence": "A"
            }).then(resultDatasetField1 => ssc.catalog.getDatasetField(resultDataset.id,resultDatasetField1.id).then((getResultDatasetField) => {
                assert(getResultDatasetField.name, integrationTestField1);
            })).then(() => ssc.catalog.postDatasetField(resultDataset.id, {
                "name": integrationTestField2,
                "datasetid": resultDataset.id,
                "datatype": "S",
                "fieldtype": "D",
                "prevalence": "A"
            })).then((resultDatasetField2) => ssc.catalog.getDatasetField(resultDataset.id,resultDatasetField2.id).then((getResultDatasetField) => {
                assert(getResultDatasetField.name, integrationTestField2);
            }).then(() => ssc.catalog.getDatasetFields(resultDataset.id).then((resultDatasetFields) => {
                assert(resultDatasetFields.length === 2, "Two dataset fields should be created");
            })).then(() => ssc.catalog.getDatasetFields(resultDataset.id, "name==\"integ_test_field2\"").then((resultDatasetFields) => {
                assert(resultDatasetFields.length === 1, "One dataset fields should be created");
                assert(resultDatasetFields[0].name === integrationTestField2, "The name should match");
            })).then(() => ssc.catalog.patchDatasetField(resultDataset.id, resultDatasetField2.id, {"name" : "integ_test_field3"}).then((patchResultDatasetField) => {
                assert(patchResultDatasetField.name === "integ_test_field3", "The name should match");
            })).then(() => ssc.catalog.deleteDatasetField(resultDataset.id, resultDatasetField2.id).then((response) => {
                assert(!response)
            }))).then(() => ssc.catalog.deleteDataset(resultDataset.id)));
        });
    }).timeout(10000);
});
