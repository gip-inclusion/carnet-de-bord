const { I } = inject();
import { USER_TYPES } from "./fr";
import { v4 as uuid4 } from "uuid";

async function loginStub(userType, email) {
	const uuid = uuid4();
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
			insert_account_one(object: {beneficiaryId: $id, accessKey: "${uuid}", type: beneficiary, username: "stifour", onboardingDone: true, confirmed: true}) { id}
		}`,
			{ id: result.data.data.beneficiary[0].id }
		);
	} else {
		await I.sendMutation(
			`mutation setAccessToken {
				update_account(where: {${type.code}: {email: {_eq: "${email}"}}} _set: {accessKey: "${uuid}"}) { affected_rows }
		}`
		);
	}
	return uuid;
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
function rejectConsent() {
	I.setCookie({
		domain: "localhost",
		name: "tarteaucitron",
		path: "/",
		value: "!matomocustom=false!crispcustom=false",
	});
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

export {
	addMember,
	goToNotebookForLastName,
	loginStub,
	onBoardingSetup,
	rejectConsent,
	removeMember,
};
