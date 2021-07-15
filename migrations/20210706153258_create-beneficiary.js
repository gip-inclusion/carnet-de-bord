/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function up(knex) {
	await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

	return knex.schema.createTable('beneficiary', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.string('caf_number');
		table.string('pe_number');
		table.json('civil_status').notNullable();
		table.json('address').notNullable();
		table.json('contact').notNullable();
	});
}

export async function down(knex) {
	return knex.schema.dropTable('beneficiary');
}
