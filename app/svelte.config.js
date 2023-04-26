import { vitePreprocess } from '@sveltejs/kit/vite';
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
				'base-uri': ['self'],
				'default-src': ['self'],
				'font-src': ['self', 'https://client.crisp.chat/static/'],
				'img-src': ['self', 'data:', 'https://*.crisp.chat/'],
				'style-src': ['self', '*.crisp.chat', 'unsafe-inline'],
				'script-src': [
					'self',
					...(process.env.NODE_ENV === 'production' ? [''] : ['strict-dynamic']),
					'https://client.crisp.chat/',
				],
				'connect-src': [
					'self',
					...(process.env?.VITE_ENVIRONMENT === 'local' ? ['ws:'] : []),
					'wss://client.relay.crisp.chat/',
					'https://client.crisp.chat/static/',
					'https://matomo.inclusion.beta.gouv.fr/',
					'https://sentry.fabrique.social.gouv.fr',
					'https://*.sentry.fabrique.social.gouv.fr',
				],
			},
		},
		adapter: adapter({ precompress: true }),
	},
	vitePlugin: {
		experimental: {
			inspector: {
				showToggleButton: 'always',
				toggleButtonPos: 'bottom-right',
			},
		},
	},
	preprocess: vitePreprocess(),
};

export default config;
