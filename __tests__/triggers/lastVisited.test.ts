require('isomorphic-fetch');
import fs from 'fs';
import path from 'path';
import { getAccountAndJwtForUser } from '../login_as';
import { formatDateISO } from '../../src/lib/utils/date';

const graphql =
	(headers) =>
	async (query, variables = null) => {
		return await fetch(process.env.VITE_GRAPHQL_API_URL, {
			method: 'POST',
			headers,
			body: JSON.stringify({ query, variables }),
		}).then((response) => response.json());
	};

const graphqlAdmin = graphql({
	'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET || 'admin',
});

let account, token, graphqlPro, lastModifiedQuery;

beforeAll(async () => {
	const data = await getAccountAndJwtForUser('pierre.chevalier');
	account = data.account;
	token = data.token;
	graphqlPro = graphql({
		authorization: `Bearer ${token}`,
	});
	lastModifiedQuery = `query { notebook_member(where: {professionalId: {_eq: "${account.professionalId}" }}){ lastModifiedAt } }`;
});

describe('lastModified trigger', () => {
	beforeEach(async () => {
		// set initialDate to null
		const updateLastModified = `mutation updateLastModified {
				update_notebook_member(where: {professionalId: {_eq: "${account.professionalId}"}}, _set: { lastModifiedAt: null }) { affected_rows }	}`;
		await graphqlAdmin(updateLastModified);
	});

	it('should update notebook_member.lastModified when a focus is added', async () => {
		const addFocusMutation = fs.readFileSync(
			path.join(__dirname, '../../src/lib/ui/ProNotebookFocus/', '_addNotebookFocus.gql'),
			'utf8'
		);
		const addFocusPayload = await graphqlPro(addFocusMutation, {
			notebookId: '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d',
			situations: {},
			theme: 'logement',
			linkedTo: '',
		});

		const payload = await graphqlPro(lastModifiedQuery);
		const [member] = payload.data.notebook_member;
		expect(formatDateISO(new Date(member?.lastModifiedAt))).toEqual(formatDateISO(new Date()));

		// clean created focus
		const mutation = `mutation deleteFocus {
			delete_notebook_focus_by_pk(id: "${addFocusPayload.data.insert_notebook_focus_one.id}") { id }
		}`;
		await graphqlAdmin(mutation);
	});

	it('should update notebook_member.lastModified when a target is added', async () => {
		const addTargetMutation = fs.readFileSync(
			path.join(__dirname, '../../src/lib/ui/ProNotebookTarget/', '_mutation.gql'),
			'utf8'
		);
		const addTargetPayload = await graphqlPro(addTargetMutation, {
			focusId: 'a55d1dd2-2b09-4456-bcc5-1412695f684f',
			target: 'test',
		});

		const payload = await graphqlPro(lastModifiedQuery);
		const [member] = payload.data.notebook_member;
		expect(formatDateISO(new Date(member?.lastModifiedAt))).toEqual(formatDateISO(new Date()));

		// clean created target
		const mutation = `mutation deleteTarget {
			delete_notebook_target_by_pk(id: "${addTargetPayload.data.insert_notebook_target_one.id}") { id }
		}`;
		await graphqlAdmin(mutation);
	});

	it('should update notebook_member.lastModified when an action is added', async () => {
		const addActiontMutation = fs.readFileSync(
			path.join(__dirname, '../../src/lib/ui/ProNotebookAction/', '_mutation.gql'),
			'utf8'
		);
		const addActionPayload = await graphqlPro(addActiontMutation, {
			targetId: '7bfa2130-fe72-418e-8486-000c171cb853',
			action: 'test',
			status: 'in_progress',
		});

		const payload = await graphqlPro(lastModifiedQuery);
		const [member] = payload.data.notebook_member;
		expect(formatDateISO(new Date(member?.lastModifiedAt))).toEqual(formatDateISO(new Date()));

		// clean created action
		const mutation = `mutation deleteAction {
			delete_notebook_action_by_pk(id: "${addActionPayload.data.insert_notebook_action_one.id}") { id }
		}`;
		await graphqlAdmin(mutation);
	});

	it('should update notebook_member.lastModified when notebook is updated', async () => {
		const updateSocioProMutation = fs.readFileSync(
			path.join(__dirname, '../../src/lib/ui/ProNotebookSocioPro/', '_UpdateSocioPro.gql'),
			'utf8'
		);
		await graphqlPro(updateSocioProMutation, {
			educationLevel: 'NV4',
			geographicalArea: 'between_10_20',
			id: '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d',
			rightAre: false,
			rightAss: false,
			rightBonus: false,
			rightRqth: false,
			rightRsa: 'rsa_droit_ouvert_et_suspendu',
			wantedJobs: [
				{
					notebook_id: '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d',
					rome_code_id: '5188bf9c-70a8-437d-8415-73189caca8ca',
				},
				{
					notebook_id: '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d',
					rome_code_id: '039a362a-43b3-4b46-9ae5-8276c99e6aa9',
				},
			],
			workSituation: 'iae',
			workSituationDate: '2021-09-22',
		});

		const payload = await graphqlPro(lastModifiedQuery);
		const [member] = payload.data.notebook_member;
		expect(formatDateISO(new Date(member?.lastModifiedAt))).toEqual(formatDateISO(new Date()));
	});
});
