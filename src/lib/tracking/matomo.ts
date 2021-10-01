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
	window._paq = window._paq || [];
	window._paq.push(['setDoNotTrack', 'true']);
	window._paq.push(['trackPageView']);
	window._paq.push(['enableLinkTracking']);
	window._paq.push(['setTrackerUrl', `${url}/matomo.php`]);
	window._paq.push(['setSiteId', `${siteId}`]);

	const scriptElement = document.createElement('script');
	const firstScriptElement = document.getElementsByTagName('script')[0];
	scriptElement.type = 'text/javascript';
	scriptElement.async = true;
	scriptElement.id = 'matomo-script';
	scriptElement.src = `${url}/matomo.js`;

	scriptElement.onload = () => {
		onMatomoReady();
	};

	const noscript = document.createElement('noscript');
	noscript.innerHTML = `<p><img src="${url}/matomo.php?idsite=${siteId}&amp;rec=1" style="border:0;" alt="" /></p></noscript>`;

	if (firstScriptElement.parentNode) {
		firstScriptElement.parentNode.insertBefore(noscript, firstScriptElement);
		firstScriptElement.parentNode.insertBefore(scriptElement, noscript);
	}
}

/***
 *
 *

<!-- Matomo -->
<script type="text/javascript">
  var _paq = window._paq = window._paq || [];
  // tracker methods like "setCustomDimension" should be called before "trackPageView"
  _paq.push(["setDoNotTrack", true]);
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u="https://matomo.fabrique.social.gouv.fr/";
    _paq.push(['setTrackerUrl', u+'matomo.php']);
    _paq.push(['setSiteId', '53']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.type='text/javascript'; g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
  })();
</script>
<noscript><p><img src="https://matomo.fabrique.social.gouv.fr/matomo.php?idsite=53&amp;rec=1" style="border:0;" alt="" /></p></noscript>
<!-- End Matomo Code -->


 *
 */
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
