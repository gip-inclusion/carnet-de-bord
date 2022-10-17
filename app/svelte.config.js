import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-node';
import { resolve } from 'path';

const config = {
	kit: {
		env: {
			dir: resolve('..'),
		},
		csp: {
			mode: 'auto',
			directives: {
				'default-src': ['self', '*.fabrique.social.gouv.fr', '*.crisp.chat'],
				'font-src': ['self', 'data:', 'blob:', '*.crisp.chat'],
				'img-src': ['self', 'data:', '*.fabrique.social.gouv.fr', '*.crisp.chat'],
				'style-src': ['self', '*.crisp.chat', 'unsafe-inline'],
				//'script-src': ['unsafe-eval'],
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
