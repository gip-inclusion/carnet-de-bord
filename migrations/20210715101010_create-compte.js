/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function up(knex) {
	return knex.schema.createTable('compte', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.uuid('magic_link_key');
		table.uuid('beneficiaire_id').references('beneficiaire.id');
		table.uuid('professionnel_id').references('professionnel.id');
	});
}

export async function down(knex) {
	return knex.schema.dropTable('compte');
}
