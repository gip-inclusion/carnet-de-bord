const { I } = inject();
const { USER_TYPES } = require('./fr');

const UUID = 'c86dc6b9-8eb9-455e-a483-a2f50810e2ac';

async function loginStub(userType, email) {
	const type = USER_TYPES.filter((t) => t.value === userType)[0];
	await I.sendMutation(
		`mutation setAccessToken {
				update_account(where: {${type.code}: {email: {_eq: "${email}"}}} _set: {accessKey: "${UUID}"}) { affected_rows }
		}`
	);
}

async function setupFixturesByTags(tags) {
	if (tags.indexOf('@import_pro') >= 0) {
		await removeProfessionalsFixture();
	}
	if (tags.indexOf('@deploiement') >= 0) {
		await removeDeploymentFixture();
	}
	if (tags.indexOf('@import_structures') >= 0) {
		await removeStructuresFixture();
	}
	if (tags.indexOf('@import_beneficiaires') >= 0) {
		await removeBeneficiariesFixture();
	}
	if (tags.indexOf('@rattachement_beneficiaires') >= 0) {
		await removeNotebookMemberFixture();
	}
}

async function onBoardingSetup(email, userType, onboardingDone) {
	const type = USER_TYPES.filter((t) => t.value === userType)[0];
	return await I.sendMutation(
		`mutation SetupOnboardingFlag {
		  update_account(where: {${type.code}: {email: {_eq: "${email}"}}}, _set: {onboardingDone: ${onboardingDone}}) {
		    affected_rows
		  }
		}`
	);
}

async function removeProfessionalsFixture() {
	return await I.sendMutation(
		`mutation RemoveProfessionalsFixture {
		  delete_account(where: {professional: {email: {_in: ["salome@cd26.fr", "sofia@cd26.fr"]}}}) {
		    affected_rows
		  }
		  delete_professional(where: {email: {_in: ["salome@cd26.fr", "sofia@cd26.fr"]}}) {
		    affected_rows
		  }
		}`
	);
}

async function removeDeploymentFixture() {
	return await I.sendMutation(
		`mutation RemoveDeploymentFixture {
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

async function removeStructuresFixture() {
	await removeBeneficiariesFixture();
	return await I.sendMutation(
		`mutation RemoveStructuresFixture {
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

async function removeBeneficiariesFixture() {
	return await I.sendMutation(
		`mutation RemoveBeneficiariesFixture {
		  delete_wanted_job(where: {notebook: {beneficiary: {email: {_in: ["charlotte@laposte.fr", "charlie@ovh.fr"]}}}}) {
		    affected_rows
		  }
		  delete_notebook(where: {beneficiary: {email: {_in: ["charlotte@laposte.fr", "charlie@ovh.fr"]}}}) {
		    affected_rows
		  }
		  delete_beneficiary_structure(where: {beneficiary: {email: {_in: ["charlotte@laposte.fr", "charlie@ovh.fr"]}}}) {
		    affected_rows
		  }
		  delete_beneficiary(where: {email: {_in: ["charlotte@laposte.fr", "charlie@ovh.fr"]}}) {
		    affected_rows
		  }
		}`
	);
}

async function removeNotebookMemberFixture() {
	return await I.sendMutation(
		`mutation RemoveNotebookMemberFixture {
		  delete_notebook_member(where: {professional: {email: {_eq: "pierre.chevalier@livry-gargan.fr"}}, notebookId: {_eq: "b7e43c7c-7c3e-464b-80de-f4926d4bb1e0"}}) {
		    affected_rows
		  }
		}`
	);
}

const goToNotebookForLastName = async (lastname) => {
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

function removeProfessionalAccount() {
	I.sendMutation(
		`mutation removeUser {
				delete_account(where: {professional: {email: {_eq: "bobslaigue@afpa.fr"}}}) { affected_rows }
				delete_professional(where: {email: {_eq: "bobslaigue@afpa.fr"}}) { affected_rows }
			}`
	);
}

module.exports = {
	UUID,
	goToNotebookForLastName,
	loginStub,
	onBoardingSetup,
	removeProfessionalAccount,
	setupFixturesByTags,
};
