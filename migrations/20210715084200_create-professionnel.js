/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function up(knex) {
	return knex.schema.createTable('professionnel', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.uuid('structure_id').references('structure.id');
		table.json('etat_civile').notNullable();
		table.json('contact').notNullable();
	});
}

export async function down(knex) {
	return knex.schema.dropTable('professionnel');
}
