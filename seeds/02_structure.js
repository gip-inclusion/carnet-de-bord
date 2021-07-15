/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function seed(knex) {
	return knex('structure')
		.del()
		.then(function () {
			return knex('structure').insert([
				{
					id: 'a81bc81b-dead-4e5d-abff-90865d1e13b2',
					name: 'Mission Locale Vallée de la Drôme',
					address: {
						postal_code: '26150',
						city: 'Die',
						address1: '150 Avenue de la Clairette'
					}
				}
			]);
		});
}
