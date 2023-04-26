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
					// allow ws: for development (live reload)
					...(process.env.NODE_ENV === 'production' ? [] : ['ws:', 'http:']),
					'wss://client.relay.crisp.chat/',
					'https://client.crisp.chat/static/',
					// Note that in development, PUBLIC_MATOMO_URL(or PUBLIC_SENTRY_DSN) will not be read from .env
					// (because dotenv has not been loaded at this point), you have to set it
					// in the environment explicitly, e.g. `PUBLIC_MATOMO_URL=... npm run dev`
					process.env?.GRAPHQL_API_URL,
					process.env?.BACKEND_API_URL,
					process.env?.PUBLIC_MATOMO_URL,
					process.env?.PUBLIC_SENTRY_DSN,
				].filter(Boolean),
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
console.log(config.kit.csp);
export default config;
