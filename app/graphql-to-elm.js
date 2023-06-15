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
		timestamptz: { type: 'Time.Posix', decoder: 'Iso8601.decoder' },
		citext: { type: 'String', decoder: 'Json.Decode.string' },
		jsonb: { type: 'String', decoder: 'Json.Decode.string' },
	},
	scalarEncoders: {
		uuid: { type: 'String', encoder: 'Json.Encode.string' },
		timestamptz: { type: 'Time.Posix', encoder: 'Iso8601.encoder' },
		citext: { type: 'String', encoder: 'Json.Encode.string' },
		jsonb: { type: 'String', encoder: 'Json.Encode.string' },
	},
}).catch((error) => {
	console.error(error);
	process.exit(1);
});
