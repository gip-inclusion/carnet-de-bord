require('isomorphic-fetch');

it('should check hasura health point', async () => {
	try {
		const response = await fetch(
			process.env.VITE_GRAPHQL_API_URL.replace('/v1/graphql', '/healthz'),
			{
				method: 'GET',
			}
		);

		expect(response.ok).toBeTruthy();
	} catch (error) {
		console.log(error);
	}
});
