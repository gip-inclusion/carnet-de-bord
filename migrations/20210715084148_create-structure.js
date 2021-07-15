/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function up(knex) {
	return knex.schema.createTable('structure', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.string('name');
		table.json('address').notNullable();
	});
}

export async function down(knex) {
	return knex.schema.dropTable('structure');
}
