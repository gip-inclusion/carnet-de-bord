require('isomorphic-fetch');

it('should check health point', async () => {
	try {
		const response = await fetch(process.env.HASURA_GRAPHQL_ENDPOINT + '/healthz', {
			method: 'GET',
		});

		expect(response.ok).toBeTruthy();
	} catch (error) {
		console.log(error);
	}
});
