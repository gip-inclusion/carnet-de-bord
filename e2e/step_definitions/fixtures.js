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

async function removeNotebookMemberForBeneficiary(emails) {
	await I.sendMutation(
		`
		mutation deleteNotebookMember($emails: [citext!]!) {
			delete_notebook_member(where: {notebook: {beneficiary: {email: {_in: $emails}}}}) {
				affected_rows
			}
		}
		`,
		{ emails }
	);
}

function seedDatabase() {
	const { execSync } = require("child_process");
	execSync('HASURA_GRAPHQL_ENDPOINT=http://localhost:5001 hasura seed apply --project ../hasura --database-name carnet_de_bord --log-level WARN --no-color');
}

async function setupBeforeFixturesByTags(tags) {
	return;

	for (const tag of tags) {
		switch (tag) {
			case "@pro":
				await resetTifourReferent();
				break;
			case "@onboarding_manager":
				await resetManagerInfo(
					"support.carnet-de-bord+cd93@fabrique.social.gouv.fr"
				);
				break;
			case "@notebook_contract":
				await clearNotebookContract();
				break;
			case "@import_pro":
				await removeProfessionalsFixture();
				break;
			case "@deploiement":
				await removeDeploymentFixture();
				break;
			case "@import_structures":
				await removeStructuresFixture();
				break;
			case "@import_beneficiaires":
				await removeBeneficiariesFixture();
				break;
			case "@rattachement_beneficiaires_via_admin_structure":
				await removeNotebookMemberForBeneficiary([
					"whitley.benjamin@sit.com",
					"katrina.beach@magna.com",
					"oconnor.carlson@aliqua.fr",
					"corinne.cash@incididunt.com",
					"alexandria.cobb@veniam.com",
				]);
				await resetTifourReferent();
				await resetBeneficiaryStructure(
					[
						"corinne.cash@incididunt.com",
						"alexandria.cobb@veniam.com",
						"whitley.benjamin@sit.com",
						"katrina.beach@magna.com",
					],
					"8b71184c-6479-4440-aa89-15da704cc792" // groupe ns
				);
				await resetBeneficiaryStructure(
					["oconnor.carlson@aliqua.fr"],
					"1c52e5ad-e0b9-48b9-a490-105a4effaaea"
				); // Centre Communal d''action social Livry-Gargan
				break;
			case "@recherche_ajout_metiers":
				await removeWantedJobs();
				break;
			case "@appointments":
				await removeAllAppointments();
				break;
			case "@import_orientation_manager":
				await removeImportedOrientationManager();
				break;
			case "@orientation_manager_rattachement":
				await removeOrientationManagerAssignement("giulia.diaby@cd93.fr");
				break;
			case "@orientation_manager_notebook_edit":
				await removeMember("giulia.diaby@cd93.fr");
				await resetPhone();
				await clearNotebookContract();
				break;
			case "@orientation_manager_notebook_members":
				await removeMember("pcamara@seinesaintdenis.fr");
				break;
			case "@orientation_manager_focuses":
				await resetFocusesFixtures("Aguilar");
				break;
			case "@beneficiary":
				await removeBeneficiariesAccount(["stifour93@yahoo.fr"]);
				break;
			case "@add_admin_pdi":
				// we reset manager info in case onboarding_manager have run before
				await resetManagerInfo(
					"support.carnet-de-bord+cd93@fabrique.social.gouv.fr"
				);
				await removeManager("juste.leblanc@cd93.fr");
				break;
			case "@remove_admin_pdi":
				await addManager(
					"Siham",
					"Froger",
					"siham@froger.fr",
					"c5c3a933-6f4a-4b2b-aa49-7a816eaef16b"
				);
				break;
			case "@admin_structure_notebook_view":
				await removeStructureReferent("Aguilar");
				break;
			case "@modifier_rattachement_beneficiaire":
			case "@orientation_manager_rattachement_beneficiaire":
				await resetTifourReferent();
				await removeNotebookMemberForBeneficiary([
					"corinne.cash@incididunt.com",
					"alexandria.cobb@veniam.com",
				]);
				await resetBeneficiaryStructure(
					["corinne.cash@incididunt.com", "alexandria.cobb@veniam.com"],
					"8b71184c-6479-4440-aa89-15da704cc792" // groupe ns
				);
				break;
			case "@inscription":
				await removeProfessionalAccount();
				break;
			case "@admin_cdb_update_structure":
			case "@manager_update_structure":
				await resetStructureInfo("Interlogement 51");
				await removeProfessionalAccount();
				break;
			case "@professionnel_view":
				await changeAccountConfirmed("bienvenu.lejeune", false);
				break;
			default:
				return;
		}
	}
}

async function setupAfterFixturesByTags(tags) {
	for (const tag of tags) {
		switch (tag) {
			case "@admin_structure_delete_pro_account":
				await undeleteAccount("pierre.chevalier");
				break;
			default:
				return;
		}
	}
}

async function undeleteAccount(username) {
	return await I.sendMutation(
		`mutation undeleteAccount($username: String!) {
			update_account(where: { username: {_eq: $username}}, _set: {deletedAt: null}) {
				affected_rows
			}
		}`,
		{ username }
	);
}

async function resetManagerInfo(email) {
	return await I.sendMutation(
		`mutation resetManagerInfo($email: citext!) {
		  update_manager(where: {email: {_eq: $email}}, _set: {firstname: "Agathe", lastname:"DeBlouze" }) {
		    affected_rows
		  }
		}`,
		{ email }
	);
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
	    delete_admin_structure_structure(where: {admin_structure: {email: {_ilike: "%@cd93.fr"}}}) {
		    affected_rows
		  }
		  delete_structure(where: {name: {_eq: "CD 93"}}) {
		    affected_rows
		  }
		  delete_account(where: {admin_structure: {email: {_ilike: "%@cd93.fr"}}}) {
		    affected_rows
		  }
		  delete_admin_structure(where: {email: {_ilike: "%@cd93.fr"}}) {
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
	return I.sendMutation(
		`mutation removeUser {
			delete_account(where: {professional: {email: {_eq: "bobslaigue@afpa.fr"}}}) { affected_rows }
			delete_professional(where: {email: {_eq: "bobslaigue@afpa.fr"}}) { affected_rows }
		}`
	);
}

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

function resetBeneficiaryStructure(emails, structureId) {
	// reset GroupeNS to beneficiary
	return I.sendMutation(
		`mutation ResetBeneficiaryStructure($emails: [citext!]!, $id: uuid!) {
			update_beneficiary_structure(where: {beneficiary: {email: {_in: $emails}}}, _set: {status: "pending", structureId: $id}) {
				affected_rows
			}
		}`,
		{ emails, id: structureId }
	);
}

function removeAllAppointments() {
	return I.sendMutation(
		`mutation RemoveAppointments {
			delete_notebook_appointment(where: {}) { affected_rows }
		}`
	);
}

function removeImportedOrientationManager() {
	return I.sendMutation(
		`mutation removeOrientationManager {
			delete_account(where: {orientation_manager: {email: {_in:["woirnesse@cd26.fr", "cyane@cd26.fr"]}}}) { affected_rows }
			delete_orientation_manager(where: {email: {_in:["woirnesse@cd26.fr", "cyane@cd26.fr"]}}) { affected_rows }
		}
		`
	);
}

function removeOrientationManagerAssignement(email) {
	return I.sendMutation(
		`mutation removeOrientationManagerAssignement($email: citext!){
			delete_notebook_member(where: { account: {orientation_manager: {email: {_eq: $email}}}}) { affected_rows }
		}
		`,
		{ email }
	);
}

function resetPhone() {
	return I.sendMutation(
		`mutation UpdatePhone {
			update_beneficiary_by_pk(_set: {mobileNumber: "0601010101" },pk_columns: {id: "c6e84ed6-eb31-47f0-bd71-9e4d7843cf0b"}) { __typename }
		}`
	);
}

async function removeBeneficiariesAccount(emails) {
	await I.sendMutation(
		`mutation RemoveBeneficiaryAccountFixture($emails:[citext!]!) {

		  delete_account(where: {beneficiary: {email: {_in: $emails}}}) {
		    affected_rows
		  }
		}`,
		{ emails }
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

async function removeManager(email) {
	await I.sendMutation(
		`mutation RemoveAdminPdi($email: citext!) {
			delete_account(where: {manager: {email: {_eq: $email}}}) { affected_rows }
			delete_manager(where: {email: {_eq: $email}}) { affected_rows }
		}`,
		{ email }
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
async function resetStructureInfo(name) {
	await I.sendMutation(
		`
		mutation updateInterlogement($name: String!) {
			update_structure(where: {name: {_eq: $name }}, _set: {postalCode: null, city:null}) {
				affected_rows
			}
		}
		`,
		{ name }
	);
}

async function removeStructureReferent(email) {
	await I.sendMutation(
		`
		mutation resetStructureReferentFor($email: citext!) {
			delete_beneficiary_structure(where: {beneficiary: {email: {_eq: $email}}}) {
		    affected_rows
		  }
			delete_notebook_member(where: {beneficiary: { email: {_eq: $email}},memberType: {_eq: "referent"} }) {
				affected_rows
			}
		}
	`,
		{ email }
	);
}

async function changeAccountConfirmed(username, newStatus) {
	await I.sendMutation(
		`
          mutation changeAccountConfirmed($username:String!, $newStatus:Boolean!) {
            update_account(where: {username: {_eq: $username }}, _set: {confirmed: $newStatus}) {
              affected_rows
            }
          }`,
		{ newStatus, username }
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
	setupAfterFixturesByTags,
	setupBeforeFixturesByTags,
};
