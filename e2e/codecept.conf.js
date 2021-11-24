exports.config = {
	bootstrap: null,
	gherkin: {
		features: './features/**/*.feature',
		steps: ['./step_definitions/steps.js'],
	},
	helpers: {
		Playwright: {
			browser: 'chromium',
			show: process.env.CODECEPT_HEADLESS ? false : true,
			url: 'http://localhost:3000',
		},
	},
	hooks: [],
	mocha: {},
	name: 'Carnet de bord',
	output: './output',
	plugins: {
		pauseOnFail: {},
		retryFailedStep: {
			enabled: true,
		},
		screenshotOnFail: {
			enabled: true,
		},
		tryTo: {
			enabled: true,
		},
	},
	stepTimeout: 0,
	stepTimeoutOverride: [
		{
			pattern: 'wait.*',
			timeout: 0,
		},
		{
			pattern: 'amOnPage',
			timeout: 0,
		},
	],
	teardown: null,
	tests: './__tests__/*.ts',
	timeout: null,
	translation: 'fr-FR',
};
