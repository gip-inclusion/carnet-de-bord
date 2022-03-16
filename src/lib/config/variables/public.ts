//import { browser } from '$app/env';

export const getGraphqlAPI = (): string => {
	return find('VITE_GRAPHQL_API_URL');
};

function find(name: string): string {
	let importEnvVar = import.meta.env[name];
	importEnvVar = typeof importEnvVar === 'string' ? importEnvVar : '';

	//if (browser) {
	//    return importEnvVar;
	//}

	const processEnvVar = process?.env[name];
	return processEnvVar || importEnvVar;
}

export function getMatomoUrl(): string | null {
	const viteMatomoUrl = import.meta.env['VITE_MATOMO_URL'];
	return !!viteMatomoUrl && typeof viteMatomoUrl === 'string' ? viteMatomoUrl : null;
}

export function getMatomoSiteId(): string | null {
	const viteMatomoSiteId = import.meta.env['VITE_MATOMO_SITE_ID'];
	return !!viteMatomoSiteId && typeof viteMatomoSiteId === 'string' ? viteMatomoSiteId : null;
}

export function getCrispWebsiteId(): string {
	const viteCrispWebsiteId = import.meta.env['VITE_CRISP_WEBSITE_ID'];
	return !!viteCrispWebsiteId && typeof viteCrispWebsiteId === 'string' ? viteCrispWebsiteId : null;
}
