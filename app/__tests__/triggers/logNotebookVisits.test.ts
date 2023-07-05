require('isomorphic-fetch');
import { graphqlAdmin } from '../graphql';

const sofieTifourNotebookId = '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d';
const pierreChevalierAccountId = '17434464-5f69-40cc-8172-40160958a33d';

test('it should add a new row in the table notebook_visit', async () => {
	updateNotebookMemberLastVisit(
		'2023-07-05T12:50:43.669Z',
		sofieTifourNotebookId,
		pierreChevalierAccountId
	);
});

async function updateNotebookMemberLastVisit(date, notebookId, accountId) {
	const response = await graphqlAdmin(
		`mutation updateVisitDate($notebookId:uuid!, $accountId: uuid!, $date: timestamptz!){
			update_notebook_member(
				where: { notebookId: {_eq: $notebookId}, accountId:{_eq: $accountId }}
				_set: {lastVisitedAt: $date}
			){affected_rows}}`,
		{ date, notebookId, accountId }
	);
	return response?.data.account[0]?.id;
}
