import { assert } from 'chai';
import 'mocha';
import { appRegistryModels } from '../../app-registry';
import { SplunkError } from '../../client';
import { SplunkCloud } from '../../splunk';
import config from '../config';

function date() {
    return Date.now();
}

function rand() {
    return Math.floor(Math.random() * Math.floor(1000));
}

function appName() {
    return `jssdk.app${date()}`;
}
function appTitle() {
    return `js-title-${date()}`;
}

const tenantID = config.stagingTenant;
const splunk = new SplunkCloud({
    urls: {
        api: config.stagingApiHost,
        app: config.stagingAppsHost,
    },
    tokenSource: config.stagingAuthToken,
    defaultTenant: tenantID,
});

describe('integration tests for app registry Endpoints', () => {
    describe('CRUD app', () => {
        const createApp = {
            name: appName(),
            kind: appRegistryModels.AppResourceKind.Web,
            title: appTitle(),
            redirectUrls: [
                'https://localhost'
            ]
        } as appRegistryModels.CreateAppRequest;

        const updateApp = {
            description: 'new description',
            title: `new${appTitle()}${rand()}`,
            redirectUrls: [
                'https://newlocalhost'
            ]
        } as appRegistryModels.UpdateAppRequest;

        it('should create app', () => {
            return splunk.appreg.createApp(createApp)
                .then((app) => {
                    assert.equal(createApp.kind.toString(), app.kind.toString());
                    assert.equal(createApp.name, app.name);
                    assert.equal(createApp.title, app.title);
                    assert.sameMembers(createApp.redirectUrls as string[], app.redirectUrls as string[]);
                });
        });
        it('should list apps', () => {
            return splunk.appreg.listApps()
                .then((apps) => {
                    assert.isArray(apps);
                    assert.isNotEmpty(apps);

                    let found = false;
                    for (const a of apps) {
                        if (a.name === createApp.name) {
                            found = true;
                            break;
                        }
                    }

                    assert.ok(found, `did not find newly created app="${createApp.name}" when listing apps`);
                });
        });
        it('should get app', () => {
            return splunk.appreg.getApp(createApp.name)
                .then((app) => {
                    assert.equal(createApp.kind.toString(), app.kind.toString());
                    assert.equal(createApp.name, app.name);
                    assert.equal(createApp.title, app.title);
                    assert.sameMembers(createApp.redirectUrls as string[], app.redirectUrls as string[]);
                });
        });
        it('should update app', () => {
            return splunk.appreg.updateApp(createApp.name, updateApp)
                .then((app) => {
                    assert.equal(createApp.kind.toString(), app.kind.toString());
                    assert.equal(createApp.name, app.name);
                    assert.equal(updateApp.title, app.title);
                    assert.equal(updateApp.description, app.description);
                    assert.sameMembers(updateApp.redirectUrls as string[], app.redirectUrls as string[]);
                });
        });
        it('should delete app', () => {
            return splunk.appreg.deleteApp(createApp.name)
                .then((response) => {
                    assert.isEmpty(response);
                });
        });
    });

    describe('app secret', () => {
        const createApp = {
            name: appName(),
            kind: appRegistryModels.AppResourceKind.Web,
            title: `${appTitle()}z`,
            redirectUrls: [
                'https://localhost'
            ]
        } as appRegistryModels.CreateAppRequest;

        let oldSecret: string = '';

        it('should create test app', () => {
            return splunk.appreg.createApp(createApp)
                .then((app) => {
                    assert.equal(createApp.kind.toString(), app.kind.toString());
                    assert.equal(createApp.name, app.name);
                    assert.equal(createApp.title, app.title);
                    assert.sameMembers(createApp.redirectUrls as string[], app.redirectUrls as string[]);
                    oldSecret = app.clientSecret as string;
                });
        });
        it('should rotate app secret', () => {
            assert.notEqual(oldSecret, '');

            return splunk.appreg.rotateSecret(createApp.name)
                .then((app) => {
                    assert.notEqual(app.clientSecret, oldSecret);
                });
        });
        it('should delete app', () => {
            return splunk.appreg.deleteApp(createApp.name)
                .then((response) => {
                    assert.isEmpty(response);
                });
        });
    });

    describe('CRUD subscriptions', () => {
        const createApp = {
            name: `${appName()}t`,
            kind: appRegistryModels.AppResourceKind.Native,
            title: `${appTitle()}x`,
            redirectUrls: [
                'https://localhost'
            ]
        } as appRegistryModels.CreateAppRequest;

        const createApp2 = {
            name: `${appName()}s`,
            kind: appRegistryModels.AppResourceKind.Service,
            title: appTitle(),
            redirectUrls: [
                'https://localhost'
            ],
            appPrincipalPermissions: [
                '*:action.*'
            ],
            userPermissionsFilter: [
                '*:*.*'
            ]
        } as appRegistryModels.CreateAppRequest;

        it('should create test app', () => {
            return splunk.appreg.createApp(createApp)
                .then((app) => {
                    assert.equal(createApp.kind.toString(), app.kind.toString());
                    assert.equal(createApp.name, app.name);
                    assert.equal(createApp.title, app.title);
                    assert.sameMembers(createApp.redirectUrls as string[], app.redirectUrls as string[]);
                });
        });
        it('should create a subscription', () => {
            return splunk.appreg.createSubscription({ appName: createApp.name })
                .then((response: object) => {
                    assert.isEmpty(response);
                });
        });
        it('should list subscriptions', () => {
            return splunk.appreg.listSubscriptions()
                .then((subscriptions: appRegistryModels.Subscription[]) => {
                    assert.isAtLeast(subscriptions.length, 1);
                });
        });
        it('should get a subscription by app name', () => {
            return splunk.appreg.getSubscription(createApp.name)
                .then((subscription: appRegistryModels.Subscription) => {
                    assert.equal(subscription.appName, createApp.name);
                });
        });
        it('should 404 trying to get a subscription for non-existent app', () => {
            return splunk.appreg.getSubscription('doesnotexist').catch((err) => {
                assert.ok(err);
                assert.equal(err.httpStatusCode, 404);
            });
        });
        it('should create second test app', () => {
            return splunk.appreg.createApp(createApp2)
                .then((app) => {
                    assert.equal(createApp2.kind.toString(), app.kind.toString());
                    assert.equal(createApp2.name, app.name);
                    assert.equal(createApp2.title, app.title);
                    assert.sameMembers(createApp2.redirectUrls as string[], app.redirectUrls as string[]);
                });
        });
        it('should create a subscription to second test app', () => {
            return splunk.appreg.createSubscription({ appName: createApp2.name })
                .then((response: object) => {
                    assert.isEmpty(response);
                });
        });
        it('should list subscriptions, and have both', () => {
            return splunk.appreg.listSubscriptions()
                .then((subscriptions: appRegistryModels.Subscription[]) => {
                    assert.isAtLeast(subscriptions.length, 2);
                    let foundFirst = false;
                    let foundSecond = false;
                    for (const sub of subscriptions) {
                        if (foundFirst || sub.appName === createApp.name) {
                            foundFirst = true;
                        }
                        if (foundSecond || sub.appName === createApp2.name) {
                            foundSecond = true;
                        }
                        if (foundSecond && foundFirst) {
                            break;
                        }
                    }

                    assert.ok(foundFirst);
                    assert.ok(foundSecond);
                });
        });
        it('should delete subscriptions and apps', () => {
            return splunk.appreg.deleteSubscription(createApp2.name)
                .then(() => {
                    return splunk.appreg.deleteSubscription(createApp.name);
                })
                .then(() => {
                    return splunk.appreg.deleteApp(createApp2.name);
                })
                .then(() => {
                    return splunk.appreg.deleteApp(createApp.name);
                });
        });
    });
});
