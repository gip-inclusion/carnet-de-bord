module.exports = {
	extends: ['@socialgouv/eslint-config-recommended'],
	overrides: [
		{
			files: ['step_definitions/**/*.js', 'integration/**/*.js'],
			globals: {
				After: 'readonly',
				AfterSuite: 'readonly',
				Before: 'readonly',
				BeforeSuite: 'readonly',
				Data: 'readonly',
				DataTable: 'readonly',
				Feature: 'readonly',
				Given: 'readonly',
				Helper: 'readonly',
				Scenario: 'readonly',
				Then: 'readonly',
				When: 'readonly',
				actor: 'readonly',
				by: 'readonly',
				inject: 'readonly',
				locate: 'readonly',
				pause: 'readonly',
				secret: 'readonly',
				session: 'readonly',
				within: 'readonly',
				xScenario: 'readonly',
			},
		},
	],
	rules: {
		'jest/no-deprecated-functions': 'off',
	},
};
