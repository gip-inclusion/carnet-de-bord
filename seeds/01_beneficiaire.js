export async function seed(knex) {
	// Deletes ALL existing entries
	return knex('beneficiaire')
		.del()
		.then(function () {
			// Inserts seed entries
			return knex('beneficiaire').insert([
				{
					id: 1,
					nom: 'Laroche',
					prenom: 'Jean',
					email: 'jean.laroche@cdb.com',
					tel_portable: '0660203040',
					numero_caf: '12345',
					numero_pe: '89879'
				},
				{
					id: 2,
					nom: 'Kurka',
					prenom: 'Clotilde',
					email: 'clo.kurka@cdb.com',
					tel_portable: '0620243077',
					numero_caf: '65789',
					numero_pe: '119087'
				}
			]);
		});
}
