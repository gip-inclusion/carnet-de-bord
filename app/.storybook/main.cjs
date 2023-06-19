const { mergeConfig } = require('vite');
const path = require('path');
const { plugin: elm } = require('vite-plugin-elm');

/**
 * Recursively removes all plugins with the names given
 * Resolves async plugins
 */
const withoutVitePlugins = async function (plugins, namesToRemove) {
	const result = [];
	const resolvedPlugins = await Promise.all(plugins);
	// eslint-disable-next-line no-restricted-syntax -- we need to await in the loop
	for (const plugin of resolvedPlugins) {
		if (Array.isArray(plugin)) {
			// eslint-disable-next-line no-await-in-loop
			result.push(await withoutVitePlugins(plugin, namesToRemove));
		}
		if (plugin && 'name' in plugin && !namesToRemove.includes(plugin.name)) {
			result.push(plugin);
		}
	}
	return result;
};

function ssrDisablingPlugin() {
	return {
		// SvelteKit sets SSR, we need it to be false when building
		name: 'storybook:sveltekit-overrides',
		apply: 'build',
		config: () => {
			return { build: { ssr: false } };
		},
	};
}

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
		config = mergeConfig(config, {
			resolve: {
				alias: {
					'elm-storybook': path.resolve(__dirname, './elm-storybook'),
				},
			},
		});

		config.plugins = [
			...(await withoutVitePlugins(config.plugins, [
				// disable specific plugins that are not compatible with Storybook
				'vite-plugin-sveltekit-compile',
				'vite-plugin-sveltekit-guard',
				// disable Elm plugin to re-add it without 'optimize' option
				'vite-plugin-elm',
			])),
			ssrDisablingPlugin(),
			elm({
				debug: false,
				optimize: false,
			}),
		];

		return config;
	},
	docs: {
		autodocs: true,
	},
};
