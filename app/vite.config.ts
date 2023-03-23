import { sveltekit } from '@sveltejs/kit/vite';
import { plugin as elmPlugin } from 'vite-plugin-elm';

const config = {
	server: {
		port: 3000,
	},
	preview: {
		port: 3000,
	},
	plugins: [sveltekit(), elmPlugin()],
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
	test: {
		// jest like globals
		globals: true,
		environment: 'jsdom',
		// in-source testing
		includeSource: ['src/**/*.{js,ts,svelte}', 'codegen.cjs'],
		// Add @testing-library/jest-dom matchers & mocks of SvelteKit modules
		setupFiles: ['./setupTest.ts'],
		silent: false,
	},
};

export default config;
