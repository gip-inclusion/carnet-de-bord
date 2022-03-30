const { Alors, Quand, Soit, USER_TYPES } = require('./fr');

const { I } = inject();

//
const uuid = 'c86dc6b9-8eb9-455e-a483-a2f50810e2ac';

Soit("un utilisateur sur la page d'accueil", () => {
	I.amOnPage('/');
});

Soit("un {string} authentifié avec l'email {string}", async (userType, email) => {
	await loginStub(userType, email);
	I.amOnPage(`/auth/jwt/${uuid}`);
});

Soit('un utilisateur sur la page {string}', (page) => {
	I.amOnPage(`${page}`);
});

Soit('le bénéficiaire {string} qui a cliqué sur le lien de connexion', async (email) => {
	await loginStub('bénéficiaire', email);
	I.amOnPage(`/auth/jwt/${uuid}`);
});

Soit('le pro {string} qui a cliqué sur le lien de connexion', async (email) => {
	await loginStub('pro', email);
	I.amOnPage(`/auth/jwt/${uuid}`);
});

Soit('le pro {string} sur le carnet de {string}', async (email, lastname) => {
	await loginStub('pro', email);
	const notebookId = await goToNotebookForLastname(lastname);
	I.amOnPage(`/auth/jwt/${uuid}?url=/pro/carnet/${notebookId}`);
});

Soit('un {string} {string} ayant déjà fait son onboarding', async (userType, email) => {
	await onboardingSetup(email, userType, true);
});

Soit('un {string} {string} se connectant pour la première fois', async (userType, email) => {
	await onboardingSetup(email, userType, false);
});

//
Quand('je clique sur {string} sous le titre {string}', async (target, header) => {
	const item = locate('*')
		.after(locate('h2').withText(header))
		.find(`//*[text()[contains(.,'${target}')]]`);

	I.click(item);
});

Quand("j'attends {int} secondes", (num) => {
	I.wait(num);
});

Quand('je pause le test', () => {
	pause();
});

Quand('je recherche {string}', (searchText) => {
	I.fillField('search', searchText);
});

Quand('je renseigne {string} dans le champ {string}', (text, input) => {
	I.fillField(input, text);
});

Alors('je vois {string} dans le champ {string}', async (value, fieldLabel) => {
	const fieldId = await I.grabAttributeFrom(`//label[contains(., "${fieldLabel}")]`, 'for');
	I.seeInField(`#${fieldId}`, value);
});

Quand('je clique sur {string}', (text) => {
	I.click(text);
});

Quand('je clique sur {string} dans le volet', (text) => {
	I.click(text, '[role=dialog]');
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

Quand('je télécharge en cliquant sur {string}', (downloadText) => {
	I.handleDownloads();
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

Alors('je vois {string} dans la tuile {string}', (nb, tileText) => {
	const locator = locate('.fr-card').withDescendant(locate('*').withText(tileText));
	I.see(nb, locator);
});

Alors('je vois {string} sur la ligne {string}', (text, ligneText) => {
	const locator = locate('tr').withChild(locate('td').withText(ligneText));
	I.see(text, locator);
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

Quand('je téléverse le fichier {string}', (filename) => {
	I.attachFile('.dropzone input[type=file]', filename);
});

/**
 * Dans ce hook, qui se lance après chaque test,
 * on peut executer des mutations afin de supprimer
 * les données générés suite aux tests.
 */

Before(async (params) => {
	if (params.tags.indexOf('@import_pro') >= 0) {
		await clearProfessionals();
	}
	if (params.tags.indexOf('@deploiement') >= 0) {
		await clearDeployment();
	}
	if (params.tags.indexOf('@import_structures') >= 0) {
		await clearStructures();
	}
});

After((params) => {
	if (/Inscription/.test(params.title)) {
		I.sendMutation(
			`mutation removeUser {
				delete_account(where: {professional: {email: {_eq: "bobslaigue@afpa.fr"}}}) { affected_rows }
				delete_professional(where: {email: {_eq: "bobslaigue@afpa.fr"}}) { affected_rows }
			}`
		);
	} else if (/Modifier le rattachement d'un bénéficiaire/.test(title)) {
		I.sendMutation(`
			mutation ResetReferent {
				delete_notebook_member(where: { notebookId: { _eq: "9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d" } }) { affected_rows }
				update_beneficiary_structure(_set: {structureId: "1c52e5ad-e0b9-48b9-a490-105a4effaaea"} where: { beneficiary: { notebook: {id: {_eq: "9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d"} } } }) { affected_rows }
				insert_notebook_member_one(object: { notebookId: "9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d", memberType:"referent", professionalId:"1a5b817b-6b81-4a4d-9953-26707a54e0e9" }) { id }
			}`);
	} else if (/Modifier plusieurs rattachements de bénéficiaires/.test(title)) {
		I.sendMutation(`
			mutation ResetReferents {
				delete_notebook_member(where: { notebookId: { _in: ["7262db31-bd98-436c-a690-f2a717085c86", "f82fa38e-547a-49cd-b061-4ec9c6f2e1b9"] } }) { affected_rows }
				update_beneficiary_structure(where: { beneficiary: { notebook: { id: { _in: ["7262db31-bd98-436c-a690-f2a717085c86", "f82fa38e-547a-49cd-b061-4ec9c6f2e1b9"] } } } }
				_set: {status: "pending" }) { affected_rows }
			}
			`);
	} else if (/Ré-orienter des bénéficiaires/i.test(title)) {
		I.sendMutation(`
		mutation ResetReferents {
			update_beneficiary_structure(where: { beneficiary: { notebook: { id: { _in: ["fb1f9810-f219-4555-9025-4126cb0684d6", "d235c967-29dc-47bc-b2f3-43aa46c9f54f"] } } } }
			_set: {status: "pending", structureId: "8b71184c-6479-4440-aa89-15da704cc792"}) { affected_rows }
		}
		`);
	} else if (/Définir le référent d'un bénéficiaire/i.test(title)) {
		I.sendMutation(`
		mutation ResetReferents {
			delete_notebook_member(where: { notebookId: { _in: ["7262db31-bd98-436c-a690-f2a717085c86"] } }) { affected_rows }
			update_beneficiary_structure(where: { beneficiary: { notebook: { id: { _in: ["7262db31-bd98-436c-a690-f2a717085c86"] } } } }
			_set: {status: "pending" }) { affected_rows }
		}
		`);
	}
});

async function loginStub(userType, email) {
	const type = USER_TYPES.filter((t) => t.value === userType)[0];
	await I.sendMutation(
		`mutation setAccessToken {
				update_account(where: {${type.code}: {email: {_eq: "${email}"}}} _set: {accessKey: "${uuid}"}) { affected_rows }
		}`
	);
}

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
	return result.data.data.notebook[0].id;
};

async function onboardingSetup(email, userType, onboardingDone) {
	const type = USER_TYPES.filter((t) => t.value === userType)[0];
	return await I.sendMutation(
		`mutation SetupOnboardingFlag {
		  update_account(where: {${type.code}: {email: {_eq: "${email}"}}}, _set: {onboardingDone: ${onboardingDone}}) {
		    affected_rows
		  }
		}`
	);
}

async function clearProfessionals() {
	return await I.sendMutation(
		`mutation ClearProfessionals {
		  delete_account(where: {professional: {email: {_in: ["salome@cd26.fr", "sofia@cd26.fr"]}}}) {
		    affected_rows
		  }
		  delete_professional(where: {email: {_in: ["salome@cd26.fr", "sofia@cd26.fr"]}}) {
		    affected_rows
		  }
		}`
	);
}

async function clearDeployment() {
	return await I.sendMutation(
		`mutation ClearDeployment {
		  delete_account(where: {manager: {email: {_eq: "experimentation-e2e@noreply.beta.gouv.fr"}}}) {
		    affected_rows
		  }
		  delete_manager(where: {email: {_eq: "experimentation-e2e@noreply.beta.gouv.fr"}}) {
		    affected_rows
		  }
		  delete_deployment(where: {label: {_eq: "expérimentation e2e"}}) {
		    affected_rows
		  }
		}`
	);
}

// TODO delete admin_structure_structure before structure
async function clearStructures() {
	return await I.sendMutation(
		`mutation ClearStructures {
	    delete_admin_structure_structure(where: {admin_structure: {email: {_eq: "jean.paul@drome.fr"}}}) {
		    affected_rows
		  }
		  delete_structure(where: {name: {_eq: "CD 26"}}) {
		    affected_rows
		  }
		  delete_account(where: {admin_structure: {email: {_eq: "jean.paul@drome.fr"}}}) {
		    affected_rows
		  }
		  delete_admin_structure(where: {email: {_eq: "jean.paul@drome.fr"}}) {
		    affected_rows
		  }
		}`
	);
}
