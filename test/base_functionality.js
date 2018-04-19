const config = require("./config");
const { SSCProxy } = require("../client");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const expect = chai.expect;

describe("Basic client functionality", function() {
    var s = new SSCProxy(`http://${config.host}:8882`, config.authToken, 'TEST_TENANT');
    describe("GET", function() {
        it("should return a promise", function() {
            let promise = s.get("/basic");
            expect(promise).to.be.a("promise");
            return promise.then(function(data) {
                expect(data).to.haveOwnProperty("foo");
            });
        });
    });

    describe("POST", function() {
        it("should return a promise", function() {
            let promise = s.post("/basic", {robin: "hood"});
            expect(promise).to.be.a("promise");
            return promise.then(function(data) {
                expect(data).to.haveOwnProperty("friar", "tuck");
            });
        })
    });

    describe("PUT", function() {
        it("should return a promise", function() {
            let promise = s.put("/basic", {walrus: "carpenter"});
            expect(promise).to.be.a("promise");
            return promise.then(function(data) {
                expect(data).to.haveOwnProperty("oysters", "sad");
            });
        })
    });

    describe("DELETE", function() {
        it("should return a promise", function() {
            let promise = s.delete("/basic");
            expect(promise).to.be.a("promise");
            return promise;
        })
    });

    describe("Errors", function() {
        it("should throw on an error response", function() {
            return expect(s.get("/error")).to.be.rejectedWith(Error, "Something exploded");
        });
    });

});
