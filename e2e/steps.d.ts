/// <reference types='codeceptjs' />
type steps_file = typeof import('./steps_file.js');

declare namespace CodeceptJS {
	interface SupportObject {
		I: I;
		current: any;
	}
	interface Methods extends Playwright {}
	interface I extends ReturnType<steps_file> {}
	namespace Translation {
		interface Actions {
			amOutsideAngularApp: 'suisALExtérieurDeLApplicationAngular';
			amInsideAngularApp: 'suisALIntérieurDeLApplicationAngular';
			waitForElement: 'attendsLElément';
			waitForClickable: 'attends';
			waitForVisible: 'attendsPourVoir';
			waitForText: 'attendsLeTexte';
			moveTo: 'vaisSur';
			refresh: 'rafraîchis';
			haveModule: 'ajouteLeModule';
			resetModule: 'réinitialiseLeModule';
			amOnPage: 'suisSurLaPage';
			click: 'cliqueSur';
			doubleClick: 'doubleCliqueSur';
			see: 'vois';
			dontSee: 'neVoisPas';
			selectOption: 'sélectionneUneOption';
			fillField: 'remplisLeChamp';
			pressKey: 'appuisSurLaTouche';
			triggerMouseEvent: 'déclencheLEvénementDeLaSouris';
			attachFile: 'attacheLeFichier';
			seeInField: 'voisDansLeChamp';
			dontSeeInField: 'neVoisPasDansLeChamp';
			appendField: 'ajouteAuChamp';
			checkOption: 'vérifieLOption';
			seeCheckboxIsChecked: 'voisQueLaCaseEstCochée';
			dontSeeCheckboxIsChecked: 'neVoisPasQueLaCaseEstCochée';
			grabTextFrom: 'prendsLeTexteDe';
			grabValueFrom: 'prendsLaValeurDe';
			grabAttributeFrom: 'prendsLAttributDe';
			seeInTitle: 'voisDansLeTitre';
			dontSeeInTitle: 'neVoisPasDansLeTitre';
			grabTitle: 'prendsLeTitre';
			seeElement: 'voisLElément';
			dontSeeElement: 'neVoisPasLElément';
			seeInSource: 'voisDansLeCodeSource';
			dontSeeInSource: 'neVoisPasDansLeCodeSource';
			executeScript: 'exécuteUnScript';
			executeAsyncScript: 'exécuteUnScriptAsynchrone';
			seeInCurrentUrl: 'voisDansLUrl';
			dontSeeInCurrentUrl: 'neVoisPasDansLUrl';
			seeCurrentUrlEquals: 'voisQueLUrlEstEgaleA';
			dontSeeCurrentUrlEquals: 'neVoisPasQueLUrlEstEgaleA';
			saveScreenshot: 'prendsUneCapture';
			setCookie: 'déposeLeCookie';
			clearCookie: 'effaceLeCookie';
			seeCookie: 'voisLeCookie';
			dontSeeCookie: 'neVoisPasLeCookie';
			grabCookie: 'prendsLeCookie';
			resizeWindow: 'redimensionneLaFenêtre';
			wait: 'attends';
		}
	}
}
