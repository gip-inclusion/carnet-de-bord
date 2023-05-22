require('isomorphic-fetch');
import fs from 'fs';
import path from 'path';
import { graphql, graphqlAdmin } from '../graphql';
import { getAccountAndJwtForUser } from '../login_as';

let token, graphqlPro, eventQuery;
const sofieTifourNotebookId = '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d';

beforeAll(async () => {
	const data = await getAccountAndJwtForUser('pierre.chevalier');
	token = data.token;
	graphqlPro = graphql({
		authorization: `Bearer ${token}`,
	});
	eventQuery = `query { notebook_event(where: {notebookId: {_eq: "${sofieTifourNotebookId}"}}, limit: 1, order_by: {creationDate: desc}) { id, event, eventType }}`;
});
describe('notebook_event trigger', () => {
	it('should create a new event when a target is added', async () => {
		const addTargetMutation = fs.readFileSync(
			path.join(__dirname, '../../src/lib/ui/ProNotebookTarget/', '_mutation.gql'),
			'utf8'
		);
		const addTargetPayload = await graphqlPro(addTargetMutation, {
			focusId: 'a55d1dd2-2b09-4456-bcc5-1412695f684f',
			target: 'test target',
		});
		const payload = await graphqlPro(eventQuery);
		if (addTargetPayload.errors) {
			console.error(addTargetPayload.errors);
		}
		const [{ id, eventType, event }] = payload.data.notebook_event;
		expect(eventType).toEqual('target');
		expect(event).toEqual({
			category: 'logement',
			event_label: 'test target',
			status: 'in_progress',
		});

		// clean created target
		const mutation = `mutation deleteTarget {
			delete_notebook_event_by_pk(id: "${id}") { id }
		delete_notebook_target_by_pk(id: "${addTargetPayload.data.insert_notebook_target_one.id}") { id }
	}`;
		await graphqlAdmin(mutation);
	});

	it('should create a new event when an action is added', async () => {
		const addActiontMutation = fs.readFileSync(
			path.join(__dirname, '../../src/lib/ui/ProNotebookAction/', '_mutation.gql'),
			'utf8'
		);
		const addActionPayload = await graphqlPro(addActiontMutation, {
			targetId: '7bfa2130-fe72-418e-8486-000c171cb853',
			action: 'test action',
			status: 'in_progress',
		});
		if (addActionPayload.errors) {
			console.error(addActionPayload.errors);
		}
		const payload = await graphqlPro(eventQuery);

		const [{ id, eventType, event }] = payload.data.notebook_event;
		expect(eventType).toEqual('action');
		expect(event).toEqual({
			category: 'logement',
			event_label: 'test action',
			status: 'in_progress',
		});

		// clean created action
		const mutation = `mutation deleteAction {
			delete_notebook_event_by_pk(id: "${id}") { id }
			delete_notebook_action_by_pk(id: "${addActionPayload.data.insert_notebook_action_one.id}") { id }
	}`;
		await graphqlAdmin(mutation);
	});
});
