import fs from 'fs';
import path from 'path';
import { env } from '$env/dynamic/private';

it('GraphQL query should return all user with empty filter', async () => {
	try {
		const query = fs.readFileSync(
			path.join(__dirname, '../src/routes/(auth)/pro/annuaire/', '_searchNotebookMember.gql'),
			'utf8'
		);
		const response = await fetch(env.GRAPHQL_API_URL, {
			method: 'POST',
			headers: {
				'x-hasura-admin-secret': env.HASURA_GRAPHQL_ADMIN_SECRET,
				'x-hasura-role': 'professional',
				'x-hasura-professional-id': '1a5b817b-6b81-4a4d-9953-26707a54e0e9',
				'x-hasura-user-id': '17434464-5f69-40cc-8172-40160958a33d',
				'x-hasura-deployment-id': '4dab8036-a86e-4d5f-9bd4-6ce88c1940d0',
			},
			body: JSON.stringify({
				query: query,
				variables: {
					filter: '',
					accountId: '17434464-5f69-40cc-8172-40160958a33d',
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
