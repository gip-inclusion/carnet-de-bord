import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-node';
import { resolve } from 'path';

const defaultSrc = [
	'self',
	'*.crisp.chat',

	// Note that in development, PUBLIC_MATOMO_URL will not be read from .env
	// (because dotenv has not been loaded at this point), you have to set it
	// in the environment explicitly, e.g. `PUBLIC_MATOMO_URL=... npm run dev`
	...(process.env.PUBLIC_MATOMO_URL ? [process.env.PUBLIC_MATOMO_URL] : []),
];

const config = {
	kit: {
		env: {
			dir: resolve('..'),
		},
		csp: {
			mode: 'auto',
			directives: {
				'default-src': defaultSrc,
				'font-src': ['self', 'data:', 'blob:', '*.crisp.chat'],
				'img-src': ['self', 'data:', '*.crisp.chat'],
				'media-src': ['self', 'nextcloud.fabrique.social.gouv.fr'],
				'style-src': ['self', '*.crisp.chat', 'unsafe-inline'],
				'script-src':
					process.env.NODE_ENV === 'production' ? defaultSrc : [...defaultSrc, 'unsafe-eval'],
				'connect-src': ['self', 'wss:', 'https:', 'localhost:*', 'client.relay.crisp.chat'],
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
