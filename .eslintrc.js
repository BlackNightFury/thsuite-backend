module.exports = {
    'env': {
        'es6': true,
        'node': true
    },
    'plugins': ['eslint-plugin-standard', 'async-await'],
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 2017,
        'sourceType': 'module'
    },
    'rules': {
        'linebreak-style': ['error', 'unix'],
        'import/no-unresolved': 'off',
        'import/no-extraneous-dependencies': 'off',
        'func-names': 'off',
        'no-multi-spaces': 'off',
        'no-console': 'off',
        'spaced-comment': ['error', 'always', { 'markers': ['/'] }],
        'padded-blocks': 'off',
        'linebreak-style': 'off',
        'class-methods-use-this': 'off',
        'indent': ['error', 4],
        'max-len': ['error', 180, 4, { ignoreComments: true }],
        'no-unused-vars': ['error', { vars: 'local', args: 'after-used' }],
        'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
        'no-nested-ternary': 'off',
        'object-shorthand': ['error', 'methods']
    }
};
