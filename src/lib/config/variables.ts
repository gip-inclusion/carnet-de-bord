import { browser } from '$app/env';

export const getGraphqlAPI = (): string => {
	return find('VITE_GRAPHQL_API_URL');
};

export const getAppUrl = (): string => {
	return find('VITE_APP_URL');
};
export const getDatabaseUrl = (): string => {
	return find('VITE_DATABASE_URL');
};

export const getSmtpConfig = (): {
	SMTP_FROM: string;
	SMTP_HOST: string;
	SMTP_PASS: string;
	SMTP_PORT: number;
	SMTP_USER: string;
} => {
	return {
		SMTP_FROM: find('VITE_SMTP_FROM'),
		SMTP_HOST: find('VITE_SMTP_HOST'),
		SMTP_PASS: find('VITE_SMTP_PASS'),
		SMTP_PORT: parseInt(find('VITE_SMTP_PORT')),
		SMTP_USER: find('VITE_SMTP_USER')
	};
};

export const getSecretConfig = (): {
	AUTH_PRIVATE_KEY: string;
	AUTH_PRIVATE_KEY_FILE: string;
	AUTH_PUBLIC_KEY: string;
	AUTH_PUBLIC_KEY_FILE: string;
} => {
	return {
		AUTH_PRIVATE_KEY: find('VITE_AUTH_PRIVATE_KEY'),
		AUTH_PRIVATE_KEY_FILE: find('VITE_AUTH_PRIVATE_KEY_FILE'),
		AUTH_PUBLIC_KEY: find('VITE_AUTH_PUBLIC_KEY'),
		AUTH_PUBLIC_KEY_FILE: find('VITE_AUTH_PUBLIC_KEY_FILE')
	};
};

function find(name: string): string {
	if (browser) {
		return import.meta.env[name];
	}
	return process.env[name] || import.meta.env[name];
}
