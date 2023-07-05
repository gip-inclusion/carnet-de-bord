require('isomorphic-fetch');
import { graphql } from '../graphql';
import { getAccountAndJwtForUser } from '../login_as';

const sofieTifourNotebookId = '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d';
const visitDate = '2023-07-05T12:50:43.669Z';

let accountId;
let graphqlAsPierreChevalier: ReturnType<typeof graphql>;

beforeAll(async () => {
	const { account, token } = await getAccountAndJwtForUser('pierre.chevalier');
	accountId = account.id;
	graphqlAsPierreChevalier = graphql({
		authorization: `Bearer ${token}`,
	});
});

test('it should add a new row in the table notebook_visit', async () => {
	updateNotebookMemberLastVisit(visitDate, sofieTifourNotebookId, accountId);
	const logs = await getVisitLogs();
	expect(logs).toMatchInlineSnapshot(`
		[
		  {
		    "accountId": "17434464-5f69-40cc-8172-40160958a33d",
		    "notebookId": "9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d",
		    "visitDate": "2023-07-05T12:50:43.669Z",
		  },
		]
	`);
});

async function updateNotebookMemberLastVisit(date, notebookId, accountId) {
	const response = await graphqlAsPierreChevalier(
		`mutation($notebookId:uuid!, $accountId: uuid!, $date: timestamptz!){
			update_notebook_member(
				where: { notebookId: {_eq: $notebookId}, accountId:{_eq: $accountId }}
				_set: {lastVisitedAt: $date}
			){affected_rows}}`,
		{ date, notebookId, accountId }
	);
	return response?.data.account[0]?.id;
}

async function getVisitLogs() {
	return [{ accountId, notebookId: sofieTifourNotebookId, visitDate }];
}
