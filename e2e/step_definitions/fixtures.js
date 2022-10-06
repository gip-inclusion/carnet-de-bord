const { I } = inject();
const { USER_TYPES } = require("./fr");

const UUID = "c86dc6b9-8eb9-455e-a483-a2f50810e2ac";

async function loginStub(userType, email) {
	const type = USER_TYPES.filter((t) => t.value === userType)[0];
	if (type.code === "beneficiary") {
		const result = await I.sendQuery(
			`
		query getBeneficiaryIdByEmail($email: citext!) {
			beneficiary( where: { email: {_eq: $email } }) {
			id
			}
		}`,
			{ email }
		);
		await I.sendMutation(
			`
		mutation createAccount($id: uuid!) {
			insert_account_one(object: {beneficiaryId: $id, accessKey: "${UUID}", type: beneficiary, username: "stifour", onboardingDone: true, confirmed: true}) { id}
		}`,
			{ id: result.data.data.beneficiary[0].id }
		);
	} else {
		await I.sendMutation(
			`mutation setAccessToken {
				update_account(where: {${type.code}: {email: {_eq: "${email}"}}} _set: {accessKey: "${UUID}"}) { affected_rows }
		}`
		);
	}
}

async function addMember(email, notebookId) {
	const result = await I.sendQuery(
		`
		query getAccountIdByEmail($email: citext!) {
			account( where: { _or: [
				{professional: {email: {_eq: $email}}}
				{orientation_manager: {email: {_eq: $email}}}
			]}) {
			id
			}
		}
	`,
		{ email }
	);
	await I.sendMutation(
		`
		mutation insertMember($accountId: uuid!, $notebookId: uuid!) {
			insert_notebook_member_one(object: {
				notebookId:$notebookId,
				accountId: $accountId,
				memberType: "no_referent"
			}) {
				id
			}
		}
		`,
		{ accountId: result.data.data.account[0].id, notebookId }
	);
}

async function removeMember(email) {
	await I.sendMutation(
		`
		mutation deleteNotebookMember($email: citext!) {
			delete_notebook_member(where: {account: {_or: [{professional: {email: {_eq: $email}}}, {orientation_manager: {email: {_eq: $email}}}]}}) {
				affected_rows
			}
		}
		`,
		{ email }
	);
}


function seedDatabase() {
	const { execSync } = require("child_process");
	execSync('HASURA_GRAPHQL_ENDPOINT=http://localhost:5001 hasura seed apply --project ../hasura --database-name carnet_de_bord --log-level WARN --no-color');
}

async function setupBeforeFixturesByTags(tags) {

	for (const tag of tags) {
		switch (tag) {
			case "@pro":
				await resetTifourReferent();
				break;
			case '@orientation_manager_focuses':
				await resetFocusesFixtures('Aguilar');
				break;
			case '@remove_admin_pdi':
				await addManager(
					"Siham",
					"Froger",
					"siham@froger.fr",
					"c5c3a933-6f4a-4b2b-aa49-7a816eaef16b"
				);
				break;
			case '@recherche_ajout_metiers':
				await removeWantedJobs();
				break;
			case '@notebook_contract':
				await clearNotebookContract();
				break;
			case '@appointments':
				await removeAllAppointments();
				break;
			default:
				return;
		}
	}
}

async function onBoardingSetup(userType, email, onBoardingDone) {
	const type = USER_TYPES.filter((t) => t.value === userType)[0];
	return await I.sendMutation(
		`mutation SetupOnboardingFlag {
		  update_account(where: {${type.code}: {email: {_eq: "${email}"}}}, _set: {onboardingDone: ${onBoardingDone}}) {
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

function removeWantedJobs() {
	return I.sendMutation(
		`mutation RemoveWantedJobs {
		  delete_wanted_job(where: {notebook_id: {_eq: "9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d"}}) { __typename }
		}`
	);
}

function resetTifourReferent() {
	// notebook sophie tifour
	// remove notebook members
	// reset structure ccas livry gargan
	// insert members
	return I.sendMutation(
		`mutation ResetReferentTifour {
			delete_notebook_member(where: {  notebookId: { _eq: "9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d" } }) { affected_rows }
			update_beneficiary_structure(_set: {structureId: "1c52e5ad-e0b9-48b9-a490-105a4effaaea"} where: { beneficiary: { notebook: {id: {_eq: "9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d"} } } }) { affected_rows }
			insert_notebook_member(objects: [
				{ notebookId: "9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d", memberType:"referent", accountId:"17434464-5f69-40cc-8172-40160958a33d" },
				{ notebookId: "9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d", memberType:"no_referent", accountId:"a501db53-1b79-4a60-860b-5972bd184f98" }
			]) { affected_rows }
		}`
	);
}

function removeAllAppointments() {
	return I.sendMutation(
		`mutation RemoveAppointments {
			delete_notebook_appointment(where: {}) { affected_rows }
		}`
	);
}

function clearNotebookContract() {
	return I.sendMutation(
		`mutation UpdateNotebookContract {
			update_notebook_by_pk(_set: {contractSignDate: null, contractStartDate: null, contractEndDate: null, contractType: "no"}, pk_columns: {id: "9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d"}) { __typename }
		}`
	);
}

async function resetFocusesFixtures(name) {
	const notebookId = await I.sendQuery(
		`
			query getnotebook($name: String!){
				notebook(where: {beneficiary: {lastname: {_ilike: $name}}}) {id}
			}
	`,
		{ name }
	).then((resp) => resp?.data?.data.notebook[0].id);
	const focusId = "f12f10af-d042-449f-b1d8-fe24f850b3dc";
	const pierreChevalierAccountId = "17434464-5f69-40cc-8172-40160958a33d";
	await I.sendMutation(
		`
			mutation resetNotebook($notebookId: uuid!, $focusId: uuid!, $creatorId: uuid!, $name: String!) {
				delete_notebook_focus(where: {notebook: {beneficiary: {lastname: {_eq: $name}}}}) {affected_rows}
				insert_notebook_focus_one(
					object: {id: $focusId, notebookId: $notebookId, theme: "formation", situations: ["Prêt à suivre une formation"], creatorId: $creatorId}) {
					id
				}
				insert_notebook_target_one(object: {focusId: $focusId, creatorId: $creatorId, target: "Se former"}) {
					id
				}
			}
	`,
		{ creatorId: pierreChevalierAccountId, focusId, name, notebookId }
	);
}

async function addManager(firstname, lastname, email, deployment) {
	await I.sendMutation(
		`
	mutation addAdminPdi($firstname:String!, $lastname:String!, $username:String!, $email: citext!, $deployment: uuid!) {
		insert_manager_one(object: {
			account: {
				data: {
					type: manager,
					username: $username,
					onboardingDone: true,
				}
			}
			deploymentId: $deployment,
			email: $email,
			firstname:$firstname,
			lastname: $lastname,
		}) {
			id
			account {id, type, managerId}
		}
	}`,
		{
			deployment,
			email,
			firstname,
			lastname,
			username: `${firstname}.${lastname}`,
		}
	);
}

module.exports = {
	UUID,
	addMember,
	goToNotebookForLastName,
	loginStub,
	onBoardingSetup,
	removeMember,
	seedDatabase,
	setupBeforeFixturesByTags,
};
