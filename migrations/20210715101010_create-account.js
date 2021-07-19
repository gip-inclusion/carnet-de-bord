/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function up(knex) {
	return knex.schema.createTable('account', (table) => {
		table.string('email').primary();
		table.string('type').notNullable();
		table.string('lastname').notNullable();
		table.string('firstname').notNullable();
		table.string('access_key').nullable();
		table.timestamp('access_key_date').nullable();
		table.timestamp('last_login').nullable();
		table.uuid('beneficiary_id').references('beneficiary.id');
		table.uuid('professional_id').references('professional.id');
	});
}

export async function down(knex) {
	return knex.schema.dropTable('account');
}
