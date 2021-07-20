/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function up(knex) {
	await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

	return knex.schema.createTable('beneficiary', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.string('email').notNullable();
		table.unique('email');
		table.string('lastname').notNullable();
		table.string('firstname').notNullable();
		table.string('caf_number');
		table.string('pe_number');
		table.string('postal_code');
		table.string('city');
		table.string('address1');
		table.string('address2');
		table.string('mobile_number');
	});
}

export async function down(knex) {
	return knex.schema.dropTable('beneficiary');
}
