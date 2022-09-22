import preprocess from 'svelte-preprocess';
/** @type {import('@sveltejs/kit').Config} */
import adapter from '@sveltejs/adapter-node';

const config = {
	kit: {
		csp: {
			mode: 'auto',
			directives: {
				'default-src': ['self', '*.fabrique.social.gouv.fr', '*.crisp.chat'],
				'font-src': ['self', 'data:', 'blob:', '*.crisp.chat'],
				'img-src': ['self', 'data:', '*.fabrique.social.gouv.fr', '*.crisp.chat'],
				'style-src': ['self', '*.crisp.chat', 'unsafe-inline'],
				'connect-src': [
					'self',
					'wss:',
					'https:',
					'*.fabrique.social.gouv.fr',
					'localhost:*',
					'client.relay.crisp.chat',
				],
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
