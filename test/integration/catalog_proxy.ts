import { assert } from 'chai';
import 'mocha';
import {
    AliasAction,
    AutoKVAction,
    DatasetInfo,
    DataType,
    EvalAction,
    Field,
    FieldType,
    LookupAction,
    Prevalence,
    RegexAction
} from '../../catalog';
import { SplunkCloud } from '../../splunk';
import config from '../config';

const splunkCloudHost = config.playgroundHost;
const token = config.playgroundAuthToken;
const tenantID = config.playgroundTenant;

const splunkCloud = new SplunkCloud(splunkCloudHost, token, tenantID);

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
            assert(dslist.length > 0);
            assert(dslist[0].kind);
        }));

        describe('modules', () => {
            it('should return a list of defined modules', () => splunkCloud.catalog.getModules().then(modules => {
                assert(modules.length >= 1);
                assert.equal(1, modules.filter(m => m.name === '').length);
            }));

            it('should return a list of filtered modules', () => splunkCloud.catalog.getModules('module=="nonexistent"').then(modules => {
                assert(modules.length === 0);
            }));
        });

        it('should return datasets with no filter', () => splunkCloud.catalog.getDatasets().then((dslist) => {
            assert(dslist.length > 0);
            assert(dslist[0].kind === 'index');
        }));

        it('should return datasets with filter', () => splunkCloud.catalog.getDatasets('kind=="index"').then((dslist) => {
            assert(dslist.length > 0);
            assert(dslist[0].kind === 'index');
        }));

        it('should list datasets with no options', () => splunkCloud.catalog.listDatasets().then((dslist) => {
            assert(dslist.length > 0);
            assert(dslist[0].kind === 'index');
        }));

        it('should list datasets with filter', () => splunkCloud.catalog.listDatasets({ filter: 'kind=="index"' }).then((dslist) => {
            assert(dslist.length > 0);
            assert(dslist[0].kind === 'index');
        }));

        it('should list datasets with a count of 1', () => splunkCloud.catalog.listDatasets({ count: 1 }).then((dslist) => {
            assert(dslist.length === 1);
        }));

        it('should list datasets ordered by id descending', () => splunkCloud.catalog.listDatasets({ orderby: 'id Descending' }).then((dslist) => {
            assert(dslist.length > 0);
            assert(dslist[0].id > dslist[dslist.length - 1].id);
        }));

        it('should list datasets with all option query args', () => {
            const query = {
                filter: 'kind=="index"',
                count: 1,
                orderby: 'id Descending'
            };

            splunkCloud.catalog.listDatasets(query).then((dslist) => {
                assert(dslist.length === 1);
            });
        });

        it('should allow create/delete of datasets', () => {
            const name = 'foobar';
            return createIndexDataset(name).then(res => {
                const ds = res as DatasetInfo;
                assert(ds.name === name);
                assert(ds.kind === 'index');
                return ds.id;
            }).then(id => splunkCloud.catalog.deleteDataset(id));

        });

        it('should allow create/delete of metric datasets', () => {
            const name = `metric_${Date.now()}`;
            splunkCloud.catalog.createDataset({
                name,
                kind: 'metric',
                disabled: false
            }).then(() => splunkCloud.catalog.deleteDataset(name));

        });

        it('should allow create/delete of view datasets', () => {
            const name = `view_${Date.now()}`;
            splunkCloud.catalog.createDataset({
                name,
                kind: 'view',
                search: 'search index=main|stats count()'
            }).then(() => splunkCloud.catalog.deleteDataset(name));

        });

        it('should allow create/delete of import datasets', () => {
            const kind = 'metric';
            const name1 = `metric1_${Date.now()}`;
            const name2 = `metric2_${Date.now()}`;
            const module1 = `module_${Date.now()}`;
            const module2 = `module_${Date.now()}`;

            splunkCloud.catalog.createDataset({
                kind, name: name1, module: module1, disabled: false
            }).then(res => {
                const ds = res as DatasetInfo;
                assert(ds.name === name1);
                assert(ds.kind === kind);
            }).then(() =>
                splunkCloud.catalog.createDataset(
                    {
                        kind: 'import',
                        name: name1,
                        module: module2,
                        sourceName: name1,
                        sourceModule: module1
                    }).then(res => {
                        const ds = res as DatasetInfo;
                        assert(ds.name === name1);
                        assert(ds.module === module2);
                        assert(ds.module !== module1);
                        assert(ds.kind === kind);
                    }))
                .then(() => {
                    // TODO: verify deletion
                    splunkCloud.catalog.deleteDataset(name1);
                    splunkCloud.catalog.deleteDataset(name2);
                });
        });

        it('should allow delete of datasets by name', () => {
            const name = 'foobar1';
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

    describe('dataset fields', () => {
        const integrationTestField1 = 'integ_test_field1';
        const integrationTestField2 = 'integ_test_field2';
        let found = false;
        it('should create a test dataset, its fields, list its fields and delete the test dataset', () => {
            return splunkCloud.catalog.createDataset({
                name: 'integ_dataset_1000',
                kind: 'lookup',
                capabilities: '1101-00000:11010',
                externalKind: 'kvcollection',
                externalName: 'test_externalName'
            }).then(resultDataset => splunkCloud.catalog.postDatasetField(resultDataset.id, {
                name: integrationTestField1,
                dataType: DataType.STRING,
                fieldType: FieldType.DIMENSION,
                prevalence: Prevalence.ALL
            }).then(res => {
                const resultDatasetField1 = res as Field;
                splunkCloud.catalog.getDatasetField(resultDataset.id, resultDatasetField1.id as string).then((getResultDatasetField) => {
                    assert(getResultDatasetField.name, integrationTestField1);
                });

                splunkCloud.catalog.getField(resultDatasetField1.id as string)
                    .then(field => {
                        assert(resultDatasetField1.name, field.name);
                    });

                splunkCloud.catalog.getFields()
                    .then(fields => {
                        found = false;
                        fields.forEach(
                            a => {
                                if (a.name === resultDatasetField1.name) {
                                    found = true;
                                }
                            }
                        );
                        assert(found);

                    });
            }).then(() => splunkCloud.catalog.postDatasetField(resultDataset.id, {
                name: integrationTestField2,
                dataType: DataType.STRING,
                fieldType: FieldType.DIMENSION,
                prevalence: Prevalence.ALL
            })).then((res) => {
                const resultDatasetField2 = res as Field;
                return splunkCloud.catalog.getDatasetField(resultDataset.id, resultDatasetField2.id as string).then((getResultDatasetField) => {
                    assert(getResultDatasetField.name, integrationTestField2);
                }).then(() => splunkCloud.catalog.getDatasetFields(resultDataset.id).then((resultDatasetFields) => {
                    assert(resultDatasetFields.length === 2);
                })).then(() => splunkCloud.catalog.getDatasetFields(resultDataset.id, 'name=="integ_test_field2"').then((resultDatasetFields) => {
                    assert(resultDatasetFields.length === 1);
                    assert(resultDatasetFields[0].name === integrationTestField2);
                })).then(() => splunkCloud.catalog.patchDatasetField(resultDataset.id, resultDatasetField2.id as string, { 'name': 'integ_test_field3' }).then((patchResultDatasetField) => {
                    assert(patchResultDatasetField.name === 'integ_test_field3');
                })).then(() => splunkCloud.catalog.deleteDatasetField(resultDataset.id, resultDatasetField2.id as string).then((response) => {
                    assert(!response);
                }));
            }).then(() => splunkCloud.catalog.deleteDataset(resultDataset.id)));
        });
    }).timeout(10000);

    describe('rule actions', () => {
        const fieldName = 'action_test_field1';
        const ruleName = 'action_test_rule';
        const ruleModule = 'catalog';
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
                    dataType: DataType.STRING,
                    fieldType: FieldType.DIMENSION,
                    prevalence: Prevalence.ALL
                });
            }).then(() => {
                return splunkCloud.catalog.createRule({
                    name: ruleName,
                    module: ruleModule,
                    match: ruleMatch
                }).then((rule) => {
                    ruleId = rule.id;

                });
            });
        });

        after(() => {
            return splunkCloud.catalog.deleteDataset(datasetName).then(
                () => {
                    console.log('finish delete dataset');
                }
            ).then(() => {
                return splunkCloud.catalog.deleteRule(`${ruleModule}.${ruleName}`).then(
                    () => {
                        console.log('finish delete rule');
                    });
            });
        });

        it('1t should create ALIAS rule actions', () => {
            return splunkCloud.catalog.createRuleAction(
                ruleId, {
                    alias: 'newalias', 'kind': 'ALIAS', field: fieldName
                }).then(res => {
                    const act = res as AliasAction;
                    assert.equal(act.field, fieldName);
                    return splunkCloud.catalog.getRuleAction(ruleId, act.id as string);
                }).then(res => {
                    const act = res as AliasAction;
                    return splunkCloud.catalog.deleteRuleAction(ruleId, act.id as string);
                });
        });

        it('1t should create REGEX rule actions', () => {
            const regex: RegexAction = {
                pattern: 'mypattern', 'kind': 'REGEX', field: fieldName
            };
            return splunkCloud.catalog.createRuleAction(
                ruleId, regex).then(res => {
                    const act = res as RegexAction;
                    assert(act.pattern, regex.pattern);
                });
        });


        it('1t should create EVAL rule actions', () => {
            const evalAction: EvalAction = {
                expression: 'myexpr', 'kind': 'EVAL', field: fieldName
            };
            return splunkCloud.catalog.createRuleAction(
                ruleId, evalAction).then(res => {
                    const act = res as EvalAction;
                    assert(act.expression, evalAction.expression);
                });
        });

        it('1t should create AUTOKV rule actions', () => {
            const autokvAction: AutoKVAction = {
                mode: 'mymode', 'kind': 'AUTOKV'
            };
            return splunkCloud.catalog.createRuleAction(
                ruleId, autokvAction).then(res => {
                    const act = res as AutoKVAction;
                    assert(act.mode, autokvAction.mode);
                });
        });

        it('1t should create LOOKUP rule actions', () => {
            const lookup: LookupAction = {
                expression: 'lookupexpr', kind: 'LOOKUP'
            };
            return splunkCloud.catalog.createRuleAction(
                ruleId, lookup).then(res => {
                    const act = res as LookupAction;
                    assert(act.expression, 'lookupexpr');
                }).then(() => {
                    return splunkCloud.catalog.getRuleActions(ruleId);
                }).then((res) => {
                    const acts = res as LookupAction[];
                    assert.equal(acts.length, 4);
                });

        });
    }).timeout(1000);
});

export function createIndexDataset(collection: string): Promise<object | void> {
    // Gets the datasets
    return (
        splunkCloud.catalog
            .getDatasets()
            // Filters the data set
            .then(datasets => {
                return datasets.filter(element => {
                    if (element.name === collection) {
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
                    kind: 'index',
                    capabilities: '1101-00000:11010',
                    disabled: false
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

export function createKVCollectionDataset(namespace: string, collection: string): Promise<object | void> {
    // Gets the datasets
    return (
        splunkCloud.catalog
            .getDatasets()
            // Filters the data set
            .then(datasets => {
                return datasets.filter(element => {
                    if (element.module === namespace && element.name === collection) {
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
                    kind: 'kvcollection',
                    capabilities: '1101-00000:11010',
                    module: namespace
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

export function deleteAllDatasets(): Promise<any> {
    // Gets the datasets
    return splunkCloud.catalog
        .getDatasets()
        // Deletes the dataset there should only be one dataset
        .then(datasets => {
            return Promise.all(
                datasets.map(dataset => {
                    // Delete the dataset unless it's a main/metrics or createdby Splunk
                    if (dataset.name !== 'main' && dataset.name !== 'metrics' && dataset.createdBy !== 'Splunk') {
                        return splunkCloud.catalog.deleteDataset(dataset.id);
                    }
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
        });
}

export function createRecord(collection: string, record: object): Promise<object> {
    return splunkCloud.kvstore
        .insertRecord(collection, record as Map<string, string>)
        .then(response => {
            assert.notEqual(response._key, null);
            assert.typeOf(response._key, 'string');
            return response;
        })
        .catch(error => {
            throw error;
        });
}

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

