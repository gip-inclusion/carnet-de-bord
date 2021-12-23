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
	const firstScriptElement = document.getElementsByTagName('script')[0];
	scriptElement.type = 'text/javascript';
	scriptElement.async = true;
	scriptElement.id = 'matomo-script';
	scriptElement.src = `${url}/matomo.js`;

	if (firstScriptElement.parentNode) {
		firstScriptElement.parentNode.insertBefore(scriptElement, firstScriptElement);
	}
}

export function trackPageView(): void {
	_push(['trackPageView']);
}

export function trackSiteSearch(pattern: string, category?: string): void {
	_push(['trackSiteSearch', pattern, category]);
}

/** source: https://developer.matomo.org/guides/tracking-javascript-guide#when-user-logs-out-reset-user-id */
export function disconnectUser(): void {
	// we also force a new visit to be created for the pageviews after logout
	_push(['appendToTrackingUrl', 'new_visit=1']);
	_push(['trackPageView']);
	// we finally make sure to not again create a new visit afterwards (important for Single Page Applications)
	_push(['appendToTrackingUrl', '']);
}

export function trackEvent(category: string, action: string, name?: string, value?: string): void {
	const eventParams = ['trackEvent', category, action, name, value].filter((field) =>
		Boolean(field)
	);
	_push([...eventParams]);
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
