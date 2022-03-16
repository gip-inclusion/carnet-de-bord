require('isomorphic-fetch');

it('should check health point', async () => {
	try {
		console.log(process.env.HASURA_GRAPHQL_ENDPOINT + '/healthz');
		const response = await fetch(process.env.HASURA_GRAPHQL_ENDPOINT + '/healthz', {
			method: 'GET',
		});

		expect(response.ok).toBeTruthy();
	} catch (error) {
		console.log(error);
	}
});
