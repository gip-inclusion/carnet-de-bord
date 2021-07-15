/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function seed(knex) {
	return knex('compte')
		.del()
		.then(function () {
			return knex('compte').insert([
				{
					id: 'a81bc81b-dead-4e5d-abff-90865d1e13b4',
					beneficiaire_id: 'a81bc81b-dead-4e5d-abff-90865d1e13b1',
					professionnel_id: 'a81bc81b-dead-4e5d-abff-90865d1e13b3'
				}
			]);
		});
}
