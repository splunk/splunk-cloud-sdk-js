export const SEARCH_SERVICE_PREFIX = '/search/v1';
export const EVENT_SERVICE_PREFIX = '/v1';
export const CATELOG_SERVICE_PREFIX = '/catelog/v1';
export const DATASET_KINDS = {
  'CATELOG': 'CATELOG',
  'EXTERN': 'EXTERN',
  'INDEX': 'INDEX',
  'KVSTORE': 'KVSTORE',
  'TOPIC': 'TOPIC',
  'VIEW': 'VIEW',
}
export const ACTION_KINDS = {
  'ALIAS': 'ALIAS', 
  'AUTOKV': 'AUTOKV',
  'REGEX': 'REGEX',
  'EVAL': 'EVAL',
  'LOOKUP': 'LOOKUP',
}
export const EXTRACT_OPTIONS = {
  'ADD_VALUE': 'ADD_VALUE',
  'CLEAN_KEYS': 'CLEAN_KEYS',
  'KEEP_EMPTY': 'KEEP_EMPTY',
}