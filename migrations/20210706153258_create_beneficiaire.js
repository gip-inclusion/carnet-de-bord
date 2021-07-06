export async function up(knex) {
	return knex.schema.createTable('beneficiaire', (table) => {
		table.increments('id');
		table.string('nom');
		table.string('prenom');
		table.string('email');
		table.string('tel_portable');
		table.string('numero_caf');
		table.string('numero_pe');
	});
}

export async function down(knex) {
	return knex.schema.dropTable('beneficiaire');
}
