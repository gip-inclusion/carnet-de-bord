/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function up(knex) {
	await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

	return knex.schema.createTable('beneficiaire', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.string('numero_caf');
		table.string('numero_pe');
		table.json('etat_civile').notNullable();
		table.json('adresse').notNullable();
		table.json('contact').notNullable();
	});
}

export async function down(knex) {
	return knex.schema.dropTable('beneficiaire');
}
