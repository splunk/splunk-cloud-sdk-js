// Helper functions

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Creates a search job and fetches search results
async function searchResults(splunk, start, timeout, query, expected) {

    if (Date.now() - start > timeout) {
        console.log(`TIMEOUT!!!! Search is taking more than ${timeout}ms. Terminate!`);
        return false;
    }

    // sleep 5 seconds before to retry the search
    await sleep(5000);

    return splunk.search.createJob({ "query": query })
        .then(job => {
            console.log(`Created sid: ${job.sid}`);
            return splunk.search.waitForJob(job.sid);
        })
        .then(searchObj => {
            console.log(`Done waiting for job, calling getResults on ${searchObj.sid} ...`)
            return splunk.search.getResults(searchObj.sid);
        })
        .then(resultResponse => {
            const retNum = resultResponse.results.length;
            console.log(`got ${retNum} results`);
            if (retNum < expected) {
                return searchResults(splunk, start, timeout, query, expected);
            } else if (retNum > expected) {
                console.log(retNum);
                console.log(`find more events than expected for query ${query}`);
                return resultResponse.results;
            }
            console.log(`Successfully found ${retNum} event for query ${query}, total spent ${Date.now() - start}ms`);
            return resultResponse.results;
        })
        .catch(err => {
            console.log(err);
            return [];
        });
};

module.exports = {
    sleep: sleep,
    searchResults: searchResults,
};
