/// <reference types="@sveltejs/kit" />

interface ImportMeta {
	env: {
		VITE_GRAPHQL_API_URL: string;
		VITE_MATOMO_URL: string;
		VITE_MATOMO_SITE_ID: string;
		VITE_NO_LOGIN: string;
	};
}
