import { setHeadlessWhen, setCommonPlugins } from "@codeceptjs/configure";
// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

export const config: CodeceptJS.MainConfig = {
	gherkin: {
		features: ["./features/**/*.feature", "./integration/**/*.js"],
		steps: ["./step_definitions/steps.ts"],
	},
	helpers: {
		Downloads: {
			require: "./step_definitions/downloads_helper.js",
		},
		FileSystem: {},
		GraphQL: {
			defaultHeaders: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"x-hasura-admin-secret":
					process.env.HASURA_GRAPHQL_ADMIN_SECRET || "admin",
			},
			endpoint: `${
				process.env.HASURA_BASEURL || "http://localhost:5000"
			}/v1/graphql`,
		},
		JSONResponse: {
			requestHelper: "REST",
		},
		Playwright: {
			browser: "chromium",
			locale: "fr",
			show: process.env.CODECEPT_UI ? true : false,
			url: process.env.CODECEPT_BASEURL || "http://localhost:3000",
			video: true,
		},
		REST: {
			defaultHeaders: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			endpoint: process.env.CODECEPT_BASEURL || "http://localhost:3000",
		},
		Seed: {
			require: "./step_definitions/seed_helper.js",
		},
	},
	hooks: [],
	mocha: {},
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
	tests: "./*_test.ts",
	include: {
		I: "./steps_file",
	},
	name: "e2e_better",
};
