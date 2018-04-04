// let client = require("../dist/splunk");
// let expect = require("chai").expect;

// describe("Using Search APIs", function() {
//     it("should allow sync searching", function() {
//         let splunk = new client.Splunk('https://api-beta.splunknovadev.com/',
//             'irXiqgjEYTvJmbqw9P29uwcQ3JSQT9OL',
//             'Ia2ry3ar13HLWpGJjzR1aZcqoguTbo-5pZlDtyX_AphHZiwcL3f7fIexH1y6nq2D');
//         return splunk.search.createJobSync({query: "search index=*"}).then(function(data) {
//             console.log(data);
//         });
//     });
// });