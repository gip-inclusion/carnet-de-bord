const { Alors, Quand, Soit } = require('./fr');

const { I } = inject();

//

Soit("un utilisateur sur la page d'accueil", () => {
	I.amOnPage('/');
});

Soit("un utilisateur de type {string} authentifié avec l'email {string}", async (type, email) => {
	const fakeToken = 'c86dc6b9-8eb9-455e-a483-a2f50810e2ac';
	await I.sendMutation(
		`mutation setAccessToken {
				update_account(where: {${type}: {email: {_eq: "${email}"}}} _set: {accessKey: "${fakeToken}"}) { affected_rows }
		}`
	);
	I.amOnPage(`/auth/jwt/${fakeToken}`);
});

Soit('un utilisateur sur la page {string}', (page) => {
	I.amOnPage(`${page}`);
});

Soit('le bénéficiaire {string} qui a cliqué sur le lien de connexion', async (email) => {
	const fakeToken = 'c86dc6b9-8eb9-455e-a483-a2f50810e2ac';
	await I.sendMutation(
		`mutation setAccessToken {
			update_account(where: {beneficiary: {email: {_eq: "${email}"}}} _set: {accessKey: "${fakeToken}"}) { affected_rows }
	}`
	);
	I.amOnPage(`/auth/jwt/${fakeToken}`);
});

const loginPro = async (email) => {
	const fakeToken = 'c86dc6b9-8eb9-455e-a483-a2f50810e2ac';
	await I.sendMutation(
		`mutation setAccessToken {
			update_account(where: {professional: {email: {_eq: "${email}"}}} _set: {accessKey: "${fakeToken}"}) { affected_rows }
	}`
	);
	I.amOnPage(`/auth/jwt/${fakeToken}`);
};

Soit('le pro {string} qui a cliqué sur le lien de connexion', async (email) => {
	await loginPro(email);
});

//

Quand("j'attends {int} secondes", (num) => {
	I.wait(num);
});

Quand('je pause le test', () => {
	pause();
});

Quand('je recherche {string}', (searchText) => {
	I.fillField('q', searchText);
});

Quand('je renseigne {string} dans le champ {string}', async (text, input) => {
	I.fillField(input, text);
});

Quand('je clique sur {string}', async (text) => {
	I.click(text);
});

Quand('je clique sur le texte {string}', async (text) => {
	const item = `//*[text()[contains(., "${text}")]]`;

	I.click(item);
});

Quand('je choisis {string}', (text) => {
	I.checkOption(text);
});

Quand('je ferme la modale', () => {
	I.click('button[title="fermer la modale"]');
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

Quand("j'attend que le texte {string} apparaisse", (text) => {
	I.waitForText(text, 5);
	I.scrollTo(`//*[text()[starts-with(., "${text}")]]`, 0, -100);
});

Quand('je scroll à {string}', (text) => {
	I.scrollTo(`//*[text()[starts-with(., "${text}")]]`, 0, -140);
});

Quand('je télécharge en cliquant sur {string}', (dowloadText) => {
	I.handleDownloads();
	I.click(`//*[text()[starts-with(., "${dowloadText}")]]`);
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

Alors('je vois {string}', (text) => {
	I.see(text);
});

Alors('je ne vois pas {string}', (text) => {
	I.dontSee(text);
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

Alors('le lien {string} pointe sur {string}', (text, url) => {
	I.seeElement(`//a[contains(., "${text}") and contains(@href, "${url}")]`);
});

Alors('je vois {string} fois le {string} {string}', (num, element, text) => {
	I.seeNumberOfVisibleElements(`//${element}[contains(., "${text}")]`, parseInt(num, 10));
});

Alors('je vois {string} suggestions', (num) => {
	I.seeNumberOfVisibleElements("//ul[@role='listbox']//li", parseInt(num, 10));
});

Alors('je vois {string} résultats sous le texte {string}', (num, title) => {
	const target = `following-sibling::*//li//a`;
	const textMatcher = `text()[starts-with(., "${title}")]`;
	I.seeNumberOfVisibleElements(
		`//header[*[${textMatcher}]]/${target} | //div/*[${textMatcher}]/${target}`,
		parseInt(num, 10)
	);
});

Alors('je vois {string} tuiles sous le texte {string}', (num, title) => {
	const target = `following-sibling::*//div//a`;
	const textMatcher = `text()[starts-with(., "${title}")]`;
	I.seeNumberOfVisibleElements(
		`//header[*[${textMatcher}]]/${target} | //div/*[${textMatcher}]/${target}`,
		parseInt(num, 10)
	);
});

Alors('je vois le thème {string}', (theme) => {
	I.seeElement(`//a[text()="${theme}" and starts-with(@href, "/themes/")]`);
});

Alors('je ne vois pas le thème {string}', (theme) => {
	I.dontSeeElement(`//a[text()="${theme}" and starts-with(@href, "/themes/")]`);
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

/**
 * Dans ce hook, qui se lance après chaque test,
 * on peut executer des mutations afin de supprimer
 * les données générés suite aux tests.
 */
After(({ title }) => {
	if (/Inscription/.test(title)) {
		I.sendMutation(
			`mutation removeUser {
	delete_account(where: {professional: {email: {_eq: "bobslaigue@afpa.fr"}}}) { affected_rows }
	delete_professional(where: {email: {_eq: "bobslaigue@afpa.fr"}}) { affected_rows }
}`
		);
	}
});

const goToNotebookForLastname = async (lastname) => {
	const result = await I.sendQuery(
		`
			query GetNotebook($lastname: String!) {
				notebook(where: { beneficiary: { lastname: { _eq: $lastname } } }) {
					id
				}
			}
		`,
		{ lastname }
	);
	const notebookId = result.data.data.notebook[0].id;
	I.amOnPage(`/pro/carnet/${notebookId}`);
};

Soit('le pro {string} sur le carnet de {string}', async (email, lastname) => {
	await loginPro(email);
	await goToNotebookForLastname(lastname);
});

Quand('je clique sur {string} sous le titre {string}', async (target, header) => {
	const item = locate('*')
		.after(locate('h2').withText(header))
		.find(`//*[text()[contains(.,'${target}')]]`);

	I.click(item);
});
