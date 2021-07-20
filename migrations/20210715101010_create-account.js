/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function up(knex) {
	return knex.schema.createTable('account', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.string('username').notNullable();
		table.unique('username');
		table.string('type').notNullable();
		table.string('access_key').nullable();
		table.timestamp('access_key_date').nullable();
		table.timestamp('last_login').nullable();
		table.uuid('beneficiary_id').references('beneficiary.id');
		table.uuid('professional_id').references('professional.id');
		table.uuid('admin_id').references('admin.id');
	});
}

export async function down(knex) {
	return knex.schema.dropTable('account');
}
