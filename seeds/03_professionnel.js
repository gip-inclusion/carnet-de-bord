/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function seed(knex) {
	return knex('professionnel')
		.del()
		.then(function () {
			return knex('professionnel').insert([
				{
					id: 'a81bc81b-dead-4e5d-abff-90865d1e13b3',
					structure_id: 'a81bc81b-dead-4e5d-abff-90865d1e13b2',
					etat_civile: {
						civilite: 'Monsieur',
						nom: 'Vercors',
						prenom: 'Paul'
					},
					contact: {
						email: 'paul.vercors@ml.com',
						tel_portable: '0447203040'
					}
				}
			]);
		});
}
