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
		const addActionMutation = fs.readFileSync(
			path.join(__dirname, '../../src/lib/ui/ProNotebookAction/', '_mutation.gql'),
			'utf8'
		);
		const addActionPayload = await graphqlPro(addActionMutation, {
			targetId: '7bfa2130-fe72-418e-8486-000c171cb853',
			action: 'test',
			status: 'in_progress',
			startingAt: '2023-05-11T00:00:00Z',
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
		const updateSocioProMutation = `
			mutation update_notebook (
					$id: uuid!
					$workSituation: String
			) {
				update: update_notebook_by_pk(
					pk_columns: { id: $id }
					_set: {
						workSituation: $workSituation
					}
				) {
					id
				}
			}
		`;

		await graphqlPro(updateSocioProMutation, {
			id: sofieTifourNotebookId,
			workSituation: 'iae',
		});

		const payload = await graphqlPro(lastModifiedQuery);
		const [member] = payload.data.notebook_member;
		expect(formatDateISO(new Date(member?.lastModifiedAt))).toEqual(formatDateISO(new Date()));
	});
});
