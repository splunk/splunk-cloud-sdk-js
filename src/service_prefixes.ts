/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/

/**
 * @private
 */
export const ACTION_SERVICE_PREFIX: string = '/action/v1beta1';

/**
 * @private
 */
export const CATALOG_SERVICE_PREFIX: string = '/catalog/v1beta1';

/**
 * @private
 */
export const INGEST_SERVICE_PREFIX: string = '/ingest/v1beta1';

/**
 * @private
 */
export const IDENTITY_SERVICE_PREFIX: string = '/identity/v1';

/**
 * @private
 */
export const SEARCH_SERVICE_PREFIX: string = '/search/v1beta1';

/**
 * @private
 */
export const KVSTORE_SERVICE_PREFIX: string = '/kvstore/v1beta1';

/**
 * @private
 */
export const STREAMS_SERVICE_PREFIX: string = '/streams/v1';

/**
 * @private
 */
export const SERVICE_CLUSTER_MAPPING = {
    search: 'api',
    catalog: 'api',
    identity: 'api',
    ingest: 'api',
    kvstore: 'api',
    action: 'api',
    streams: 'api'
};

/**
 * @private
 */
export const CLUSTER_URL_MAPPING = {
    api: 'api.staging.splunkbeta.com',
    apps:'apps.staging.splunkbeta.com'
};
