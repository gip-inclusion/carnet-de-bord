// vite.config.ts
import { sveltekit } from 'file:///Users/ash/dev/pro/betagouv/cdb/app/node_modules/@sveltejs/kit/src/exports/vite/index.js';
import { plugin as elm } from 'file:///Users/ash/dev/pro/betagouv/cdb/app/node_modules/vite-plugin-elm/dist/index.js';
import path from 'path';
import { spawnSync } from 'node:child_process';
var codegenPlugin = () => ({
	name: 'codegen',
	buildStart: function () {
		console.log('Generating GraphQL code...');
		const { status } = spawnSync('npm', ['run', 'codegen'], {
			stdio: ['ignore', 'inherit', 'inherit'],
		});
		if (status !== 0) {
			this.error('GraphQL code generation failed');
		}
		console.log('Done generating GraphQL code', status);
	},
});
var config = {
	server: {
		port: 3e3,
		watch: {
			ignored: ['**/elm-stuff/**'],
		},
	},
	preview: {
		port: 3e3,
	},
	plugins: [codegenPlugin(), sveltekit(), elm()],
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
	define: {
		__version__: JSON.stringify(process.env.npm_package_version),
		// Eliminate in-source test code
		'import.meta.vitest': 'undefined',
	},
	resolve: {
		alias: {
			$elm: path.resolve('./elm'),
		},
	},
	test: {
		// jest like globals
		globals: true,
		environment: 'jsdom',
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		// in-source testing
		includeSource: ['src/**/*.{js,ts,svelte}'],
		// Add @testing-library/jest-dom matchers & mocks of SvelteKit modules
		setupFiles: ['./setupTest.ts'],
		silent: false,
	},
};
var vite_config_default = config;
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYXNoL2Rldi9wcm8vYmV0YWdvdXYvY2RiL2FwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2FzaC9kZXYvcHJvL2JldGFnb3V2L2NkYi9hcHAvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2FzaC9kZXYvcHJvL2JldGFnb3V2L2NkYi9hcHAvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBzdmVsdGVraXQgfSBmcm9tICdAc3ZlbHRlanMva2l0L3ZpdGUnO1xuaW1wb3J0IHsgcGx1Z2luIGFzIGVsbSB9IGZyb20gJ3ZpdGUtcGx1Z2luLWVsbSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IHNwYXduU3luYyB9IGZyb20gJ25vZGU6Y2hpbGRfcHJvY2Vzcyc7XG5cbmNvbnN0IGNvZGVnZW5QbHVnaW4gPSAoKSA9PiAoe1xuXHRuYW1lOiAnY29kZWdlbicsXG5cdGJ1aWxkU3RhcnQ6IGZ1bmN0aW9uICgpIHtcblx0XHRjb25zb2xlLmxvZygnR2VuZXJhdGluZyBHcmFwaFFMIGNvZGUuLi4nKTtcblx0XHRjb25zdCB7IHN0YXR1cyB9ID0gc3Bhd25TeW5jKCducG0nLCBbJ3J1bicsICdjb2RlZ2VuJ10sIHtcblx0XHRcdHN0ZGlvOiBbJ2lnbm9yZScsICdpbmhlcml0JywgJ2luaGVyaXQnXSxcblx0XHR9KTtcblx0XHRpZiAoc3RhdHVzICE9PSAwKSB7XG5cdFx0XHR0aGlzLmVycm9yKCdHcmFwaFFMIGNvZGUgZ2VuZXJhdGlvbiBmYWlsZWQnKTtcblx0XHR9XG5cdFx0Y29uc29sZS5sb2coJ0RvbmUgZ2VuZXJhdGluZyBHcmFwaFFMIGNvZGUnLCBzdGF0dXMpO1xuXHR9LFxufSk7XG5cbmNvbnN0IGNvbmZpZyA9IHtcblx0c2VydmVyOiB7XG5cdFx0cG9ydDogMzAwMCxcblx0XHR3YXRjaDoge1xuXHRcdFx0aWdub3JlZDogWycqKi9lbG0tc3R1ZmYvKionXSxcblx0XHR9LFxuXHR9LFxuXHRwcmV2aWV3OiB7XG5cdFx0cG9ydDogMzAwMCxcblx0fSxcblx0cGx1Z2luczogW2NvZGVnZW5QbHVnaW4oKSwgc3ZlbHRla2l0KCksIGVsbSgpXSxcblx0b3B0aW1pemVEZXBzOiB7XG5cdFx0Ly9odHRwczovL2Zvcm1pZGFibGUuY29tL29wZW4tc291cmNlL3VycWwvZG9jcy9iYXNpY3Mvc3ZlbHRlL1xuXHRcdGV4Y2x1ZGU6IFsnQHVycWwvc3ZlbHRlJywgJ21hdG9tby10cmFja2VyJ10sXG5cdH0sXG5cdHNzcjoge1xuXHRcdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9Gb3JtaWRhYmxlTGFicy91cnFsL2lzc3Vlcy8xODE5XG5cdFx0bm9FeHRlcm5hbDogWydAdXJxbC9zdmVsdGUnXSxcblx0fSxcblx0YnVpbGQ6IHtcblx0XHRyb2xsdXBPcHRpb25zOiB7XG5cdFx0XHRleHRlcm5hbDogWy9cXC50ZXN0XFwuKHR8ailzJC9dLFxuXHRcdH0sXG5cdH0sXG5cdGRlZmluZToge1xuXHRcdF9fdmVyc2lvbl9fOiBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmVudi5ucG1fcGFja2FnZV92ZXJzaW9uKSxcblx0XHQvLyBFbGltaW5hdGUgaW4tc291cmNlIHRlc3QgY29kZVxuXHRcdCdpbXBvcnQubWV0YS52aXRlc3QnOiAndW5kZWZpbmVkJyxcblx0fSxcblx0cmVzb2x2ZToge1xuXHRcdGFsaWFzOiB7XG5cdFx0XHQkZWxtOiBwYXRoLnJlc29sdmUoJy4vZWxtJyksXG5cdFx0fSxcblx0fSxcblx0dGVzdDoge1xuXHRcdC8vIGplc3QgbGlrZSBnbG9iYWxzXG5cdFx0Z2xvYmFsczogdHJ1ZSxcblx0XHRlbnZpcm9ubWVudDogJ2pzZG9tJyxcblx0XHRpbmNsdWRlOiBbJ3NyYy8qKi8qLnt0ZXN0LHNwZWN9LntqcyxtanMsY2pzLHRzLG10cyxjdHMsanN4LHRzeH0nXSxcblx0XHQvLyBpbi1zb3VyY2UgdGVzdGluZ1xuXHRcdGluY2x1ZGVTb3VyY2U6IFsnc3JjLyoqLyoue2pzLHRzLHN2ZWx0ZX0nXSxcblx0XHQvLyBBZGQgQHRlc3RpbmctbGlicmFyeS9qZXN0LWRvbSBtYXRjaGVycyAmIG1vY2tzIG9mIFN2ZWx0ZUtpdCBtb2R1bGVzXG5cdFx0c2V0dXBGaWxlczogWycuL3NldHVwVGVzdC50cyddLFxuXHRcdHNpbGVudDogZmFsc2UsXG5cdH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25maWc7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTJSLFNBQVMsaUJBQWlCO0FBQ3JULFNBQVMsVUFBVSxXQUFXO0FBQzlCLE9BQU8sVUFBVTtBQUNqQixTQUFTLGlCQUFpQjtBQUUxQixJQUFNLGdCQUFnQixPQUFPO0FBQUEsRUFDNUIsTUFBTTtBQUFBLEVBQ04sWUFBWSxXQUFZO0FBQ3ZCLFlBQVEsSUFBSSw0QkFBNEI7QUFDeEMsVUFBTSxFQUFFLE9BQU8sSUFBSSxVQUFVLE9BQU8sQ0FBQyxPQUFPLFNBQVMsR0FBRztBQUFBLE1BQ3ZELE9BQU8sQ0FBQyxVQUFVLFdBQVcsU0FBUztBQUFBLElBQ3ZDLENBQUM7QUFDRCxRQUFJLFdBQVcsR0FBRztBQUNqQixXQUFLLE1BQU0sZ0NBQWdDO0FBQUEsSUFDNUM7QUFDQSxZQUFRLElBQUksZ0NBQWdDLE1BQU07QUFBQSxFQUNuRDtBQUNEO0FBRUEsSUFBTSxTQUFTO0FBQUEsRUFDZCxRQUFRO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTixTQUFTLENBQUMsaUJBQWlCO0FBQUEsSUFDNUI7QUFBQSxFQUNEO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUixNQUFNO0FBQUEsRUFDUDtBQUFBLEVBQ0EsU0FBUyxDQUFDLGNBQWMsR0FBRyxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBQUEsRUFDN0MsY0FBYztBQUFBO0FBQUEsSUFFYixTQUFTLENBQUMsZ0JBQWdCLGdCQUFnQjtBQUFBLEVBQzNDO0FBQUEsRUFDQSxLQUFLO0FBQUE7QUFBQSxJQUVKLFlBQVksQ0FBQyxjQUFjO0FBQUEsRUFDNUI7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNOLGVBQWU7QUFBQSxNQUNkLFVBQVUsQ0FBQyxpQkFBaUI7QUFBQSxJQUM3QjtBQUFBLEVBQ0Q7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNQLGFBQWEsS0FBSyxVQUFVLFFBQVEsSUFBSSxtQkFBbUI7QUFBQTtBQUFBLElBRTNELHNCQUFzQjtBQUFBLEVBQ3ZCO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUixPQUFPO0FBQUEsTUFDTixNQUFNLEtBQUssUUFBUSxPQUFPO0FBQUEsSUFDM0I7QUFBQSxFQUNEO0FBQUEsRUFDQSxNQUFNO0FBQUE7QUFBQSxJQUVMLFNBQVM7QUFBQSxJQUNULGFBQWE7QUFBQSxJQUNiLFNBQVMsQ0FBQyxzREFBc0Q7QUFBQTtBQUFBLElBRWhFLGVBQWUsQ0FBQyx5QkFBeUI7QUFBQTtBQUFBLElBRXpDLFlBQVksQ0FBQyxnQkFBZ0I7QUFBQSxJQUM3QixRQUFRO0FBQUEsRUFDVDtBQUNEO0FBRUEsSUFBTyxzQkFBUTsiLAogICJuYW1lcyI6IFtdCn0K
