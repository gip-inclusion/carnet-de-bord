import { browser } from '$app/env';

export const getGraphqlAPI = (): string => {
	return find('VITE_GRAPHQL_API_URL');
};

function find(name: string): string {
	let importEnvVar = import.meta.env[name];
	importEnvVar = typeof importEnvVar === 'string' ? importEnvVar : '';

	if (browser) {
		return importEnvVar;
	}

	const processEnvVar = process?.env[name];
	return processEnvVar || importEnvVar;
}
