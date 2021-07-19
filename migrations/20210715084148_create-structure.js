/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function up(knex) {
	return knex.schema.createTable('structure', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.string('siret');
		table.string('name');
		table.text('short_desc');
		table.string('phone');
		table.string('email');
		table.string('postal_code');
		table.string('city');
		table.string('address1');
		table.string('address2');
		table.datetime('creation_date');
		table.datetime('modification_date');
	});
}

export async function down(knex) {
	return knex.schema.dropTable('structure');
}
