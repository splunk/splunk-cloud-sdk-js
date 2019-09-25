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

const sleep = require('sleep-promise');

require('isomorphic-fetch');
const { SplunkCloud } = require('../splunk');


// ***** TITLE: Tenant setup functions
//
// ***** DESCRIPTION: This example shows how to begin using Splunk Cloud Platform
//                    by setting up a new tenant for ingest & search.
async function main() {
    const { SPLUNK_CLOUD_API_HOST, SPLUNK_CLOUD_APPS_HOST, BEARER_TOKEN, TENANT_ID } = process.env;

    const splunk = new SplunkCloud({
        urls: { api: SPLUNK_CLOUD_API_HOST, app: SPLUNK_CLOUD_APPS_HOST },
        tokenSource: BEARER_TOKEN,
        defaultTenant: TENANT_ID,
    });

    const indexName = `index${Date.now()}`;
    await createIndex(splunk, indexName);
    const pipelineName = `pipeline${Date.now()}`;
    const pipelineId = await createPipeline(splunk, TENANT_ID, pipelineName, indexName);
    await activatePipeline(splunk, pipelineId);

    // Only cleanup in CI
    if (process.env.CI) {
        await cleanup(splunk, pipelineId, indexName);
    }
}
// Only run this file as an example if invoked directly (intended for testing purposes)
if (require.main === module) {
    main();
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
    try {
        const dataset = await client.catalog.createDataset({name: indexName, kind: 'index', module: '', disabled: false});
        console.log('Waiting for 90s for index to be provisioned...');
        await sleep(90 * 1000);
        return dataset.name;
    } catch(err) {
        console.log(`Unexpected error while creating index.`, err);
        process.exit(1);
    }
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
        console.log(`Unexpected error while creating a pipeline.`, err);
        process.exit(1);
    }
}

/**
 * Returns successfully once the pipeline has been activated, else the process will exit with status code 1.
 *
 * @param client instance of an SDK client
 * @param id The ID of the pipeline to activate
 * @return {Promise<void>}
 */
async function activatePipeline(client, id) {
    try {
        await client.streams.activatePipeline(id, { activateLatestVersion: true });
        console.log('Waiting for 30s for pipeline to be activated...');
        await sleep(30 * 1000);
    }
    catch(err) {
        console.log(`Unable to activate pipeline.`, err);
        process.exit(1);
    }
}

async function cleanup(client, pipelineId, indexId) {
    try {
        if (pipelineId) {
            await client.streams.deactivatePipeline(pipelineId, {});
            await client.streams.deletePipeline(pipelineId);
        }
        // Don't delete the main index
        if (indexId && indexId !== 'main') {
            await client.catalog.deleteDatasetById(indexId);
        }
    }
    catch(err) {
        console.log(err);
        process.exit(1);
    }
}


// Export these functions to be usable in other examples
module.exports = {
    cleanup,
    createIndex,
    createPipeline,
    activatePipeline
};
