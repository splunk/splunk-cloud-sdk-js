import { assert } from 'chai';
import 'mocha';
import {
    AliasAction,
    AutoKVAction,
    DatasetInfo,
    Datatype,
    EvalAction,
    Field,
    Fieldtype,
    LookupAction,
    Prevalence,
    RegexAction, Rule
} from '../../catalog';
import { SplunkCloud } from '../../splunk';
import config from '../config';

const splunkCloud = new SplunkCloud({ urls: { api: config.stagingApiHost, app: config.stagingAppsHost }, tokenSource: config.stagingAuthToken, defaultTenant: config.stagingTenant });

describe('catalog tests', () => {
    const indexName = `idx_${Date.now()}`;
    // Create an index to ensure there is something to return
    before(() => createIndexDataset(indexName));
    after(() =>
        splunkCloud.catalog
            .deleteDatasetByName(indexName)
            .catch(err => console.log(`Error cleaning index: ${err}`))
    );

    describe('datasets', () => {
        it('should return datasets', () => splunkCloud.catalog.getDatasets().then(dslist => {
            assert.isAtLeast(dslist.length, 1);
            assert.exists(dslist[0].kind);
        }));

        describe('modules', () => {
            it('should return a list of defined modules', () => splunkCloud.catalog.getModules().then(modules => {
                assert.isAtLeast(modules.length, 1);
                assert.equal(1, modules.filter(m => m.name === '').length);
            }));

            it('should return a list of filtered modules', () => splunkCloud.catalog.getModules('module=="nonexistent"').then(modules => {
                assert.equal(modules.length, 0);
            }));
        });

        it('should return datasets with no filter', () => splunkCloud.catalog.getDatasets().then((dslist) => {
            assert.isAtLeast(dslist.length, 1);
        }));

        it('should return datasets with filter', () => splunkCloud.catalog.getDatasets('kind=="index"').then((dslist) => {
            assert.isAtLeast(dslist.length, 1);
            assert.equal(dslist[0].kind, 'index');
        }));

        it('should list datasets with no options', () => splunkCloud.catalog.listDatasets().then((dslist) => {
            assert.isAtLeast(dslist.length, 1);
        }));

        it('should list datasets with filter', () => splunkCloud.catalog.listDatasets({ filter: 'kind=="index"' }).then((dslist) => {
            assert.isAtLeast(dslist.length, 1);
            assert.equal(dslist[0].kind, 'index');
        }));

        it('should list datasets with a count of 1', () => splunkCloud.catalog.listDatasets({ count: 1 }).then((dslist) => {
            assert.equal(dslist.length, 1);
        }));

        it('should list datasets ordered by id descending', () => splunkCloud.catalog.listDatasets({ orderby: 'id Descending' }).then((dslist) => {
            assert.isAtLeast(dslist.length, 1);
            // TODO: this is flaky due to too many datasets existing, bring it back once tests become more dynamic
            // assert.equal(dslist[0].id, dslist[dslist.length - 1].id);
        }));

        it('should list datasets with all option query args', () => {
            const query = {
                filter: 'kind=="index"',
                count: 1,
                orderby: 'id Descending'
            };

            return splunkCloud.catalog.listDatasets(query).then((dslist) => {
                assert.equal(dslist.length, 1);
            });
        });

        it('should allow create/delete of datasets', () => {
            const name = 'foobar';
            return createIndexDataset(name).then(res => {
                const ds = res as DatasetInfo;
                assert.equal(ds.name, name);
                assert.equal(ds.kind, 'index');
                return ds.id;
            }).then(id => splunkCloud.catalog.deleteDataset(id));
        });

        it('should allow create/delete of metric datasets', () => {
            const name = `metric_${Date.now()}`;
            return splunkCloud.catalog.createDataset({
                name,
                kind: 'metric',
                disabled: false
            }).then(() => splunkCloud.catalog.deleteDataset(name));

        });

        it('should allow create/delete of view datasets', () => {
            const name = `view_${Date.now()}`;
            return splunkCloud.catalog.createDataset({
                name,
                kind: 'view',
                search: 'search index=main|stats count()'
            }).then(() => splunkCloud.catalog.deleteDataset(name));

        });

        it('should allow create/delete of import datasets', () => {
            const kind = 'metric';
            const metricDS = `metric1_${Date.now()}`;
            const importDS = `import1_${Date.now()}`;
            const metricModule = `metmodule${Date.now()}`;
            const importModule = `impmodule${Date.now()}`;

            return splunkCloud.catalog.createDataset({
                kind, name: metricDS, module: metricModule, disabled: false
            }).then(res => {
                const ds = res as DatasetInfo;
                assert.equal(ds.name, metricDS);
                assert.equal(ds.kind, kind);

                return splunkCloud.catalog.createDataset({
                    kind: 'import',
                    name: importDS,
                    module: importModule,
                    sourceName: metricDS,
                    sourceModule: metricModule
                });
            }).then(res => {
                const ds = res as DatasetInfo;
                assert.equal(ds.name, importDS);
                assert.equal(ds.module, importModule);
                assert.notEqual(ds.module, metricModule);
                assert.notEqual(ds.kind, kind);

                // Make sure we delete the import dataset, before deleting the original one
                return splunkCloud.catalog.deleteDataset(`${importModule}.${importDS}`);
            }).then(res => {
                assert.isEmpty(res);
                return splunkCloud.catalog.deleteDataset(`${metricModule}.${metricDS}`);
            }).then(res => {
                assert.isEmpty(res);
            });
        });

        it('should allow delete of datasets by name', () => {
            const name = `foobar1${Date.now()}`;
            return createIndexDataset(name).then(() => splunkCloud.catalog.deleteDatasetByName(name))
                .catch(e => console.log(e));
        });

        it('should throw an error when deleting a dataset that doesn\'t exist', () => {
            return splunkCloud.catalog.deleteDataset('queequeg')
                .then(() => assert.fail('Should have thrown'), () => true /* success */);
        });
    }).timeout(10000);

    describe('rules', () => {
        it('should allow creation, listing, deletion of rules', () => {
            const ruleName = `testRule${Date.now()}`;
            let rule: Rule;
            return createRule(ruleName).then(res => {
                rule = res;
                return splunkCloud.catalog.getRules();
            }).then(ruleList => {
                assert.isAtLeast(ruleList.length, 1, 'We should have at least one rule after creating one');
                return splunkCloud.catalog.getRules(`name=="${rule.name}"`);
            }).then(rules => {
                assert.equal(rules.length, 1, `We should have at least one rule matching the name '${ruleName}'`);
                assert.equal(rules[0].name, ruleName);
                // Only delete the rule we just created by id
                return splunkCloud.catalog.deleteRule(rule.id);
            });
        });
    }).timeout(10000);

    describe('dataset fields', () => {
        const integrationTestField1 = 'integ_test_field1';
        const integrationTestField2 = 'integ_test_field2';
        let resultDatasetField1: Field;
        let resultDatasetField2: Field;
        let resultDataset: DatasetInfo;
        it('should create a test dataset, its fields, list its fields and delete the test dataset', () => {
            return splunkCloud.catalog.createDataset({
                name: `integ_dataset_1000_${Date.now()}`,
                kind: 'lookup',
                capabilities: '1101-00000:11010',
                externalKind: 'kvcollection',
                externalName: 'test_externalName'
            }).then(res => {
                resultDataset = res;
                return splunkCloud.catalog.postDatasetField(resultDataset.id, {
                    name: integrationTestField1,
                    datatype: Datatype.STRING,
                    fieldtype: Fieldtype.DIMENSION,
                    prevalence: Prevalence.ALL
                });
            }).then(res => {
                resultDatasetField1 = res as Field;
                return splunkCloud.catalog.getDatasetField(resultDataset.id, resultDatasetField1.id as string);
            }).then((getResultDatasetField) => {
                assert.equal(getResultDatasetField.name, integrationTestField1);
                return splunkCloud.catalog.getField(resultDatasetField1.id as string);
            }).then(field => {
                assert.equal(resultDatasetField1.name, field.name);
                return splunkCloud.catalog.getFields();
            }).then(fields => {
                const foundFields = fields.filter(field => field.name === resultDatasetField1.name);
                assert.equal(foundFields.length, 1);
            }).then(() => {
                return splunkCloud.catalog.postDatasetField(resultDataset.id, {
                    name: integrationTestField2,
                    datatype: Datatype.STRING,
                    fieldtype: Fieldtype.DIMENSION,
                    prevalence: Prevalence.ALL
                });
            }).then((res) => {
                resultDatasetField2 = res as Field;
                return splunkCloud.catalog.getDatasetField(resultDataset.id, resultDatasetField2.id as string);
            }).then((getResultDatasetField) => {
                assert.equal(getResultDatasetField.name, integrationTestField2);
                return splunkCloud.catalog.getDatasetFields(resultDataset.id);
            }).then((resultDatasetFields) => {
                assert.equal(resultDatasetFields.length, 2);
                return splunkCloud.catalog.getDatasetFields(resultDataset.id, 'name=="integ_test_field2"');
            }).then((resultDatasetFields) => {
                assert.equal(resultDatasetFields.length, 1);
                assert.equal(resultDatasetFields[0].name, integrationTestField2);
                return splunkCloud.catalog.patchDatasetField(resultDataset.id, resultDatasetField2.id as string, { name: 'integ_test_field3' });
            }).then((patchResultDatasetField) => {
                assert.equal(patchResultDatasetField.name, 'integ_test_field3');
                return splunkCloud.catalog.deleteDatasetField(resultDataset.id, resultDatasetField2.id as string);
            }).then((response) => {
                assert.isEmpty(response);
                return splunkCloud.catalog.deleteDataset(resultDataset.id);
            }).then(res => {
                assert.isEmpty(res);
            });
        });
    }).timeout(10000);

    describe('rule actions', () => {
        const fieldName = 'action_test_field1';
        const ruleName = 'action_test_rule';
        const ruleModule = 'catalog';
        const ruleScope = `${ruleModule}.${ruleName}`;
        const ruleMatch = 'sourcetype::integration_test_match';
        const datasetName = 'action_dataset';

        let ruleId: string;
        before(() => {
            return splunkCloud.catalog.createDataset({
                name: datasetName,
                kind: 'lookup',
                externalKind: 'kvcollection',
                externalName: 'test_externalName'
            }).then(dataset => {
                return splunkCloud.catalog.postDatasetField(dataset.id, {
                    name: fieldName,
                    datatype: Datatype.STRING,
                    fieldtype: Fieldtype.DIMENSION,
                    prevalence: Prevalence.ALL
                });
            }).then(() => {
                return splunkCloud.catalog.createRule({
                    name: ruleName,
                    module: ruleModule,
                    match: ruleMatch
                });
            }).then((rule) => {
                ruleId = rule.id;
            });
        });

        after(() => {
            return splunkCloud.catalog.deleteDataset(datasetName).then((res) => {
                assert.isEmpty(res);
                console.log('finish delete dataset');
                return splunkCloud.catalog.deleteRule(ruleScope);
            }).then((res) => {
                assert.isEmpty(res);
                console.log('finish delete rule');
            });
        });

        it('should create ALIAS rule actions', () => {
            return splunkCloud.catalog.createRuleAction(ruleId, {
                alias: 'newalias',
                kind: 'ALIAS',
                field: fieldName
            }).then(res => {
                const act = res as AliasAction;
                assert.equal(act.field, fieldName);
                return splunkCloud.catalog.getRuleAction(ruleId, act.id as string);
            }).then(res => {
                const act = res as AliasAction;
                assert.equal(act.field, fieldName);
                // Delete handled in after block
            });
        });

        it('should create REGEX rule actions', () => {
            const regex: RegexAction = {
                pattern: 'mypattern', kind: 'REGEX', field: fieldName, limit: 5,
            };
            return splunkCloud.catalog.createRuleAction(ruleId, regex).then(res => {
                const act = res as RegexAction;
                assert.equal(act.pattern, regex.pattern);
            });
        });


        it('should create EVAL rule actions', () => {
            const evalAction: EvalAction = {
                expression: 'myexpr', kind: 'EVAL', field: fieldName
            };
            return splunkCloud.catalog.createRuleAction(ruleId, evalAction).then(res => {
                const act = res as EvalAction;
                assert.equal(act.expression, evalAction.expression);
            });
        });

        it('should create AUTOKV rule actions', () => {
            const autokvAction: AutoKVAction = {
                mode: 'auto', kind: 'AUTOKV'
            };
            return splunkCloud.catalog.createRuleAction(ruleId, autokvAction).then(res => {
                const act = res as AutoKVAction;
                assert.equal(act.mode, autokvAction.mode);
            });
        });

        it('should create LOOKUP rule actions', () => {
            const lookup: LookupAction = {
                expression: 'lookupexpr', kind: 'LOOKUP'
            };
            return splunkCloud.catalog.createRuleAction(ruleId, lookup).then(res => {
                const act = res as LookupAction;
                assert.equal(act.expression, lookup.expression);
            });

        });
    }).timeout(1000);
});

export function createIndexDataset(collection: string): Promise<object | void> {
    return splunkCloud.catalog.createDataset({
        name: collection,
        kind: 'index',
        capabilities: '1101-00000:11010',
        disabled: false
    }).then(response => {
        return response;
    }).catch(error => {
        console.log('An error was encountered while cleaning up datasests');
        console.log(error);
    });
}

export function createKVCollectionDataset(namespace: string, collection: string): Promise<DatasetInfo | void> {
    return splunkCloud.catalog.createDataset({
        name: collection,
        kind: 'kvcollection',
        capabilities: '1101-00000:11010',
        module: namespace
    }).then(response => {
        return response;
    }).catch(error => {
        console.log('An error was encountered while cleaning up datasests');
        console.log(error);
    });
}

export function createRecord(collection: string, record: object): Promise<object> {
    return splunkCloud.kvstore.insertRecord(collection, record as {[key: string]: string})
        .then(response => {
            assert.notEqual(response._key, null);
            assert.typeOf(response._key, 'string');
            return response;
        });
}

// TODO: this function should just create the given rule, any consumers of this function should pass a unique rule name
export function createRule(ruleName: string): Promise<any> {
    return splunkCloud.catalog
        .getRules()
        // Filters the rules
        .then(rules => {
            return rules.filter(element => {
                if (element.name === ruleName) {
                    return element;
                }
            });
        })
        // Deletes the rule - there should only be one rule
        .then(rules => {
            return Promise.all(
                rules.map(rule => {
                    return splunkCloud.catalog.deleteRule(rule.id);
                })
            );
        })
        // Creates the rule
        .then(() => {
            return splunkCloud.catalog.createRule({
                name: ruleName,
                match: 'sourcetype::newtype'
            });
        })
        // Return the rule testing
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log('An error was encountered while cleaning up the rules');
            console.log(error);
        });
}
