import { vitePreprocess } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-node';
import { resolve } from 'path';

function formatURLForCsp(originalUrl) {
	if (!originalUrl) return;
	const url = new URL(originalUrl);
	url.username = '';
	url.password = '';

	return url.href;
}

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
					...(process.env.NODE_ENV === 'production' ? [''] : ['unsafe-eval']),
					'https://client.crisp.chat/',
					...(process.env.PUBLIC_MATOMO_URL ? [process.env.PUBLIC_MATOMO_URL] : []),
				],
				'connect-src': [
					'self',
					// allow ws: for development (live reload)
					...(process.env.NODE_ENV === 'production' ? [] : ['ws:', 'http:']),
					'wss://client.relay.crisp.chat/',
					'https://client.crisp.chat/static/',
					...[
						// Note that in development, environment variables will not be read from .env
						// (because dotenv has not been loaded at this point), you have to set it
						// in the environment explicitly, e.g. `PUBLIC_MATOMO_URL=... npm run dev`
						// or use shdotenv script, e.g. `./scripts/shdotenv make start-app`
						process.env.GRAPHQL_API_URL,
						process.env.BACKEND_API_URL,
						process.env.PUBLIC_SENTRY_DSN,
					]
						.map(formatURLForCsp)
						.filter(Boolean),
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
