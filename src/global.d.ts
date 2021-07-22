/// <reference types="@sveltejs/kit" />

interface ImportMeta {
	env: {
		VITE_JWT_SECRET_KEY: string;
		VITE_APP_URL: string;

		VITE_DATABASE_URL: string;
		VITE_GRAPHQL_API_URL: string;

		VITE_HASURA_GRAPHQL_DATABASE_URL: string;
		VITE_HASURA_GRAPHQL_JWT_SECRET: string;

		VITE_SMTP_HOST: string;
		VITE_SMTP_PORT: number;
		VITE_SMTP_USER: string;
		VITE_SMTP_PASS: string;
		VITE_SMTP_FROM: string;

		VITE_AUTH_PRIVATE_KEY: string;
		VITE_AUTH_PRIVATE_KEY_FILE: string;
		VITE_AUTH_PUBLIC_KEY: string;
		VITE_AUTH_PUBLIC_KEY_FILE: string;
	};
}
