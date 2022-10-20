import { env } from '$env/dynamic/public';

export function getMatomoUrl(): string | null {
	return env.PUBLIC_MATOMO_URL;
}

export function getMatomoSiteId(): string | null {
	return env.PUBLIC_MATOMO_SITE_ID;
}

export function getCrispWebsiteId(): string {
	return env.PUBLIC_CRISP_WEBSITE_ID;
}
