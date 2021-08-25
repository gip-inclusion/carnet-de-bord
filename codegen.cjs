module.exports = {
	schema: [
		{
			'http://localhost:5000/v1/graphql': {
				headers: {
					'x-hasura-admin-secret': 'admin'
				}
			}
		}
	],
	documents: ['src/**/*.gql'],
	overwrite: true,
	generates: {
		'./src/lib/graphql/_gen/typed-document-nodes.ts': {
			plugins: [
				'typescript',
				'typescript-operations',
				'typed-document-node',
				'urql-svelte-operations-store'
			]
		}
	},
	config: {
		useTypeImports: true
	},
	hooks: {
		afterAllFileWrite: 'prettier --write'
	}
};
