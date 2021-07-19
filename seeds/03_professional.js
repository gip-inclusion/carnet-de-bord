/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function seed(knex) {
	return knex('professional')
		.del()
		.then(function () {
			return knex('professional').insert([
				{
					id: 'a81bc81b-dead-4e5d-abff-90865d1e13b3',
					lastname: 'Vercors',
					firstname: 'Paul',
					structure_id: 'a81bc81b-dead-4e5d-abff-90865d1e13b2'
				}
			]);
		});
}
