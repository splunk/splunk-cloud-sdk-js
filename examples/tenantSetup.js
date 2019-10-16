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

require('isomorphic-fetch');
const { SplunkCloud } = require('../splunk');
const { activatePipeline, cleanupPipeline, createIndex, createPipeline } = require('./helpers/splunkCloudHelper');
const { SPLUNK_CLOUD_API_HOST, SPLUNK_CLOUD_APPS_HOST, BEARER_TOKEN, TENANT_ID } = process.env;

// ***** TITLE: Tenant setup functions
//
// ***** DESCRIPTION: This example shows how to begin using Splunk Cloud Platform
//                    by setting up a new tenant for ingest & search.
(async function () {
    const DATE_NOW = Date.now();
    let pipelineId = null;
    let indexId = null;

    // ***** STEP 1: Get Splunk Cloud client
    // ***** DESCRIPTION: Get Splunk Cloud client of a tenant using an authentication token.
    const splunk = new SplunkCloud({
        urls: {
            api: SPLUNK_CLOUD_API_HOST,
            app: SPLUNK_CLOUD_APPS_HOST
        },
        tokenSource: BEARER_TOKEN,
        defaultTenant: TENANT_ID,
    });

    try {
        // ***** STEP 2: Create a dataset in the catalog and capture the index.
        // ***** DESCRIPTION: The index is retained so that we can send events to the new index.
        const indexName = `index${DATE_NOW}`;
        indexId = await createIndex(splunk, indexName);

        // ***** STEP 3: Create a pipeline.
        // ***** DESCRIPTION: Configures a streams pipeline for the newly created index.
        const pipelineName = `pipeline${DATE_NOW}`;
        pipelineId = await createPipeline(splunk, TENANT_ID, pipelineName, indexName);

        // ***** STEP 4: Push data to index using the Ingest service.
        // ***** DESCRIPTION: Send events.
        await activatePipeline(splunk, pipelineId);
    } finally {
        // ***** STEP 5: Cleanup - Delete all created pipelines and datasets.
        // ***** DESCRIPTION: Ignoring exceptions on cleanup.
        await cleanupPipeline(splunk, pipelineId, indexId).catch(() => {
            // ignoring exceptions on cleanup.
        });
    }
})().catch((error) => console.error(error));
