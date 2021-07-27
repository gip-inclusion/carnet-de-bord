/// <reference types="@sveltejs/kit" />

interface ImportMeta {
	env: {
		VITE_GRAPHQL_API_URL: string;

		VITE_SMTP_FROM: string;
		VITE_SMTP_HOST: string;
		VITE_SMTP_PASS: string;
		VITE_SMTP_PORT: number;
		VITE_SMTP_USER: string;

		VITE_APP_URL: string;

		VITE_DATABASE_URL: string;

		VITE_AUTH_PRIVATE_KEY: string;
		VITE_AUTH_PRIVATE_KEY_FILE: string;
		VITE_AUTH_PUBLIC_KEY: string;
		VITE_AUTH_PUBLIC_KEY_FILE: string;
	};
}
