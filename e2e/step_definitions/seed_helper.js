const fs = require('fs');
const Helper = require('@codeceptjs/helper');

// This helper "abuses" the built-in and configured GraphQL helper
// to call the Hasura Schema API (/v2/query), which allows executing
// arbitrary SQL and is used by the Hasura CLI when executing
// 'hasura seed apply'.
// Having this helper lets us avoid depending on having the Hasura CLI
// installed to run the tests.
class Seed extends Helper {
	// This is automatically invoked before each test starts
	async _before() {
		try {
			const { GraphQL } = this.helpers;
			const dbName = 'carnet_de_bord';
			const seedSQL = fs.readFileSync(`../hasura/seeds/${dbName}/seed-data.sql`, 'utf-8');
			const { status, data } = await GraphQL._executeQuery({
				baseURL: `${GraphQL.options.endpoint}/../../v2/query`,
				data: {
					args: {
						source: dbName,
						sql: seedSQL,
					},
					type: 'run_sql',
				},
				headers: {},
				method: 'POST',
			});
			if (status != 200) {
				throw new Error(JSON.stringify(data));
			}
		} catch (e) {
			console.error('Error while seeding database:', e.stack);

			// Unfortunately, CodeceptJS will happily continue running a test even if
			// a "before" hook fails, leading to obscure errors. We definitely don't
			// want to go any further if we fail to seed the database, so we just
			// exit the process in the event of such catastrophic failure.
			process.exit(1);
		}
	}
}

module.exports = Seed;
