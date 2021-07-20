/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function up(knex) {
	return knex.schema.createTable('admin', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.string('email').notNullable();
		table.unique('email');
	});
}

export async function down(knex) {
	return knex.schema.dropTable('admin');
}
