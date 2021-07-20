/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function seed(knex) {
	return knex('admin')
		.del()
		.then(function () {
			return knex('admin').insert([
				{
					id: 'a81bc81a-dead-4e5d-abff-90865d1e13b7',
					email: 'admin@cdb.fr'
				}
			]);
		});
}
