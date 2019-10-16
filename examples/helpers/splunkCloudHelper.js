/**
 * Copyright 2019 Splunk, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"): you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

const MILLISECONDS_IN_SECOND = 1000;
const SECONDS_5 = 5;
const SECONDS_30 = 30;
const SECONDS_90 = 90;

/**
 * Returns successfully once the pipeline has been activated, else the process will exit with status code 1.
 *
 * @param client instance of an SDK client
 * @param id The ID of the pipeline to activate
 * @param {number} wait Time delay between searches in milliseconds. Defaults to 30000 milliseconds.
 * @return {Promise<void>}
 */
async function activatePipeline(client, id, wait = SECONDS_30 * MILLISECONDS_IN_SECOND) {
    console.log(`Activating pipeline. id=${id}`);
    await client.streams.activatePipeline(id, { activateLatestVersion: true }).catch(err => {
        throw new Error(`Unable to activate pipeline. Error:\n${err}`);
    })

    console.log(`Waiting ${wait}ms for pipeline to activate.`)
    await new Promise(resolve => setTimeout(resolve, wait));
}

/**
 * Creates a new index using the catalog service.
 *
 * @param client instance of an SDK client
 * @param indexName Name of the index to create
 * @return {Promise<string>}
 */
async function createIndex(client, indexName) {
    // Don't re-create the main index
    if (indexName === 'main') {
        return indexName;
    }

    console.log(`Creating dataset. name=${indexName}`);
    const dataset = await client.catalog.createDataset({
        name: indexName,
        kind: 'index',
        module: '',
        disabled: false
    }).catch(err => {
        throw new Error(`Unexpected error while creating index. Error:\n${err}`);
    });

    return dataset.name;
}

/**
 * Creates a new pipeline for ingesting events using the streams service.
 *
 * @param client instance of an SDK client
 * @param tenant the tenant ID to configure this pipeline for
 * @param pipelineName name of the pipeline to create
 * @param indexName name of the index to target for this pipeline
 * @return {Promise<string>} name of the newly created pipeline
 */
async function createPipeline(client, tenant, pipelineName, indexName) {
    const dslRequest = {
        dsl: `events = read-splunk-firehose(); write-index(events, literal(""), literal("${indexName}"));`,
    };

    console.log(`Creating pipeline. name=${pipelineName}`);
    try {
        const uplPipeline = await client.streams.compileDSL(dslRequest);
        const pipelineRequest = {
            name: pipelineName,
            createUserId: tenant,
            data: uplPipeline,
            description: `Basic pipeline for ingesting events to the ${indexName} index`,
        };
        const createdPipeline = await client.streams.createPipeline(pipelineRequest);

        return createdPipeline.id;
    } catch(err) {
        throw new Error(`Unexpected error while creating a pipeline. Error:\n${err}`);
    }
}

/**
 * Deactivates and deletes a pipeline.  Deletes a dataset specified by the given indexId.  'main' index will not be deleted.
 * @param client SplunkCloud client.
 * @param pipelineId Pipeline Id.
 * @param indexId Index Id.
 */
async function cleanupPipeline(client, pipelineId, indexId) {
    try {
        if (pipelineId) {
            console.log(`Deactivating and deleting pipeline. id=${pipelineId}`);
            await client.streams.deactivatePipeline(pipelineId, {});
            await client.streams.deletePipeline(pipelineId);
        }
        // Don't delete the main index
        if (indexId && indexId !== 'main') {
            console.log(`Deleting dataset. id=${indexId}`);
            await client.catalog.deleteDatasetById(indexId);
        }
    } catch(err) {
        throw new Error(`Failed to clean up the pipeline. Error:\n${err}`);
    }
}
/**
 * Executes a search on a given Splunk Cloud instance allowing for retries.
 * This function will retry a search with a give delay until satisfying the conditions of the validator callback
 * or reaching the timeout value.
 *
 * @param {SplunkCloud} client SplunkCloud client.
 * @param {string} query Query string.
 * @param {function} validator Validator callback.
 * @param {number} delay Time delay between searches in milliseconds. Defaults to 5000 milliseconds.
 * @param {number} timeout Total timeout for searches to be repeated in milliseconds. Defaults to 90000 milliseconds.
 */
async function searchResultsWithRetryTimeout(client, query, validator, delay = SECONDS_5 * MILLISECONDS_IN_SECOND, timeout = SECONDS_90 * MILLISECONDS_IN_SECOND) {
    const start = Date.now();
    let attempts = 0;
    console.log(`query='${query}'`);
    while (Date.now() - start < timeout) {
        console.log(`Waiting ${delay}ms before attempting search... Attempt: ${++attempts}`);
        await new Promise(resolve => setTimeout(resolve, delay));

        const job = await client.search.createJob({ query: query });
        console.log(`Job created. sid='${job.sid}'`);
        await client.search.waitForJob(job);
        const listResults = await client.search.listResults(job.sid);
        if (!listResults || !listResults.results) {
            console.warn('listResults response is invalid.');
        }

        console.log(`Found ${listResults.results.length} event(s) for query.`);
        if (validator(listResults.results)) {
            return listResults.results;
        }
    }

    throw new Error('Failed to find the expected set of results in search.');
}

// Export these functions to be usable in other examples
module.exports = {
    activatePipeline,
    cleanupPipeline,
    createIndex,
    createPipeline,
    searchResultsWithRetryTimeout
};
