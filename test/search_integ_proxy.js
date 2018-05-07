const SplunkSSC = require("../splunk");
const { expect } = require("chai");
const { isGuid } = require("is-guid");

const token = process.env.BEARER_TOKEN;
const tenantID = process.env.TENANT_ID;

const host = "https://next.splunknovadev-playground.com:443";

describe("integration Using Search APIs", () => {
    const splk = new SplunkSSC(host, token, tenantID);

    describe("Submit a search", () => {
        it("should allow submission of a search", () => {
            const response = splk.search.createJobSync({query: "search index=_internal"});
            return response.then((json) => {
                expect(json).to.have.property("searchId");
                expect(isGuid(json.searchId));
            });
        });
    });
});
