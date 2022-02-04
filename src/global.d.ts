/// <reference types="@sveltejs/kit" />

interface ImportMeta {
	env: {
		VITE_GRAPHQL_API_URL: string;
		VITE_MATOMO_URL: string;
		VITE_MATOMO_SITE_ID: string;
	};
}

// support for Crisp
interface Window {
	$crisp: any;
	CRISP_WEBSITE_ID: string;
}

// support for dsfr
interface Window {
	dsfr: any;
}

// support for svelecte
declare module 'svelte-file-dropzone';

// support for svelecte
declare module 'svelte-accessible-dialog';

// support for svelecte
declare module 'svelecte';
