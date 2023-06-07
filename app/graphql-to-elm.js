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
		uuid: { type: 'String', decoder: 'Json.Decode.string' },
		timestamptz: { type: 'String', decoder: 'Json.Decode.string' },
		citext: { type: 'String', decoder: 'Json.Decode.string' },
		date: { type: 'String', decoder: 'Json.Decode.string' },
		timestamp: { type: 'String', decoder: 'Json.Decode.string' },
		jsonb: { type: 'String', decoder: 'Json.Decode.string' },
		float8: { type: 'Float', decoder: 'Json.Decode.float' },
	},
	scalarEncoders: {
		uuid: { type: 'String', encoder: 'Json.Encode.string' },
		timestamptz: { type: 'String', encoder: 'Json.Encode.string' },
		citext: { type: 'String', encoder: 'Json.Encode.string' },
		date: { type: 'String', encoder: 'Json.Encode.string' },
		timestamp: { type: 'String', encoder: 'Json.Encode.string' },
		jsonb: { type: 'String', encoder: 'Json.Encode.string' },
		float8: { type: 'Float', encoder: 'Json.Encode.float' },
	},
}).catch((error) => {
	console.error(error);
	process.exit(1);
});
