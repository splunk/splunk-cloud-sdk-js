/**
 * Copyright 2019 Splunk, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"): you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import { assert } from 'chai';
import 'mocha';
import * as catalog from '../../services/catalog';
import { SplunkCloud } from '../../splunk';
import config from '../config';

const splunkCloud = new SplunkCloud({
    urls: {
        api: config.stagingApiHost,
    },
    tokenSource: config.stagingAuthToken,
    defaultTenant: config.stagingTenant,
});

describe('catalog tests', () => {
    const indexName = `idx_${Date.now()}`;
    // Create an index to ensure there is something to return
    before(() => createIndexDataset(indexName));
    after(() =>
        splunkCloud.catalog
            .deleteDataset(indexName)
            .catch(err => console.log(`Error cleaning index: ${err}`))
    );

    describe('datasets', () => {
        // it('should return datasets', () => splunkCloud.catalog.listDatasets().then(dslist => {
        //     console.log(dslist.length);
        //     assert.isAtLeast(dslist.length, 1);
        //     assert.exists(dslist[0].kind);
        // }));

        it('should return datasets with filter', () => splunkCloud.catalog.listDatasets({ filter: 'kind=="index"' }).then((dslist) => {
            assert.isAtLeast(dslist.length, 1);
            assert.equal(dslist[0].kind as string, 'index');
        }));

        it('should list datasets with complex filter', () => splunkCloud.catalog.listDatasets({ filter: `name=="${indexName}" AND kind=="index"` }).then((dslist) => {
            assert.isAtLeast(dslist.length, 1);
            assert.equal(dslist[0].kind as string, 'index');
            assert.equal(dslist[0].name, indexName);
        }));

        it('should list datasets with a count of 1', () => splunkCloud.catalog.listDatasets({ count: 1 }).then((dslist) => {
            assert.equal(dslist.length, 1);
        }));

        // it('should list datasets ordered by id descending', () => splunkCloud.catalog.listDatasets({ orderby: ['id desc'], count: 5 }).then((dslist) => {
        //     assert.isAtLeast(dslist.length, 1);
        //     assert.isTrue(dslist.every((ds, i) => {
        //         return i === 0 || ds.id <= dslist[i - 1].id;
        //     }));
        // }));

        it('should list datasets with all option query args', () => {
            const query = {
                filter: 'kind=="index"',
                count: 1,
                orderby: ['id desc']
            };

            return splunkCloud.catalog.listDatasets(query).then((dslist) => {
                assert.equal(dslist.length, 1);
            });
        });

        it('should allow create/delete of datasets', () => {
            const name = `index_${Date.now()}`;
            return createIndexDataset(name).then(res => {
                const ds = res as catalog.Dataset;
                assert.equal(ds.name, name);
                assert.equal(ds.kind as string, 'index');
                return ds.id;
            }).then(id => splunkCloud.catalog.deleteDatasetById(id));
        });

        it('should allow create/delete of metric datasets', () => {
            const name = `metric_${Date.now()}`;
            return splunkCloud.catalog.createDataset({
                name,
                kind: catalog.MetricDatasetKind.Metric,
                disabled: false
            }).then(() => splunkCloud.catalog.deleteDataset(name));

        });

        it('should allow create/delete of view datasets', () => {
            const name = `view_${Date.now()}`;
            return splunkCloud.catalog.createDataset({
                name,
                kind: catalog.ViewDatasetKind.View,
                search: 'search index=main|stats count()'
            }).then(() => splunkCloud.catalog.deleteDataset(name));

        });

        it('should allow create/delete of import datasets', () => {
            const kind = catalog.MetricDatasetKind.Metric;
            const metricDS = `metric1_${Date.now()}`;
            const importDS = `import1_${Date.now()}`;
            const metricModule = `metmodule${Date.now()}`;
            const importModule = `impmodule${Date.now()}`;

            return splunkCloud.catalog.createDataset({
                kind, name: metricDS, module: metricModule, disabled: false
            }).then(res => {
                const ds = res as catalog.Dataset;
                assert.equal(ds.name, metricDS);
                assert.equal(ds.kind, kind);

                return splunkCloud.catalog.createDataset({
                    kind: catalog.ImportDatasetKind.Import,
                    name: importDS,
                    module: importModule,
                    sourceName: metricDS,
                    sourceModule: metricModule
                });
            }).then(res => {
                const ds = res as catalog.Dataset;
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

        // TODO: investigate creation of import by id
        it.skip('should allow create dataset import by id', () => {
            const importModule = `impmodule${Date.now()}`;
            const dsName = `importds${Date.now()}`;
            return splunkCloud.catalog.getDatasetById(indexName).then(ds => {
                assert.isNotNull(ds);
                return createIndexDataset(dsName, importModule).then(ds2 => {
                    assert.isNotNull(ds2);
                    // use non-null assertion operator ! since we already checked ds2 is not null
                    return splunkCloud.catalog.createDatasetImportById(ds!.id as string, { name: ds.name, module: ds2!.module, owner: 'testOwner' });
                }).then(importDS => {
                    assert.isNotNull(importDS);
                    assert.equal(importDS.module, ds.module);
                    assert.equal(importDS.name, ds.name);
                }).then(() => splunkCloud.catalog.deleteDataset(`${importModule}.${dsName}`));
            });
        });

        // TODO: investigate creation of import by resourcename
        it.skip('should allow create dataset import by resourcename', () => {
            const importModule = `impmodule${Date.now()}`;
            const dsName = `importds${Date.now()}`;
            return splunkCloud.catalog.getDatasetById(indexName).then(ds => {
                assert.isNotNull(ds);
                return createIndexDataset(dsName, importModule).then(ds2 => {
                    assert.isNotNull(ds2);
                    return splunkCloud.catalog.createDatasetImport(ds!.id as string, { name: ds.name, module: ds2!.module, owner: 'testOwner' });
                }).then(importDS => {
                    assert.isNotNull(importDS);
                    assert.equal(importDS.module, ds.module);
                    assert.equal(importDS.name, ds.name);
                }).then(() => splunkCloud.catalog.deleteDataset(`${importModule}.${dsName}`));
            });
        });

        it('should allow create / delete KVCollection Dataset', () => {
            const name = `kvds${Date.now()}`;
            return createKVCollectionDataset(name).then(kvds => {
                assert.isNotNull(kvds);
                assert.equal(kvds!.kind, catalog.KVCollectionDatasetKind.Kvcollection);
            }).then(() => splunkCloud.catalog.deleteDataset(name));
        });

        it('should allow delete of datasets by name', () => {
            const name = `foobar1${Date.now()}`;
            return createIndexDataset(name).then(() => splunkCloud.catalog.deleteDataset(name))
                .catch(e => console.log(e));
        });

        it('should throw an error when deleting a dataset that doesn\'t exist', () => {
            return splunkCloud.catalog.deleteDataset('queequeg')
                .then(() => assert.fail('Should have thrown'), () => true /* success */);
        });

        it('should allow update dataset by id', () => {
            const name = `updateds${Date.now()}`;
            return createIndexDataset(name).then(inxds => {
                assert.isNotNull(inxds);
                return splunkCloud.catalog.updateDatasetById(inxds!.id, { disabled: true });
            }).then(newds => {
                assert.isNotNull(newds);
                assert.equal(newds.kind, catalog.IndexDatasetKind.Index);
                const typedNewDS = newds as catalog.IndexDataset;
                assert.equal(typedNewDS.disabled, true);
            }).then(() => splunkCloud.catalog.deleteDataset(name));
        });

        it('should allow update dataset by name', () => {
            const name = `updateds${Date.now()}`;
            return createIndexDataset(name).then(inxds => {
                assert.isNotNull(inxds);
                return splunkCloud.catalog.updateDataset(`${inxds!.name}`, { disabled: true });
            }).then(newds => {
                assert.isNotNull(newds);
                assert.equal(newds.kind, catalog.IndexDatasetKind.Index);
                const typedNewDS = newds as catalog.IndexDataset;
                assert.equal(typedNewDS.disabled, true);
            }).then(() => splunkCloud.catalog.deleteDataset(name));
        });
    }).timeout(10000);

    describe('modules', () => {
        it('should return a list of defined modules', () => splunkCloud.catalog.listModules().then(modules => {
            assert.isAtLeast(modules.length, 1);
            assert.equal(1, modules.filter(m => m.name === '').length);
        }));

        it('should return a list of filtered modules', () => splunkCloud.catalog.listModules({ filter: 'module=="nonexistent"' }).then(modules => {
            assert.equal(modules.length, 0);
        }));
    });

    describe('rules', () => {
        it('should allow creation, listing, deletion of rules', () => {
            const ruleName = `testrule${Date.now()}`;
            let rule: catalog.Rule;
            return createRule(ruleName).then(res => {
                rule = res;
                return splunkCloud.catalog.listRules();
            }).then(ruleList => {
                assert.isAtLeast(ruleList.length, 1, 'We should have at least one rule after creating one');
                return splunkCloud.catalog.listRules({ filter: `name=="${rule.name}"` });
            }).then(rules => {
                assert.equal(rules.length, 1, `We should have at least one rule matching the name '${ruleName}'`);
                assert.equal(rules[0].name, ruleName);
                // Only delete the rule we just created by id
                return splunkCloud.catalog.deleteRuleById(rule.id);
            });
        });
    }).timeout(10000);

    describe('dataset fields', () => {
        const datasetName = `integfields${Date.now()}`;
        const integrationTestField1 = 'integ_test_field1';
        const integrationTestField2 = 'integ_test_field2';
        let resultDatasetField1: catalog.Field;
        let resultDatasetField2: catalog.Field;
        let resultDataset: catalog.Dataset;

        // Cleanup the dataset after we're done with fields
        after(() =>
            splunkCloud.catalog
                .deleteDataset(datasetName)
                .catch(err => console.log(`Error cleaning dataset for fields: ${err}`))
        );

        it('should create a test dataset, its fields, list its fields and delete the test dataset', () => {
            return splunkCloud.catalog.createDataset({
                name: datasetName,
                kind: catalog.LookupDatasetKind.Lookup,
                externalKind: catalog.LookupDatasetExternalKind.Kvcollection,
                externalName: 'test_externalName'
            }).then(res => {
                resultDataset = res;
                return splunkCloud.catalog.createFieldForDatasetById(resultDataset.id, {
                    name: integrationTestField1,
                    datatype: catalog.FieldDataType.STRING,
                    fieldtype: catalog.FieldType.DIMENSION,
                    prevalence: catalog.FieldPrevalence.ALL
                });
            }).then(res => {
                resultDatasetField1 = res as catalog.Field;
                return splunkCloud.catalog.getFieldByIdForDatasetById(resultDataset.id, resultDatasetField1.id as string);
            }).then((getResultDatasetField) => {
                assert.equal(getResultDatasetField.name, integrationTestField1);
                return splunkCloud.catalog.getFieldById(resultDatasetField1.id as string);
            }).then(field => {
                assert.equal(resultDatasetField1.name, field.name);
                return splunkCloud.catalog.listFieldsForDatasetById(resultDataset.id);
            }).then(fields => {
                const foundFields = fields.filter(field => field.name === resultDatasetField1.name);
                assert.equal(foundFields.length, 1);
            }).then(() => {
                return splunkCloud.catalog.createFieldForDatasetById(resultDataset.id, {
                    name: integrationTestField2,
                    datatype: catalog.FieldDataType.STRING,
                    fieldtype: catalog.FieldType.DIMENSION,
                    prevalence: catalog.FieldPrevalence.ALL
                });
            }).then((res) => {
                resultDatasetField2 = res as catalog.Field;
                return splunkCloud.catalog.getFieldByIdForDatasetById(resultDataset.id, resultDatasetField2.id as string);
            }).then((getResultDatasetField) => {
                assert.equal(getResultDatasetField.name, integrationTestField2);
                return splunkCloud.catalog.listFieldsForDatasetById(resultDataset.id);
            }).then((resultDatasetFields) => {
                assert.equal(resultDatasetFields.length, 2);
                return splunkCloud.catalog.listFieldsForDatasetById(resultDataset.id, { filter: 'name=="integ_test_field2"' });
            }).then((resultDatasetFields) => {
                assert.equal(resultDatasetFields.length, 1);
                assert.equal(resultDatasetFields[0].name, integrationTestField2);
                return splunkCloud.catalog.updateFieldByIdForDatasetById(resultDataset.id, resultDatasetField2.id as string, { name: 'integ_test_field3' });
            }).then((patchResultDatasetField) => {
                assert.equal(patchResultDatasetField.name, 'integ_test_field3');
                return splunkCloud.catalog.deleteFieldByIdForDatasetById(resultDataset.id, resultDatasetField2.id as string);
            }).then((response) => {
                assert.isEmpty(response);
                return splunkCloud.catalog.deleteDatasetById(resultDataset.id);
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
                kind: catalog.LookupDatasetKind.Lookup,
                externalKind: catalog.LookupDatasetExternalKind.Kvcollection,
                externalName: 'test_externalName'
            }).then(dataset => {
                return splunkCloud.catalog.createFieldForDatasetById(dataset.id, {
                    name: fieldName,
                    datatype: catalog.FieldDataType.STRING,
                    fieldtype: catalog.FieldType.DIMENSION,
                    prevalence: catalog.FieldPrevalence.ALL
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

        it('should create/delete ALIAS rule actions', () => {
            return splunkCloud.catalog.createActionForRuleById(ruleId, {
                alias: 'newalias',
                kind: catalog.AliasActionKind.ALIAS,
                field: fieldName
            } as catalog.AliasAction).then(res => {
                const act = res as catalog.AliasAction;
                assert.equal(act.field, fieldName);
                return splunkCloud.catalog.getActionByIdForRuleById(ruleId, act.id as string);
            }).then(res => {
                const act = res as catalog.AliasAction;
                assert.equal(act.field, fieldName);
                return splunkCloud.catalog.deleteActionByIdForRuleById(ruleId, act.id);
            });
        });

        it('should create REGEX rule actions', () => {
            const regex = {
                pattern: 'mypattern', kind: catalog.RegexActionKind.REGEX, field: fieldName, limit: 5,
            };
            return splunkCloud.catalog.createActionForRuleById(ruleId, regex as catalog.RegexAction).then(res => {
                const act = res as catalog.RegexAction;
                assert.equal(act.pattern, regex.pattern);
                assert.equal(act.limit, regex.limit);
                return splunkCloud.catalog.deleteActionByIdForRule(ruleScope, act.id);
            });
        });


        it('should create EVAL rule actions', () => {
            const evalAction = {
                expression: 'myexpr', kind: catalog.EvalActionKind.EVAL, field: fieldName
            };
            return splunkCloud.catalog.createActionForRule(ruleScope, evalAction as catalog.EvalAction).then(res => {
                const act = res as catalog.EvalAction;
                assert.equal(act.expression, evalAction.expression);
                return splunkCloud.catalog.deleteActionByIdForRuleById(ruleId, act.id);
            });
        });

        it('should create AUTOKV rule actions', () => {
            const autokvAction = {
                mode: 'auto', kind: catalog.AutoKVActionKind.AUTOKV
            };
            return splunkCloud.catalog.createActionForRuleById(ruleId, autokvAction as catalog.AutoKVAction).then(res => {
                const act = res as catalog.AutoKVAction;
                assert.equal(act.mode, autokvAction.mode);
                return splunkCloud.catalog.deleteActionByIdForRule(ruleScope, act.id);
            });
        });

        it('should create LOOKUP rule actions', () => {
            const lookup = {
                expression: 'lookupexpr', kind: catalog.LookupActionKind.LOOKUP
            };
            return splunkCloud.catalog.createActionForRuleById(ruleId, lookup as catalog.LookupAction).then(res => {
                const act = res as catalog.LookupAction;
                assert.equal(act.expression, lookup.expression);
                return splunkCloud.catalog.deleteActionByIdForRule(ruleScope, act.id);
            });

        });
    }).timeout(1000);

    describe('dashboards', () => {
        const dashboardName = `integdashboard${Date.now()}`;
        let dashboardID = '';

        before(async () =>
            splunkCloud.catalog.createDashboard({ name: dashboardName, module: 'allmembers', definition: '{"title":"this is my test dashboard"}' } as catalog.DashboardPOST)
                .then(res => {
                    dashboardID = res.id;
                })
                .catch(err => {
                    console.log('An error was encountered while creating dashboard datasets');
                    console.log(err);
                }));
        // Cleanup the dataset after we're done with dashboards
        after(() =>
            splunkCloud.catalog
                .deleteDashboardByResourceName(dashboardID)
                .catch(err => console.log(`Error cleaning dataset for dashboards: ${err}`))
        );

        it('should return an httpStatusCode when dashboard not found', () => splunkCloud.catalog.getDashboardById('404040404040404040404040').then(dashboards => {
            assert.fail(true, false, 'getDashboardById should fail with 404 response code');
        }).catch((e) => {
            assert.equal(e.httpStatusCode, 404);
        }));

        it('should return dashboards', () => splunkCloud.catalog.listDashboards().then(dashboards => {
            assert.isAtLeast(dashboards.length, 1);
        }));

        it('should allow update dashboard', () =>
            splunkCloud.catalog.updateDashboardById(dashboardID, { name: `${dashboardName}_updated` })
                .then(() => {
                    return splunkCloud.catalog.getDashboardById(dashboardID).then(dashboard => {
                        assert.equal(dashboard.name, `${dashboardName}_updated`);
                    });
                }));
    });

    describe('test annotations', () => {
        const lookupDSName = 'annx';
        const lookupMod = 'annxmod';
        const dsResourceName = `${lookupMod}.${lookupDSName}`;
        let dsID: string;

        before(() => {
            return splunkCloud.catalog.createDataset({
                name: lookupDSName,
                kind: catalog.LookupDatasetKind.Lookup,
                externalKind: catalog.LookupDatasetExternalKind.Kvcollection,
                externalName: 'test_externalName',
                filter: `kind=="lookup"`,
                module: lookupMod,
            }).then(dataset => {
                dsID = dataset.id;
            });
        });

        after(() => {
            return splunkCloud.catalog.deleteDatasetById(dsID).then((res) => {
                assert.isEmpty(res);
                console.log('finish delete dataset');
            });
        });

        it('should allow CRUD operations on annotation dataset', () => {
            // There is exactly one that can be used at the moment
            const defaultAnnotationTypeId = '00000000000000000000008b';
            let annoID: string;
            return splunkCloud.catalog.getDatasetById(dsID).then(ds => {
                return splunkCloud.catalog.createAnnotationForDatasetById(ds.id as string, { annotationtypeid: defaultAnnotationTypeId });
            }).then(anno => {
                assert.equal(anno.annotationtypeid, defaultAnnotationTypeId);
                return splunkCloud.catalog.deleteAnnotationOfDatasetById(dsID, anno.id);
            }).then(() => {
                return splunkCloud.catalog.createAnnotationForDatasetByResourceName(dsResourceName, { annotationtypeid: defaultAnnotationTypeId });
            }).then(anno2 => {
                assert.equal(anno2.annotationtypeid, defaultAnnotationTypeId);
                annoID = anno2.id;
                return splunkCloud.catalog.listAnnotationsForDatasetById(dsID);
            }).then(annos => {
                assert.isTrue(annos.length > 0);
                return splunkCloud.catalog.listAnnotationsForDatasetByResourceName(dsResourceName);
            }).then(annos2 => {
                assert.isTrue(annos2.length > 0);
                return splunkCloud.catalog.deleteAnnotationOfDatasetByResourceName(dsResourceName, annoID);
            }).then(res => {
                assert.isEmpty(res);
            });
        });
    });
});

export function createIndexDataset(name: string, module: string = ''): Promise<catalog.Dataset | null> {
    return splunkCloud.catalog.createDataset({
        name,
        module,
        kind: catalog.IndexDatasetKind.Index,
        disabled: false,
    }).then(response => response as catalog.Dataset)
        .catch(error => {
            console.log('An error was encountered while creating datasets');
            console.log(error);
            return null;
        });
}

export function createKVCollectionDataset(name: string, module: string = ''): Promise<catalog.Dataset | null> {
    return splunkCloud.catalog.createDataset({
        name,
        module,
        kind: catalog.KVCollectionDatasetKind.Kvcollection,
    }).then(response => {
        return response;
    }).catch(error => {
        console.log('An error was encountered while cleaning up datasets');
        console.log(error);
        return null;
    });
}

// TODO: this function should just create the given rule, any consumers of this function should pass a unique rule name
export function createRule(ruleName: string): Promise<any> {
    return splunkCloud.catalog
        .listRules()
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
                    return splunkCloud.catalog.deleteRuleById(rule.id);
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
