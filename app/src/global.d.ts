/// <reference types="@sveltejs/kit" />

interface ImportMeta {
	env: {
		VITE_MATOMO_URL: string;
		VITE_MATOMO_SITE_ID: string;
	};
}

// support for Crisp
interface Window {
	$crisp: any;
	CRISP_WEBSITE_ID: string;
	dsfr: any;
}

// support for svelecte
declare module 'svelte-file-dropzone';

// support for svelecte
declare module 'svelte-accessible-dialog';

// support for svelecte
declare module 'svelecte';

// support for matomo-tracker
declare module 'matomo-tracker';

declare module '@gouvfr/dsfr/dist/dsfr/dsfr.module.min.js';

declare const __version__: string;
