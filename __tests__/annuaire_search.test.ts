require('isomorphic-fetch');

it('should check health point', async () => {
	try {
		const response = await fetch(process.env.VITE_GRAPHQL_API_URL, {
			method: 'POST',
			headers: {
				'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET || 'admin',
				'x-hasura-role': 'professional',
				'x-hasura-user-id': '1a5b817b-6b81-4a4d-9953-26707a54e0e9',
			},
			body: JSON.stringify({
				query: `query SearchNotebookMember($professionalId: uuid!, $filter: String, $visitDate: timestamptz_comparison_exp!) {
  search_notebook_members(
    args: {search: $filter}
    where: {professionalId: {_eq: $professionalId}, lastVisitedAt: $visitDate}
    order_by: {lastModifiedAt: desc_nulls_first}
  ) {
    id
    notebook {
      id
      beneficiary {
        dateOfBirth
        firstname
        id
        lastname
        mobileNumber
        __typename
      }
      __typename
    }
    __typename
  }
}
`,
				variables: {
					filter: '',
					professionalId: '1a5b817b-6b81-4a4d-9953-26707a54e0e9',
					visitDate: {},
				},
			}),
		});
		const { data } = await response.json();
		console.log(response);
		console.log(data);
		expect(response.ok).toBeTruthy();
	} catch (error) {
		console.log(error);
	}
});
