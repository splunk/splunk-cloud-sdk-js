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
        url: stubbyUrl,
        tokenSource: () => config.stubbyAuthToken,
        defaultTenant: config.stubbyTenant
    });
    describe("GET", () => {
        it("should return a promise", () => {
            const promise = s.get("/basic");
            expect(promise).to.be.a("promise");
            return promise.then((data) => data.body).then(body => {
                expect(body).to.haveOwnProperty("foo");
            });
        });
    });

    describe("POST", () => {
        it("should return a promise", () => {
            const promise = s.post("/basic", { robin: "hood" });
            expect(promise).to.be.a("promise");
            return promise.then((data) => data.body).then(body => {
                expect(body).to.haveOwnProperty("friar", "tuck");
            });
        })
    });

    describe("PUT", () => {
        it("should return a promise", () => {
            const promise = s.put("/basic", { walrus: "carpenter" });
            expect(promise).to.be.a("promise");
            return promise.then((data) => data.body).then(body => {
                expect(body).to.haveOwnProperty("oysters", "sad");
            });
        })
    });

    describe("DELETE", () => {
        it("should return a promise", () => {
            const promise = s.delete("/basic");
            expect(promise).to.be.a("promise");
            return promise;
        })
    });

    describe("Errors", () => {
        it("should throw on an error response", () => expect(s.get("/error")).to.be.rejectedWith(Error, "error response"));
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
            return s.get("/basic")
                .then(httpResponse => {
                    expect(httpResponse.body).to.have.own.property("foo");
                    expect(extractedUrl).matches(/\/basic$/);
                });
        });

        it("should allow multiple callbacks that don't change response", () => {
            for (let i = 0; i < 5; i++) {
                s.addResponseHook(() => { });
            }
            return s.get("/basic")
                .then(httpResponse => {
                    expect(httpResponse.body).to.have.own.property("foo");
                });
        });

        it("should allow changing of a response inflight", () => {
            s.addResponseHook(response => {
                if (!response.ok) {
                    return s.fetch("GET", "/basic", {});
                }
            }); // Totally different URL
            return s.get("/something_that_does_not_exist")
                .then(httpResponse => {
                    expect(httpResponse.body).to.have.own.property("foo");
                });
        });

        it("should handle exceptions", () => {
            s.addResponseHook(response => {
                throw new Error("unexpected error");
            });
            return s.get("/basic")
                .then(httpResponse => {
                    expect(httpResponse.body).to.have.own.property("foo");
                });

        })
    });

});

describe("Service client args", () => {
    it("should take a url, a token, and a tenant", () => {
        const s = new ServiceClient({
            url: stubbyUrl,
            tokenSource: () => config.stubbyAuthToken,
            defaultTenant: config.stubbyTenant
        });
        expect(s.buildPath('/prefix', ['path'])).to.equal(`/${config.stubbyTenant}/prefix/path`);
        return s.get("/basic")
            .then(response => {
                expect(response.body).to.have.own.property("foo");
            });
    });

    it("should take an args object", () => {
        const s = new ServiceClient({
            url: stubbyUrl,
            tokenSource: config.stubbyAuthToken,
            defaultTenant: config.stubbyTenant
        });
        expect(s.buildPath('/prefix', ['path'])).to.equal(`/${config.stubbyTenant}/prefix/path`);
        return s.get("/basic")
            .then(response => {
                expect(response.body).to.have.own.property("foo");
            });
    });

    it("should take a function that returns a token", () => {
        const s = new ServiceClient({
            url: stubbyUrl,
            tokenSource: () => config.stubbyAuthToken,
            defaultTenant: config.stubbyTenant
        });
        expect(s.buildPath('/prefix', ['path'])).to.equal(`/${config.stubbyTenant}/prefix/path`);
        return s.get("/basic")
            .then(response => {
                expect(response.body).to.have.own.property("foo");
            });

    });

    it("should take a token manager (like splunk-cloud-auth)", () => {
        const authObj = {
            getAccessToken: () => config.stubbyAuthToken
        };

        const s = new ServiceClient({
            url: stubbyUrl,
            tokenSource: authObj,
            defaultTenant: config.stubbyTenant
        });
        expect(s.buildPath('/prefix', ['path'])).to.equal(`/${config.stubbyTenant}/prefix/path`);
        return s.get("/basic")
            .then(response => {
                expect(response.body).to.have.own.property('foo');
            });
    });

    it("should use a default URL", () => {
        const s = new ServiceClient({
            tokenSource: config.stubbyAuthToken,
            defaultTenant: config.stubbyTenant
        });

        expect(s.buildUrl(s.buildPath('/foo', ['bar']))).to.equal(`https://api.splunkbeta.com/${config.stubbyTenant}/foo/bar`);
    });
})
