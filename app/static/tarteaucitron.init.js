/* global tarteaucitron */

tarteaucitron.init({
	mandatory: true /* Show a message about mandatory cookies */,
	/* General */
	privacyUrl: '/politique-confidentialite',
	/* Privacy policy url . Si vide, le lien Politique de confidencialité du bandeau ne s'affiche pas*/
	hashtag:
		'#consentement' /* La gestionnaire de consentement s'ouvre avec ce hashtag lorsqu'il est placé dans l'url */,
	cookieName: 'tarteaucitron' /* L'identifiant du cookie déposé sur le poste utilisateur */,
	bodyPosition:
		'top' /* Position à laquelle le gestionnaire - niveau 2 -  est inséré dans la page (top ou bottom). Pour que les technologies d'assistance puisse y acceder rapidement à la navigation, 'top' est la valeur privilégiée. */,
	adblocker: false /* Show a Warning if an adblocker is detected */,
	highPrivacy: true /* Retire le consentement implicite (au scroll ou à la navigation) Activé par défaut, donc on peut le retirer de cette config */,
	handleBrowserDNTRequest: false /* Active ou désactive la prise en compte du Do Not track Navigateur. Si le DNT est activé, aucun cookie n'est déposé */,
	useExternalCss: true /* Active ou non une css custom - désactive ou non la css par défaut */,

	/* Bandeau d'information cookies (niveau 1)*/
	orientation:
		'bottom' /* Position de la bannière de niveau 1 (middle - top - bottom). Si la position est middle, il y a un overlay derrière donc laisser à top ou bottom. */,
	DenyAllCta: true /* Affiche le bouton 'Tout refuser' sur le bandeau de niveau 1 */,
	AcceptAllCta: true /* Affiche le bouton 'Tout accepter' sur le bandeau de niveau 1 */,
	closePopup: false /* ajoute une croix de fermeture */,

	/* Gestionnaire de cookies (niveau 2) */
	removeCredit: true /* Affiche ou non les credit TAC */,
	moreInfoLink: true /*  Affiche ou non le liens vers les infos*/,
	readmoreLink: undefined /* Change the default readmore link pointing to tarteaucitron.io */,
	mandatory: true /* Message à propos des cookies dits fonctionnels  */,

	/* Sticky d'ouverture niveau 2 */
	/* Blocs 'Gestion des cookies' */
	showAlertSmall: false /* 'bouton' sticky (en bas a droite) permettant d'ouvrir le gestionnaire de niveau 2*/,
	cookieslist: false /* Ajoute le nombre de services au 'block' sticky */,
	/* Icone sticky */
	showIcon: false /* affichage du Bouton sticky (icone citron) pour ouvrir le gestionnaire */,
	iconPosition:
		'BottomLeft' /* Position du Bouton sticky BottomRight, BottomLeft, TopRight and TopLeft */,
	groupServices: false,
});

tarteaucitron.lang.alertBigPrivacy = 'toto';
tarteaucitronForceLanguage = 'fr';

tarteaucitron.services.matomocustom = {
	key: 'matomocustom',
	type: 'analytic',
	name: 'Matomo (privacy by design)',
	uri: 'https://matomo.org',
	readmoreLink: 'https://matomo.org/faq/general/faq_146/',
	needConsent: false,
	cookies: ['_pk_ref', '_pk_cvar', '_pk_id', '_pk_ses', '_pk_hsr', 'piwik_ignore', '_pk_uid'],
	js: () => {
		if (tarteaucitron.user.matomoId === undefined) {
			return;
		}
		window._paq = window._paq || [];
		window._paq.push(['requireCookieConsent']);
		window._paq.push(['rememberCookieConsentGiven']);
		window._paq.push(['setSiteId', tarteaucitron.user.matomoId]);
		window._paq.push(['setTrackerUrl', tarteaucitron.user.matomoHost + '/matomo.php']);
		window._paq.push(['trackPageView']);
		window._paq.push(['enableLinkTracking']);

		tarteaucitron.addScript(
			tarteaucitron.user.matomoHost + '/matomo.js',
			'',
			'',
			true,
			'defer',
			true
		);
		var interval = setInterval(function () {
			if (typeof Matomo === 'undefined') return;

			clearInterval(interval);

			// make Matomo cookie accessible by getting tracker
			Matomo.getTracker();

			// looping through cookies
			var theCookies = document.cookie.split(';');
			for (var i = 1; i <= theCookies.length; i++) {
				var cookie = theCookies[i - 1].split('=');
				var cookieName = cookie[0].trim();

				// if cookie starts like a matomo one, register it
				if (cookieName.indexOf('_pk_') === 0) {
					tarteaucitron.services.matomocustom.cookies.push(cookieName);
				}
			}
		}, 100);
	},
	fallback: function () {
		if (tarteaucitron.user.matomoId === undefined) {
			return;
		}

		window._paq = window._paq || [];
		window._paq.push(['requireCookieConsent']);
		window._paq.push(['forgetCookieConsentGiven']);
		window._paq.push(['setSiteId', tarteaucitron.user.matomoId]);
		window._paq.push(['setTrackerUrl', tarteaucitron.user.matomoHost + '/matomo.php']);
		window._paq.push(['trackPageView']);
		window._paq.push(['enableLinkTracking']);

		tarteaucitron.addScript(
			tarteaucitron.user.matomoHost + '/matomo.js',
			'',
			'',
			true,
			'defer',
			true
		);
	},
};

tarteaucitron.services.crispcustom = {
	// Basé sur https://github.com/AmauriC/tarteaucitron.js/pull/281
	// Le support par défaut de Tarte au Citron est insatisfaisant :
	// - acceptation par défaut
	// - mauvaise gestion des cookies dynamiques 'crisp-client/*'
	key: 'crispcustom',
	type: 'support',
	name: 'Crisp (fenêtre de tchat)',
	uri: 'https://crisp.chat/fr',
	readmoreLink: 'https://help.crisp.chat/en/article/whats-crisp-eu-gdpr-compliance-status-nhv54c/',
	needConsent: true,
	cookies: ['crisp-client', '__cfduid'],
	js: () => {
		if (tarteaucitron.user.crispID === undefined) {
			return;
		}

		window.$crisp = [];
		window.CRISP_WEBSITE_ID = tarteaucitron.user.crispID;
		window.CRISP_COOKIE_DOMAIN = window.location.host;

		tarteaucitron.addScript('https://client.crisp.chat/l.js');

		const interval = setInterval(() => {
			if (typeof $crisp === 'undefined') return;
			clearInterval(interval);
			// boucle sur les cookies pour récupérer tous ceux qui commencent
			// par 'crisp-client'
			const theCookies = document.cookie.split(';');
			for (var i = 1; i <= theCookies.length; i++) {
				const cookie = theCookies[i - 1].split('=');
				const cookieName = cookie[0].trim();

				if (cookieName.indexOf('crisp-client') === 0) {
					tarteaucitron.services.crispcustom.cookies.push(cookieName);
				}
			}
		}, 100);
	},
	fallback: () => {
		// nettoyage post refus
		tarteaucitron.fallback(['crisp'], tarteaucitron.engage('crisp'));
		for (const key in localStorage) {
			if (key.startsWith('crisp')) {
				localStorage.removeItem(key);
			}
		}
	},
};
