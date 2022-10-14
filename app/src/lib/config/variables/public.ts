import { env } from '$env/dynamic/public';
export function getMatomoUrl(): string | null {
	const viteMatomoUrl = env['VITE_MATOMO_URL'];
	return !!viteMatomoUrl && typeof viteMatomoUrl === 'string' ? viteMatomoUrl : null;
}

export function getMatomoSiteId(): string | null {
	const viteMatomoSiteId = env['VITE_MATOMO_SITE_ID'];
	return !!viteMatomoSiteId && typeof viteMatomoSiteId === 'string' ? viteMatomoSiteId : null;
}

export function getCrispWebsiteId(): string {
	const viteCrispWebsiteId = env['VITE_CRISP_WEBSITE_ID'];
	return !!viteCrispWebsiteId && typeof viteCrispWebsiteId === 'string' ? viteCrispWebsiteId : null;
}
