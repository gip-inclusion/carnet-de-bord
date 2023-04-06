import { executeCodegen } from '@graphql-codegen/cli';
import codegenConfig from '../../../codegen.cjs';
import { readFileSync } from 'fs';
import { format, resolveConfig } from 'prettier';
import { env } from '$env/dynamic/private';

it('has an up-to-date typed-document-nodes.ts', async () => {
	const testConfig = JSON.parse(JSON.stringify(codegenConfig));
	const schemaConfig = testConfig.schema.pop()['http://localhost:5000/v1/graphql'];

	expect(testConfig.schema).toHaveLength(0);

	schemaConfig.headers['x-hasura-admin-secret'] = env.HASURA_GRAPHQL_ADMIN_SECRET;
	testConfig.schema.push({
		[env.GRAPHQL_API_URL]: schemaConfig,
	});

	const fileOpts = await executeCodegen(testConfig);
	expect(fileOpts).toHaveLength(1);
	const { filename, content: schemaFromGQL } = fileOpts[0];
	const schemaFromDisk = readFileSync(filename).toString();
	const prettierOptions = await resolveConfig(filename);
	prettierOptions.parser = 'typescript';
	prettierOptions.useTabs = true;
	const expectedCodegen = format(schemaFromGQL, prettierOptions);
	const actualCodegen = schemaFromDisk;
	// Do not use toStrictEqual, it computes the diff of 30k lines files.
	// If this assertion fails, codegen is out of date.
	expect(actualCodegen === expectedCodegen).toBe(true);
}, 10000);
