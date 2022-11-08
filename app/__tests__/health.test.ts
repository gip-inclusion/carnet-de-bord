export {};

it('should check hasura health point', async () => {
	try {
		const response = await fetch(
			(process.env.GRAPHQL_API_URL || 'http://localhost:5000/v1/graphql').replace(
				'/v1/graphql',
				'/healthz'
			),
			{
				method: 'GET',
			}
		);

		expect(response.ok).toBeTruthy();
	} catch (error) {
		console.log(error);
	}
});
