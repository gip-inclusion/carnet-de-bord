require('isomorphic-fetch');
import fs from 'fs';
import path from 'path';

it('GraphQL query should return all user with empty filter', async () => {
	try {
		const query = fs.readFileSync(
			path.join(__dirname, '../src/routes/pro/annuaire/', '_searchNotebookMember.gql'),
			'utf8'
		);
		const response = await fetch(process.env.VITE_GRAPHQL_API_URL, {
			method: 'POST',
			headers: {
				'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET || 'admin',
				'x-hasura-role': 'professional',
				'x-hasura-professional-id': '1a5b817b-6b81-4a4d-9953-26707a54e0e9',
			},
			body: JSON.stringify({
				query: query,
				variables: {
					filter: '',
					professionalId: '1a5b817b-6b81-4a4d-9953-26707a54e0e9',
					visitDate: {},
				},
			}),
		});
		const { data } = await response.json();
		expect(data.search_notebook_members.length).toEqual(1);
		expect(data.search_notebook_members[0].id).toEqual('14c147d0-f94b-4708-be90-0227efc70db7');
	} catch (error) {
		console.log(error);
	}
});
