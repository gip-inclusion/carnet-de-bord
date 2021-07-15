/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function seed(knex) {
	return knex('professional')
		.del()
		.then(function () {
			return knex('professional').insert([
				{
					id: 'a81bc81b-dead-4e5d-abff-90865d1e13b3',
					structure_id: 'a81bc81b-dead-4e5d-abff-90865d1e13b2',
					civil_status: {
						number: 'Monsieur',
						lastname: 'Vercors',
						firstname: 'Paul'
					},
					contact: {
						email: 'paul.vercors@ml.com',
						mobile_number: '0447203040'
					}
				}
			]);
		});
}
