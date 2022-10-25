const config = {
	testMatch: ['!node_modules*', '**/(*.)+(spec|test).(ts|js|svelte)'],
	transform: {
		'^.+\\.svelte$': ['svelte-jester', { preprocess: true }],
		'^.+\\.(ts|tsx|js|jsx)$': ['babel-jest'],
	},
	moduleNameMapper: {
		'^\\$lib$': '<rootDir>/src/lib',
		'^\\$lib/(.*)$': '<rootDir>/src/lib/$1',
		'^\\$app(.*)$': [
			'<rootDir>/.svelte-kit/dev/runtime/app$1',
			'<rootDir>/.svelte-kit/build/runtime/app$1',
		],
	},
	moduleFileExtensions: ['js', 'svelte', 'ts'],
	setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
	reporters: ['default', 'github-actions'],
	globals: {
		'ts-jest': {
			tsConfig: 'tsconfig.test.json',
		},
	},
};

module.exports = config;
