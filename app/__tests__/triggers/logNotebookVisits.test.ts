import { graphql, graphqlAdmin } from '../graphql';
import { getAccountAndJwtForUser } from '../login_as';

const sofieTifourNotebookId = '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d';
const visitedAt = '2023-07-05T12:50:43.669Z';

let accountId;
let graphqlAsPierreChevalier: ReturnType<typeof graphql>;

beforeAll(async () => {
	const { account, token } = await getAccountAndJwtForUser('pierre.chevalier');
	accountId = account.id;
	graphqlAsPierreChevalier = graphql({
		authorization: `Bearer ${token}`,
	});
	await graphqlAdmin(`
		mutation {
			delete_notebook_visit(where: {}){
				affected_rows
			}
		}`);
});

test('it should add a new row in the table notebook_visit', async () => {
	await updateNotebookMemberLastVisit(visitedAt, sofieTifourNotebookId, accountId);
	const logs = await getVisitLogs();
	expect(logs).toMatchInlineSnapshot(`
		[
		  {
		    "accountId": "17434464-5f69-40cc-8172-40160958a33d",
		    "notebookId": "9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d",
		    "visitedAt": "2023-07-05T12:50:43.669+00:00",
		  },
		]
	`);
});

async function updateNotebookMemberLastVisit(visitedAt, notebookId, accountId) {
	await graphqlAsPierreChevalier(
		`mutation($notebookId:uuid!, $accountId: uuid!, $visitedAt: timestamptz!){
			update_notebook_member(
				where: { notebookId: {_eq: $notebookId}, accountId:{_eq: $accountId }}
				_set: {lastVisitedAt: $visitedAt}
			) {affected_rows}}`,
		{ visitedAt, notebookId, accountId }
	);
}

async function getVisitLogs() {
	const response = (await graphqlAdmin(`
		query {
			notebook_visit {
				accountId, notebookId, visitedAt
			}
		}
	`)) as { data: { notebook_visit: [] } };
	return response.data.notebook_visit;
}
