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

module.exports = {
    types: [
        { value: 'feat', name: 'feat:     A new feature' },
        { value: 'fix', name: 'fix:      A bug fix' },
        { value: 'docs', name: 'docs:     Documentation only changes' },
        {
            value: 'style',
            name:
                'style:    Changes that do not affect the meaning of the code\n            (white-space, formatting, missing semi-colons, etc)',
        },
        {
            value: 'refactor',
            name: 'refactor: A code change that neither fixes a bug nor adds a feature',
        },
        {
            value: 'release',
            name: 'release: An aggregation of code changes to be used for a release',
        },
        { value: 'perf', name: 'perf:     A code change that improves performance' },
        { value: 'test', name: 'test:     A code change that adds, updates or fixes tests' },
        { value: 'ci', name: 'ci:    A code change in CI pipeline' },
        { value: 'revert', name: 'revert:   Revert to a commit' },
    ],

    // pre-defined scopes.
    scopes: [
        { name: 'action' },
        { name: 'appreg' },
        { name: 'auth' },
        { name: 'catalog' },
        { name: 'core' },
        { name: 'examples' },
        { name: 'forwarders' },
        { name: 'identity' },
        { name: 'ingest' },
        { name: 'kvstore' },
        { name: 'ml' },
        { name: 'search' },
        { name: 'streams' },
        { name: 'provisioner'},

        { name: '*' },
    ],

    // override scopes for certain types
    scopeOverrides: {
        test: [{ name: 'unit' }, { name: 'integration' }, { name: '*' }],
    },

    // override the messages, defaults are as follows
    messages: {
        scope: 'Denote the SCOPE of this change (optional). Select * to skip.',
    },

    allowCustomScopes: false,
    allowBreakingChanges: ['feat', 'fix', 'refactor'],

    // limit subject length
    subjectLimit: 100,
};
