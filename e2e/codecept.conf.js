exports.config = {
	bootstrap: null,
	gherkin: {
		features: './features/**/*.feature',
		steps: ['./step_definitions/steps.js'],
	},
	helpers: {
		Downloads: {
			require: './step_definitions/downloads_helper.js',
		},
		FileSystem: {},
		GraphQL: {
			defaultHeaders: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET || 'admin',
			},
			endpoint: process.env.HASURA_BASEURL || 'http://localhost:5000/v1/graphql',
		},
		Playwright: {
			browser: 'chromium',
			locale: 'fr',
			show: process.env.CODECEPT_UI ? true : false,
			url: process.env.CODECEPT_BASEURL || 'http://localhost:3000',
			video: true,
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
	// rerun is not working anymore in codecept3
	rerun: {
		// how many times to try to rerun all tests
		maxReruns: 3,
		// how many times all tests should pass
		minSuccess: 1,
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
