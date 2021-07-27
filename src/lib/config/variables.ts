import { browser } from '$app/env';

export const getGraphqlAPI = (): string => {
	return find('VITE_GRAPHQL_API_URL');
};

function find(name: string): string {
	if (browser) {
		return import.meta.env[name];
	}
	return process.env[name] || import.meta.env[name];
}
