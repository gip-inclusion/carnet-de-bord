module.exports = {
	plugins: ['svelte3', '@typescript-eslint', 'eslint-plugin-simple-import-sort'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2019,
	},
	overrides: [
		{
			files: ['*.svelte'],
			processor: 'svelte3/svelte3',
		},
	],
	settings: {
		'svelte3/typescript': () => require('typescript'), // pass the TypeScript package to the Svelte plugin
	},

	rules: {
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': 'error',
		'prefer-const': 'error',
	},
	globals: {
		__version__: 'readonly',
	},
	extends: ['plugin:storybook/recommended'],
};
