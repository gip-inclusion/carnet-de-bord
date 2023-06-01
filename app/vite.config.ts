import { sveltekit } from '@sveltejs/kit/vite';
import { plugin as elm } from 'vite-plugin-elm';
import path from 'path';
import { spawnSync } from 'node:child_process';

const codegenPlugin = () => ({
	name: 'codegen',
	buildStart: function () {
		console.log('Generating GraphQL code...');
		const { status } = spawnSync('npm', ['run', 'codegen'], {
			stdio: ['ignore', 'inherit', 'inherit'],
		});
		if (status !== 0) {
			this.error('GraphQL code generation failed');
		}
		console.log('Done generating GraphQL code', status);
	},
});

const config = {
	server: {
		port: 3000,
		watch: {
			ignored: ['**/elm-stuff/**'],
		},
	},
	preview: {
		port: 3000,
	},
	plugins: [codegenPlugin(), sveltekit(), elm()],
	optimizeDeps: {
		//https://formidable.com/open-source/urql/docs/basics/svelte/
		exclude: ['@urql/svelte', 'matomo-tracker'],
	},
	ssr: {
		// https://github.com/FormidableLabs/urql/issues/1819
		noExternal: ['@urql/svelte'],
	},
	build: {
		rollupOptions: {
			external: [/\.test\.(t|j)s$/],
		},
	},
	define: {
		__version__: JSON.stringify(process.env.npm_package_version),
		// Eliminate in-source test code
		'import.meta.vitest': 'undefined',
	},
	resolve: {
		alias: {
			$elm: path.resolve('./elm'),
		},
	},
	test: {
		// jest like globals
		globals: true,
		environment: 'jsdom',
		// in-source testing
		includeSource: ['src/**/*.{js,ts,svelte}'],
		// Add @testing-library/jest-dom matchers & mocks of SvelteKit modules
		setupFiles: ['./setupTest.ts'],
		silent: false,
	},
};

export default config;
