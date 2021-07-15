/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function up(knex) {
	return knex.schema.createTable('account', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.uuid('magic_link_key');
		table.uuid('beneficiary_id').references('beneficiary.id');
		table.uuid('professional_id').references('professional.id');
	});
}

export async function down(knex) {
	return knex.schema.dropTable('account');
}
