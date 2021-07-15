/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function seed(knex) {
	return knex('beneficiaire')
		.del()
		.then(function () {
			return knex('beneficiaire').insert([
				{
					id: "a81bc81b-dead-4e5d-abff-90865d1e13b1",
					numero_caf: '12345',
					numero_pe: '89879',
					etat_civile: {
						civilite: 'Monsieur',
						nom: 'Laroche',
						prenom: 'Jean'
					},
					contact: {
						email: 'jean.laroche@cdb.com',
						tel_portable: '0660203040'
					},
					adresse: {
						code_postal: '26150',
						commune: 'Die',
						voie: '26 rue Camille Buffardel'
					}
				}
			]);
		});
}
