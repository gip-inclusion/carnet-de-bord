exports.config = {
	bootstrap: null,
	gherkin: {
		features: ['./features/**/*.feature', './integration/**/*.js'],
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
				'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET || 'admin',
			},
			endpoint: `${process.env.HASURA_BASEURL || 'http://localhost:5000'}/v1/graphql`,
		},
		Playwright: {
			browser: 'chromium',
			locale: 'fr',
			show: process.env.CODECEPT_UI ? true : false,
			url: process.env.CODECEPT_BASEURL || 'http://localhost:3000',
			video: true,
		},
		Seed: {
			require: './step_definitions/seed_helper.js',
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
		stepByStepReport: {
			enabled: true,
		},
		tryTo: {
			enabled: true,
		},
	},
	teardown: null,
	tests: './__tests__/*.ts',
	timeout: null,
	translation: 'fr-FR',
};
