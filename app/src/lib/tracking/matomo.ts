type Matomo = {
	initialized: boolean;
};

declare global {
	interface Window {
		Matomo?: Matomo;
		_paq: string[][];
	}
}

export function load(url: string, siteId: string): void {
	if (!url || !siteId) {
		return;
	}
	if (document.getElementById('matomo-script')) {
		// early return; we don't need 2 scripts
		return;
	}
	// we don't need this page trackPageView since we already push one on the initial load
	// see src/routes/__layout.svelte
	// _push(['trackPageView']);
	_push(['enableLinkTracking']);
	_push(['setTrackerUrl', `${url}/matomo.php`]);
	_push(['setSiteId', `${siteId}`]);

	const scriptElement = document.createElement('script');
	const titleElement = document.getElementsByTagName('title')[0];
	scriptElement.type = 'text/javascript';
	scriptElement.async = true;
	scriptElement.id = 'matomo-script';
	scriptElement.src = `${url}/matomo.js`;

	if (titleElement.parentNode) {
		titleElement.parentNode.insertBefore(scriptElement, titleElement);
	}
}

export function trackPageView(url: string, title: string): void {
	_push(['setCustomUrl', url]);
	_push(['setDocumentTitle', title]);
	_push(['trackPageView']);
}

export function trackSiteSearch(pattern: string, category?: string): void {
	_push(['trackSiteSearch', pattern, category]);
}

export function trackEvent(category: string, action: string, name?: string, value?: string): void {
	const eventParams = ['trackEvent', category, action, name, value].filter((field) =>
		Boolean(field)
	);
	_push([...eventParams]);
}

export function logout() {
	_push(['appendToTrackingUrl', 'new_visit=1']);
	_push(['setDocumentTitle', 'Deconnexion']);
	_push(['trackPageView']);
	deleteCustomDimension(CustomDimensions.Deployment);
	deleteCustomDimension(CustomDimensions.Role);
	_push(['appendToTrackingUrl', '']);
}
/**
 * Customs dimensions are defined in matomo
 * There is a limited number a custom dimension
 * user can create (up to 5). Each dimension has an id (from 1 to 5)
 * @see https://developer.matomo.org/guides/tracking-javascript-guide#custom-dimensions
 */
export enum CustomDimensions {
	Deployment = 1,
	Role = 2,
}

export function setCustomDimension(id: CustomDimensions, value: string): void {
	_push(['setCustomDimension', id.toString(), value]);
}

export function deleteCustomDimension(id: CustomDimensions): void {
	_push(['deleteCustomDimension', id.toString()]);
}

/**
 * push allow access directly to push
 *
 */
export function _push(params: string[]): void {
	if (!window._paq) {
		window._paq = [];
	}
	window._paq.push(params);
}
