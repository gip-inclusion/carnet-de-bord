module.exports = {
	parser: '@typescript-eslint/parser',
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
	plugins: ['@typescript-eslint'],
	ignorePatterns: ['*.cjs', 'build', '**/_gen/**'],
	rules: {
		'@typescript-eslint/no-unused-vars': [
			'error',
			{ argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
		],
	},
	env: {
		browser: true,
		es2017: true,
		node: true,
	},
};
