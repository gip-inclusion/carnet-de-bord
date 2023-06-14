const { mergeConfig } = require('vite');
const path = require('path');
const folder = path.resolve(__dirname, './elm-storybook');

module.exports = {
	stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)', '../elm/**/*.stories.@(js|jsx|ts|tsx)'],
	addons: [
		'@storybook/addon-a11y',
		'@storybook/addon-actions',
		'@storybook/addon-controls',
		'./elm-storybook/addon/register',
		'@storybook/addon-mdx-gfm',
	],
	framework: {
		name: '@storybook/html-vite',
		options: {},
	},
	async viteFinal(config) {
		// Allow `elm-storybook` to be imported in *.stories.js
		return mergeConfig(config, {
			resolve: {
				alias: {
					'elm-storybook': folder,
				},
			},
		});
	},
	docs: {
		autodocs: true,
	},
};
