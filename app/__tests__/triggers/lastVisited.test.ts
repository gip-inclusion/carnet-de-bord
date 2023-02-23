require('isomorphic-fetch');
import fs from 'fs';
import path from 'path';
import { getAccountAndJwtForUser } from '../login_as';
import { formatDateISO } from '../../src/lib/utils/date';
import { graphql, graphqlAdmin } from '../graphql';

let account, token, graphqlPro, lastModifiedQuery;
const sofieTifourNotebookId = '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d';

beforeAll(async () => {
	const data = await getAccountAndJwtForUser('pierre.chevalier');
	account = data.account;
	token = data.token;
	graphqlPro = graphql({
		authorization: `Bearer ${token}`,
	});
	lastModifiedQuery = `query { notebook_member(where: { notebookId: {_eq: "${sofieTifourNotebookId}" } accountId: {_eq: "${account.id}" }}){ lastModifiedAt } }`;
});

describe('lastModified trigger', () => {
	beforeEach(async () => {
		// set initialDate to null
		const updateLastModified = `mutation updateLastModified {
				update_notebook_member(where: {accountId: {_eq: "${account.id}"}}, _set: { lastModifiedAt: null }) { affected_rows }	}`;
		await graphqlAdmin(updateLastModified);
	});

	it('should update notebook_member.lastModified when a focus is added', async () => {
		const addFocusMutation = fs.readFileSync(
			path.join(__dirname, '../../src/lib/ui/ProNotebookFocus/', '_addNotebookFocus.gql'),
			'utf8'
		);
		const addFocusPayload = await graphqlPro(addFocusMutation, {
			notebookId: sofieTifourNotebookId,
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
			delete_notebook_event(where: {event: {_contains: {event_label: "test"}}}) { affected_rows }
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
			delete_notebook_event(where: {event: {_contains: {event_label: "test"}}}) { affected_rows }
		}`;
		await graphqlAdmin(mutation);
	});

	it('should update notebook_member.lastModified when notebook is updated', async () => {
		const updateSocioProMutation = fs.readFileSync(
			path.join(__dirname, '../../src/lib/ui/ProNotebookSocioPro/', '_UpdateSocioPro.gql'),
			'utf8'
		);
		const professionalProjectsQuery = `query {professional_project(where: {notebook_id: {_eq: "${sofieTifourNotebookId}"}}){notebook_id, rome_code_id}}`;
		const professionalProjectsPayload = await graphqlPro(professionalProjectsQuery);

		await graphqlPro(updateSocioProMutation, {
			educationLevel: 'NV4',
			geographicalArea: 20,
			id: sofieTifourNotebookId,
			rightRqth: false,
			professionalProjects: professionalProjectsPayload.data.professional_project,
			workSituation: 'iae',
			workSituationDate: '2021-10-22',
			addedNotebookFocus: [],
			updatedNotebookFocus: [],
		});

		const payload = await graphqlPro(lastModifiedQuery);
		const [member] = payload.data.notebook_member;
		expect(formatDateISO(new Date(member?.lastModifiedAt))).toEqual(formatDateISO(new Date()));
	});
});
