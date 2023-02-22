const {
	loginStub,
	seedDatabase,
	onBoardingSetup,
	goToNotebookForLastName,
	addMember,
} = require('./fixtures');
const { Alors, Quand, Soit } = require('./fr');

const { I } = inject();

// The database is sed before each test
Before(async () => {
	seedDatabase();
});

Soit("un utilisateur sur la page d'accueil", () => {
	I.amOnPage('/');
});

// This function is similar to the I.amOnPage step, except that it does not
// try to collect page load timings, which can cause the step to fail if
// the page automatically navigates away from the requested URL.
function plainGoto(url) {
	return I.usePlaywrightTo('go to URL', async ({ page, options }) => {
		await page.goto(`${options.url}${url}`);
	});
}

Soit("un {string} authentifié avec l'email {string}", async (userType, email) => {
	await onBoardingSetup(userType, email, true);
	const uuid = await loginStub(userType, email);
	await plainGoto(`/auth/jwt/${uuid}`);
	I.click('Continuer sur Carnet de bord');
});

Soit(
	"un {string} authentifié pour la première fois avec l'email {string}",
	async (userType, email) => {
		await onBoardingSetup(userType, email, false);
		const uuid = await loginStub(userType, email);
		await plainGoto(`/auth/jwt/${uuid}`);
		I.click('Continuer sur Carnet de bord');
	}
);

Soit('un utilisateur sur la page {string}', (page) => {
	I.amOnPage(`${page}`);
});

Quand('je vais sur la page {string}', (page) => {
	I.amOnPage(page);
});

Soit('le pro {string} qui a cliqué sur le lien de connexion', async (email) => {
	const uuid = await loginStub('pro', email);
	await plainGoto(`/auth/jwt/${uuid}`);
	I.click('Continuer sur Carnet de bord');
});

Soit('le pro {string} sur le carnet de {string}', async (email, lastname) => {
	const uuid = await loginStub('pro', email);
	const notebookId = await goToNotebookForLastName(lastname);
	await plainGoto(`/auth/jwt/${uuid}?url=/pro/carnet/${notebookId}`);
	I.click('Continuer sur Carnet de bord');
});

Soit(
	"le chargé d'orientation assigné {string} sur le carnet de {string}",
	async (email, lastname) => {
		await onBoardingSetup("chargé d'orientation", email, true);
		const uuid = await loginStub("chargé d'orientation", email);
		const notebookId = await goToNotebookForLastName(lastname);
		await addMember(email, notebookId);
		await plainGoto(`/auth/jwt/${uuid}?url=/orientation/carnets/edition/${notebookId}`);
		I.click('Continuer sur Carnet de bord');
	}
);

Soit("le chargé d'orientation {string} sur le carnet de {string}", async (email, lastname) => {
	await onBoardingSetup("chargé d'orientation", email, true);
	const uuid = await loginStub("chargé d'orientation", email);
	const notebookId = await goToNotebookForLastName(lastname);
	await plainGoto(`/auth/jwt/${uuid}?url=/orientation/carnets/${notebookId}`);
	I.click('Continuer sur Carnet de bord');
});

//

Quand('je clique sur {string} sous le titre {string}', async (target, header) => {
	const item = locate('*')
		.after(locate('h2').withText(header))
		.find(`//*[text()[contains(.,'${target}')]]`);

	I.click(item);
});

Quand('je clique sur la ligne du tableau contenant le texte {string}', (text) => {
	I.click(locate('table tr').withText(text));
});

Quand('je pause le test', () => {
	pause();
});

Quand("je vais sur l'onglet suivant", () => {
	I.switchToNextTab();
});

Quand('je recherche {string}', (searchText) => {
	I.fillField('search', searchText);
});

Quand('je renseigne {string} dans le champ {string}', (text, input) => {
	I.fillField(input, text);
});

Quand('je renseigne la date {string} dans le champ {string}', async (date, input) => {
	I.fillField(input, date);
});

Quand('je clique sur {string}', (text) => {
	I.click(text);
});

Quand('je clique sur {string} dans le volet', (text) => {
	I.click(text, '[role=dialog]');
});

Quand('je clique sur {string} dans la modale', (text) => {
	I.click(text, '.fr-modal__body');
});

Quand('je clique sur le bouton {string}', (text) => {
	I.click(`button[title="${text}"]`);
});

Quand('je clique sur le texte {string}', async (text) => {
	const item = `//*[text()[contains(., "${text}")]]`;

	I.click(item);
});

Quand('je choisis {string}', (text) => {
	I.checkOption(text);
});
Quand('je décoche {string}', (text) => {
	I.uncheckOption(text);
});

Quand('je ferme la modale', () => {
	I.click('button[title="fermer la modale"]');
});

Quand('je ferme le volet', () => {
	I.click('button[title="fermer le panneau"]');
});

Quand("j'attends {int} secondes", (num) => {
	I.wait(num);
});

Quand("j'attends que les suggestions apparaissent", () => {
	I.waitForElement("//ul[@role='listbox']", 3);
});

Quand("j'attends que les résultats de recherche apparaissent", () => {
	I.waitForElement("[aria-label^='Résultats de recherche']", 10);
});

Quand("j'attends que le titre de page {string} apparaisse", (title) => {
	I.scrollPageToTop();
	I.waitForElement(`//h1[contains(., "${title}")]`, 10);
});

Quand("j'attends que le texte {string} apparaisse", (text) => {
	I.waitForText(text, 5);
});

Quand("j'attends que le tableau {string} apparaisse", (text) => {
	I.waitForElement(`//caption[contains(., "${text}")]`, 3);
});

Quand('je scroll à {string}', (text) => {
	I.scrollTo(locate('*').withText(text), 0, -140);
});

Quand('je télécharge en cliquant sur {string}', (downloadText) => {
	I.handleDownloadsToDirectory('output/downloads');
	I.click(`//*[text()[starts-with(., "${downloadText}")]]`);
});

Quand(`je selectionne l'option {string} dans la liste {string}`, (option, select) => {
	I.selectOption(select, option);
});

Quand("j'appuie sur Entrée", () => {
	I.pressKey('Enter');
});

Quand("j'appuie sur {string}", (key) => {
	I.pressKey(key);
});

//

Alors('je vois {string} dans le tableau {string}', (text, tableName) => {
	const locator = locate('tr td').inside(locate('//table/caption').withText(tableName));
	I.see(text, locator);
});

Alors('je vois {string}', (text) => {
	I.see(text);
});

Alors('je vois le bouton {string}', (text) => {
	I.seeElement(`//button[text()="${text}"]`);
});

Alors('je vois le lien {string}', (text) => {
	I.seeElement(`//a[contains(., "${text}")]`);
});

Alors('je vois que bouton {string} est désactivé', (text) => {
	I.seeElement(`//button[text()="${text}" and @disabled]`);
});

Alors('je vois {int} fois le {string} {string}', (num, element, text) => {
	I.seeNumberOfVisibleElements(`//${element}[contains(., "${text}")]`, num);
});

Alors('je vois {string} suggestions', (num) => {
	I.seeNumberOfVisibleElements("//ul[@role='listbox']//li", parseInt(num, 10));
});

Alors('je vois {int} résultats sous le texte {string}', (num, title) => {
	const target = `following-sibling::*//li//a`;
	const textMatcher = `text()[starts-with(., "${title}")]`;
	I.seeNumberOfVisibleElements(
		`//header[*[${textMatcher}]]/${target} | //div/*[${textMatcher}]/${target}`,
		num
	);
});

Alors('je vois {int} lignes dans le tableau {string}', (num, tableName) => {
	const locator = locate('tbody tr').inside(locate('//table/caption').withText(tableName));

	I.seeNumberOfVisibleElements(locator, num);
});

Alors('je vois {string} dans la tuile {string}', (text, tileText) => {
	const locator = locate('.fr-card').withDescendant(locate('*').withText(tileText));
	I.see(text, locator);
});

Alors('je vois {string} dans la tuile {string} sous le titre {string}', (nb, tileText, title) => {
	const locator = locate('.fr-card')
		.withDescendant(locate('*').withText(tileText))
		.inside(locate('*').after(locate('h2').withText(title)));
	I.see(nb, locator);
});

Alors('je vois {string} sur la ligne {string}', (text, ligneText) => {
	const locator = locate('tr').withChild(locate('td').withText(ligneText));
	I.see(text, locator);
});

Alors('je ne vois pas {string} sur la ligne {string}', (text, ligneText) => {
	const locator = locate('tr').withChild(locate('td').withText(ligneText));
	I.dontSee(text, locator);
});

Alors('je vois {string} tuiles sous le texte {string}', (num, title) => {
	const target = `following-sibling::*//div//a`;
	const textMatcher = `text()[starts-with(., "${title}")]`;
	I.seeNumberOfVisibleElements(
		`//header[*[${textMatcher}]]/${target} | //div/*[${textMatcher}]/${target}`,
		parseInt(num, 10)
	);
});

Alors('je vois {string} dans le champ {string}', async (value, fieldLabel) => {
	const fieldId = await I.grabAttributeFrom(`//label[contains(., "${fieldLabel}")]`, 'for');
	I.seeInField(`#${fieldId}`, value);
});

Alors('je vois {string} dans le volet', (text) => {
	I.see(text, '[role=dialog]');
});

Alors('je ne vois pas {string}', (text) => {
	I.dontSee(text);
});

Alors('je vois {string} sous le titre {string}', async (text, title) => {
	const item = locate('*')
		.after(locate('h2').withText(title))
		.find(`//*[text()[contains(.,'${text}')]]`);

	I.see(text, item);
});

Alors('je vois {string} sous {string}', async (text, title) => {
	const item = locate('*').after(locate('span').withText(title));

	I.see(text, item);
});

Alors('je suis sur la page {string}', (url) => {
	I.seeInCurrentUrl(url);
});

Alors("je ne vois pas d'alerte", () => {
	I.dontSee(locate('.ri-alert-line'));
});

Alors('je ne vois pas le thème {string}', (theme) => {
	I.dontSeeElement(`//a[text()="${theme}" and starts-with(@href, "/themes/")]`);
});

Alors('le lien {string} pointe sur {string}', (text, url) => {
	I.seeElement(`//a[contains(., "${text}") and contains(@href, "${url}")]`);
});

Alors('je suis redirigé vers la page : {string}', (url) => {
	// also check search and hash
	I.waitForFunction(
		(url) => window.location.pathname + window.location.search + window.location.hash === url,
		[url],
		10
	);
});

Alors("j'ai téléchargé le fichier {string}", (filename) => {
	I.amInPath('output/downloads');
	I.seeFile(filename);
});

Quand('je téléverse le fichier {string}', (filename) => {
	I.attachFile('.dropzone input[type=file]', filename);
});

Alors('je vois la colonne {string}', (text) => {
	I.seeElement(`//th[contains(., "${text}")]`);
});

Alors('je clique sur {string} dans la tuile {string}', (text, tileText) => {
	const locator = locate('.fr-card').withDescendant(locate('*').withText(tileText));
	I.click(locator.find(`//*[text()[contains(.,'${text}')]]`));
});

Alors('je clique sur {string} dans la ligne de {string}', (text, line) => {
	const locator = locate('table tr').withText(line);
	I.click(locator.find(`//*[text()[contains(.,'${text}')]]`));
});

Alors("l'option {string} est sélectionnée", (text) => {
	I.seeCheckboxIsChecked(text);
});

Alors("l'option {string} n'est pas sélectionnée", (text) => {
	I.dontSeeCheckboxIsChecked(text);
});

Alors('je coche {string}', (text) => {
	I.checkOption(text);
});

Alors('je décoche {string}', (text) => {
	I.uncheckOption(text);
});
