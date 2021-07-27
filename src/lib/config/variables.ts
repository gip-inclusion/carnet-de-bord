import { browser } from '$app/env';

export const getGraphqlAPI = (): string => {
	if (browser) {
		return import.meta.env.VITE_GRAPHQL_API_URL;
	}
	return process.env['VITE_GRAPHQL_API_URL'] || import.meta.env.VITE_GRAPHQL_API_URL;
};
