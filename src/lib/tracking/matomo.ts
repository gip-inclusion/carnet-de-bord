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
	if (document.getElementById('matomo-script')) {
		// early return; we don't need 2 scripts
		return;
	}
	window._paq = window._paq || [];
	window._paq.push(['trackPageView']);
	window._paq.push(['enableLinkTracking']);
	const scriptElement = document.createElement('script');
	const firstScriptElement = document.getElementsByTagName('script')[0];
	scriptElement.type = 'text/javascript';
	scriptElement.async = true;
	scriptElement.id = 'matomo-script';
	scriptElement.src = `${url}/matomo.js`;
	scriptElement.onload = () => {
		window._paq.push(['setTrackerUrl', `${url}/matomo.php`]);
		window._paq.push(['setSiteId', siteId]);
		onMatomoReady();
	};

	if (firstScriptElement.parentNode) {
		firstScriptElement.parentNode.insertBefore(scriptElement, firstScriptElement);
	}
}

function onMatomoReady() {
	console.log(window.Matomo);
}

export function trackPageView(): void {
	_push(['trackPageView']);
}

export function trackEvent(category: string, action: string, name?: string, value?: string): void {
	const eventParams = ['trackEvent', category, action, name, value].filter(Boolean);
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
