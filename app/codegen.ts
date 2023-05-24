import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	schema: '../hasura/schema.graphql',
	documents: ['src/**/*.gql'],
	overwrite: true,
	generates: {
		'./src/lib/graphql/_gen/typed-document-nodes.ts': {
			plugins: [
				'typescript',
				'typescript-operations',
				'typed-document-node',
				'urql-svelte-operations-store',
			],
		},
	},
	config: {
		useTypeImports: true,
		namingConvention: {
			typeNames: 'change-case-all#pascalCase',
			transformUnderscore: true,
		},
		scalars: {
			defaultScalarType: 'unknown',
			date: 'string',
			timestamptz: 'string',
			uuid: 'string',
			citext: 'string',
		},
	},
	hooks: {
		afterAllFileWrite: 'prettier --write',
	},
};

export default config;
