require('isomorphic-fetch');
const config = require("./config");
const { ServiceClient } = require("../client");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const expect = chai.expect;

describe("Basic client functionality", () => {
    const s = new ServiceClient(`http://${config.host}:8882`, config.authToken, 'TEST_TENANT');
    describe("GET", () => {
        it("should return a promise", () => {
            const promise = s.get("/basic");
            expect(promise).to.be.a("promise");
            return promise.then((data) => {
                expect(data).to.haveOwnProperty("foo");
            });
        });
    });

    describe("POST", () => {
        it("should return a promise", () => {
            const promise = s.post("/basic", {robin: "hood"});
            expect(promise).to.be.a("promise");
            return promise.then((data) => {
                expect(data).to.haveOwnProperty("friar", "tuck");
            });
        })
    });

    describe("PUT", () => {
        it("should return a promise", () => {
            const promise = s.put("/basic", {walrus: "carpenter"});
            expect(promise).to.be.a("promise");
            return promise.then((data) => {
                expect(data).to.haveOwnProperty("oysters", "sad");
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
        it("should throw on an error response", () => expect(s.get("/error")).to.be.rejectedWith(Error, "Something exploded"));
    });

    describe("Path building", () => {
        it("Catch empty path elements", () => {
            let failed = false;
            try {
                s.buildPath('/PREFIX', ['foo', ' '], "TENANT");
                failed = true;
            } catch (err) {
                expect(err).to.have.property('message').that.matches(/\/api\/TENANT\/PREFIX\/foo\/ /);
            }
            if (failed) {
                expect.fail('Should have thrown an error');
            }
        });
    });

});
