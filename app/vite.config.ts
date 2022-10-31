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
	},
};

export default config;
