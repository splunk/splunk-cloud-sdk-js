let client = require("../dist/splunk");
let chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

let expect = chai.expect;

describe("Basic client functionality", function() {
    var s = new client.Splunk("http://localhost:8882", "admin", "changeme");

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
