module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
		'plugin:cypress/recommended'
	],
	plugins: ['svelte3', '@typescript-eslint', 'cypress'],
	ignorePatterns: ['*.cjs', 'build', '.svelte-kit', '**/_gen/**'],
	overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
	settings: {
		'svelte3/typescript': () => require('typescript')
	},
	rules: {
		'@typescript-eslint/no-unused-vars': [
			'error',
			{ "argsIgnorePattern": "^_", varsIgnorePattern: '^_', ignoreRestSiblings: true }
		],
		'cypress/no-assigning-return-values': 'error',
		'cypress/no-unnecessary-waiting': 0,
		'cypress/assertion-before-screenshot': 'warn',
		'cypress/no-force': 'warn',
		'cypress/no-async-tests': 'error'
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2019
	},
	env: {
		browser: true,
		es2017: true,
		node: true,
		'cypress/globals': true
	}
};
