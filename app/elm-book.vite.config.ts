import { plugin as elmPlugin } from 'vite-plugin-elm';
import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		port: 4000,
	},
	preview: {
		port: 3333,
	},
	plugins: [elmPlugin()],
	mode: 'development',
	root: 'doc',
	cacheDir: 'node_modules/.vite-doc',
});
