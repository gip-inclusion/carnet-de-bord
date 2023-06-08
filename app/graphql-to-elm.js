import { graphqlToElm } from 'graphql-to-elm';
import glob from 'glob';
import rimraf from 'rimraf';

rimraf.sync('./elm-generated');
graphqlToElm({
	schema: '../hasura/schema.graphql',
	queries: glob.sync('./elm/**/*.gql'),
	src: './elm',
	dest: './elm-generated',
	enums: {
		baseModule: 'GraphQL.Enum',
	},
	// TODO write smarter encoder/decoders when applicable
	scalarDecoders: {
		...Object.assign(
			...['uuid', 'timestamptz', 'citext', 'date', 'timestamp', 'jsonb'].map((t) => ({
				[t]: { type: 'String', decoder: 'Json.Decode.string' },
			}))
		),
		...Object.assign(
			...['float8'].map((t) => ({
				[t]: { type: 'Float', decoder: 'Json.Decode.float' },
			}))
		),
	},
	scalarEncoders: {
		...Object.assign(
			...['uuid', 'timestamptz', 'citext', 'date', 'timestamp', 'jsonb'].map((t) => ({
				[t]: { type: 'String', encoder: 'Json.Encode.string' },
			}))
		),
	},
	//log: null,
}).catch((error) => {
	console.error(error);
	process.exit(1);
});
