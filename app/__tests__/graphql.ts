import { env } from '$env/dynamic/private';

export function graphql(headers) {
	return async (query, variables = null) => {
		const response = await fetch(env.GRAPHQL_API_URL, {
			method: 'POST',
			headers,
			body: JSON.stringify({ query, variables }),
		});
		if (response.ok) {
			const { data, errors } = (await response.json()) as { data: unknown; errors: unknown };
			if (errors) {
				throw new Error(`grapqh error: ${JSON.stringify(errors)}`);
			}
			return { data };
		}
	};
}

export const graphqlAdmin = graphql({
	'x-hasura-admin-secret': env.HASURA_GRAPHQL_ADMIN_SECRET,
});
