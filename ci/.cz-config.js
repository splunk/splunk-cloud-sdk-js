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
        { value: 'perf', name: 'perf:     A code change that improves performance' },
        { value: 'test', name: 'test:     A code change that adds, updates or fixes tests' },
        { value: 'ci', name: 'ci:    A code change in CI pipeline' },
        { value: 'revert', name: 'revert:   Revert to a commit' },
    ],

    // pre-defined scopes.
    scopes: [
        { name: 'action' },
        { name: 'auth' },
        { name: 'catalog' },
        { name: 'cicd' },
        { name: 'core' },
        { name: 'examples' },
        { name: 'identity' },
        { name: 'ingest' },
        { name: 'kvstore' },
        { name: 'search' },
        { name: 'streams' },
    ],

    // override scopes for certain types
    scopeOverrides: {
        test: [{ name: 'unit' }, { name: 'integration' }],
    },

    allowCustomScopes: false,
    allowBreakingChanges: ['feat', 'fix', 'refactor'],

    // limit subject length
    subjectLimit: 100,
};
