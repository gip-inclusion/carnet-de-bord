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
			// The %…% delimited identifiers in these directives are processed by the 'handle' hook
			// in hooks.server.ts to expand environment variables at runtime
			directives: {
				'base-uri': ['self'],
				'default-src': ['self'],
				'font-src': ['self', 'https://client.crisp.chat/static/'],
				'img-src': ['self', 'data:', 'https://*.crisp.chat/'],
				'style-src': ['self', '*.crisp.chat', 'unsafe-inline'],
				'media-src': ['self', 'nextcloud.fabrique.social.gouv.fr'],
				'script-src': [
					'self',
					...(process.env.NODE_ENV === 'production' ? [''] : ['unsafe-eval']),
					'https://client.crisp.chat/',
					'%PUBLIC_MATOMO_URL%',
				],
				'connect-src': [
					'self',
					// allow ws: for development (live reload)
					...(process.env.NODE_ENV === 'production' ? [] : ['ws:', 'http:']),
					'wss://client.relay.crisp.chat/',
					'https://client.crisp.chat/static/',
					'%GRAPHQL_API_URL%',
					'%BACKEND_API_URL%',
					'%PUBLIC_MATOMO_URL%',
					'%PUBLIC_SENTRY_DSN%',
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
