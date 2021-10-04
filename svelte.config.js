import preprocess from 'svelte-preprocess';
/** @type {import('@sveltejs/kit').Config} */
import adapter from '@sveltejs/adapter-node';

const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		vite: {
			server: {
				hmr: {
					protocol: 'ws',
					port: 3001,
				},
			},
			optimizeDeps: {
				//https://formidable.com/open-source/urql/docs/basics/svelte/
				exclude: ['@urql/svelte'],
			},
			ssr: {
				// https://github.com/FormidableLabs/urql/issues/1819
				noExternal: ['@urql/svelte'],
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
