/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function up(knex) {
	return knex.schema.createTable('professional', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.uuid('structure_id').notNullable().references('structure.id');
	});
}

export async function down(knex) {
	return knex.schema.dropTable('professional');
}
