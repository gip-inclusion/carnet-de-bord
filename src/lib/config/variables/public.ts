import { browser } from '$app/env';

export const getGraphqlAPI = (): string => {
	return find('VITE_GRAPHQL_API_URL');
};

function find(name: string): string {
	let importEnvVar = import.meta.env[name];
	importEnvVar = typeof importEnvVar === 'string' ? importEnvVar : '';

	if (browser) {
		return importEnvVar;
	}

	const processEnvVar = process?.env[name];
	return processEnvVar || importEnvVar;
}

export function getMatomoUrl(): string | null {
	return (import.meta.env['VITE_MATOMO_URL'] as string) ?? null;
}

export function getMatomoSiteId(): string | null {
	return (import.meta.env['VITE_MATOMO_SITE_ID'] as string) ?? null;
}

export function getCrispWebsiteId(): string {
	return (import.meta.env['VITE_CRISP_WEBSITE_ID'] as string) ?? null;
}
