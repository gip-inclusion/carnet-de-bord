import preprocess from 'svelte-preprocess';
/** @type {import('@sveltejs/kit').Config} */
import adapter from '@sveltejs/adapter-node';

const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		vite: {
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
		},
		adapter: adapter({
			// default options are shown
			out: 'build',
			precompress: false,
			env: {
				// host: 'HOST',
				// port: 'PORT'
			},
		}),
	},

	preprocess: [
		preprocess({
			postcss: true,
		}),
	],
};

export default config;
