import preprocess from 'svelte-preprocess';
/** @type {import('@sveltejs/kit').Config} */
import adapter from '@sveltejs/adapter-node';

const config = {
	kit: {
		csp: {
			mode: 'auto',
			directives: {
				'default-src': ['self', '*.fabrique.social.gouv.fr', 'client.crisp.chat'],
				'font-src': ['self', 'data:', 'blob:', 'client.crisp.chat'],
				'frame-src': ['self'],
				'img-src': ['self', 'data:', 'client.crisp.chat'],
				'style-src': ['self', 'client.crisp.chat', '*.fabrique.social.gouv.fr', 'unsafe-inline'],
				'script-src': ['self', '*.fabrique.social.gouv.fr', 'unsafe-inline'],
				'connect-src': ['self', '*.fabrique.social.gouv.fr', 'client.crisp.chat', 'localhost:*/'],
			},
		},
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
		}),
	},

	preprocess: [
		preprocess({
			postcss: true,
		}),
	],
};

export default config;
