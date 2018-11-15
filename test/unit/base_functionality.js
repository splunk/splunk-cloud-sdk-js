
require('isomorphic-fetch');
const config = require("../config");
const { ServiceClient } = require("../../client");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const stubbyUrl = `http://${config.stubbyHost}:8882`

chai.use(chaiAsPromised);

const { expect } = chai;

describe("Basic client functionality", () => {
    const s = new ServiceClient({
        urls: {'api': stubbyUrl},
        tokenSource: () => config.stubbyAuthToken,
        defaultTenant: config.stubbyTenant
    });
    describe("GET", () => {
        it("should return a promise", () => {
            const promise = s.get('api', "/basic");
            expect(promise).to.be.a("promise");
            return promise.then((data) => data.body).then(body => {
                expect(body).to.haveOwnProperty("foo");
            });
        });
    });

    describe("POST", () => {
        it("should return a promise", () => {
            const promise = s.post('api', "/basic", { robin: "hood" });
            expect(promise).to.be.a("promise");
            return promise.then((data) => data.body).then(body => {
                expect(body).to.haveOwnProperty("friar", "tuck");
            });
        })
    });

    describe("PUT", () => {
        it("should return a promise", () => {
            const promise = s.put('api', "/basic", { walrus: "carpenter" });
            expect(promise).to.be.a("promise");
            return promise.then((data) => data.body).then(body => {
                expect(body).to.haveOwnProperty("oysters", "sad");
            });
        })
    });

    describe("DELETE", () => {
        it("should return a promise", () => {
            const promise = s.delete('api', "/basic");
            expect(promise).to.be.a("promise");
            return promise;
        })
    });

    describe("Errors", () => {
        it("should throw on an error response", () => expect(s.get('api', "/error")).to.be.rejectedWith(Error, "error response"));
    });

    describe("Path building", () => {
        it("Catch empty path elements", () => {
            let failed = false;
            try {
                s.buildPath('/PREFIX', ['foo', ' '], "TENANT");
                failed = true;
            } catch (err) {
                expect(err).to.have.property('message').that.matches(/\/TENANT\/PREFIX\/foo\/ /);
            }
            if (failed) {
                expect.fail('Should have thrown an error');
            }
        });
    });

    describe("Middleware", () => {
        afterEach(() => s.clearResponseHooks());

        it("should allow a callback to execute without affecting flow", () => {
            let extractedUrl = null;
            s.addResponseHook((response) => extractedUrl = response.url);
            return s.get('api', "/basic")
                .then(httpResponse => {
                    expect(httpResponse.body).to.have.own.property("foo");
                    expect(extractedUrl).matches(/\/basic$/);
                });
        });

        it("should allow multiple callbacks that don't change response", () => {
            for (let i = 0; i < 5; i++) {
                s.addResponseHook(() => { });
            }
            return s.get('api', "/basic")
                .then(httpResponse => {
                    expect(httpResponse.body).to.have.own.property("foo");
                });
        });

        it("should allow changing of a response inflight", () => {
            s.addResponseHook(response => {
                if (!response.ok) {
                    return s.fetch("GET", 'api', "/basic", {});
                }
            }); // Totally different URL
            return s.get('api', "/something_that_does_not_exist")
                .then(httpResponse => {
                    expect(httpResponse.body).to.have.own.property("foo");
                });
        });

        it("should handle exceptions", () => {
            s.addResponseHook(response => {
                throw new Error("unexpected error");
            });
            return s.get('api', "/basic")
                .then(httpResponse => {
                    expect(httpResponse.body).to.have.own.property("foo");
                });

        })
    });

});

describe("Service client args", () => {
    it("should take a url, a token, and a tenant", () => {
        const s = new ServiceClient({
            urls: {'api': stubbyUrl},
            tokenSource: () => config.stubbyAuthToken,
            defaultTenant: config.stubbyTenant
        });
        expect(s.buildPath('/prefix', ['path'])).to.equal(`/${config.stubbyTenant}/prefix/path`);
        return s.get('api', "/basic")
            .then(response => {
                expect(response.body).to.have.own.property("foo");
            });
    });

    it("should take an args object", () => {
        const s = new ServiceClient({
            urls: {'api': stubbyUrl},
            tokenSource: config.stubbyAuthToken,
            defaultTenant: config.stubbyTenant
        });
        expect(s.buildPath('/prefix', ['path'])).to.equal(`/${config.stubbyTenant}/prefix/path`);
        return s.get('api', "/basic")
            .then(response => {
                expect(response.body).to.have.own.property("foo");
            });
    });

    it("should take a function that returns a token", () => {
        const s = new ServiceClient({
            urls: {'api': stubbyUrl},
            tokenSource: () => config.stubbyAuthToken,
            defaultTenant: config.stubbyTenant
        });
        expect(s.buildPath('/prefix', ['path'])).to.equal(`/${config.stubbyTenant}/prefix/path`);
        return s.get('api', "/basic")
            .then(response => {
                expect(response.body).to.have.own.property("foo");
            });

    });

    it("should take a token manager (like splunk-cloud-auth)", () => {
        const authObj = {
            getAccessToken: () => config.stubbyAuthToken
        };

        const s = new ServiceClient({
            urls: {'api': stubbyUrl},
            tokenSource: authObj,
            defaultTenant: config.stubbyTenant
        });
        expect(s.buildPath('/prefix', ['path'])).to.equal(`/${config.stubbyTenant}/prefix/path`);
        return s.get('api', "/basic")
            .then(response => {
                expect(response.body).to.have.own.property('foo');
            });
    });

    it("should use a default URL", () => {
        const s = new ServiceClient({
            tokenSource: config.stubbyAuthToken,
            defaultTenant: config.stubbyTenant
        });

        expect(s.buildUrl('api', s.buildPath('/foo', ['bar']))).to.equal(`https://api.splunkbeta.com/${config.stubbyTenant}/foo/bar`);
    });
})

describe("Service client with a url string instead of args object", () => {
    const s = new ServiceClient(
        stubbyUrl,
        config.stubbyAuthToken,
        config.stubbyTenant
    );
    describe("GET", () => {
        it("should return a promise when service client is created with a url string instead of args object", () => {
            expect(s.buildUrl('api', s.buildPath('', ['basic']))).to.equal(`http://${config.stubbyHost}:8882/${config.stubbyTenant}/basic`);
            const promise = s.get('api', "/basic");
            expect(promise).to.be.a("promise");
            return promise.then((data) => data.body).then(body => {
                expect(body).to.haveOwnProperty("foo");
            });
        });
    });
})

describe("Service client with a ServiceClientArgs object initialized with a url string", () => {
    const s = new ServiceClient({
        'url': stubbyUrl,
        'tokenSource': config.stubbyAuthToken,
        'defaultTenant': config.stubbyTenant
    });
    describe("GET", () => {
        it("should return a promise when service client is created with a ServiceClientArgs object initialized with a url string", () => {
            expect(s.buildUrl('api', s.buildPath('', ['basic']))).to.equal(`http://${config.stubbyHost}:8882/${config.stubbyTenant}/basic`);
            const promise = s.get('api', "/basic");
            expect(promise).to.be.a("promise");
            return promise.then((data) => data.body).then(body => {
                expect(body).to.haveOwnProperty("foo");
            });
        });
    });
})
