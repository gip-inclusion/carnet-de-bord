/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function seed(knex) {
	return knex('account')
		.del()
		.then(function () {
			return knex('account').insert([
				{
					id: 'a81bc81b-dead-4e5d-abff-90865d1e13b4',
					beneficiary_id: 'a81bc81b-dead-4e5d-abff-90865d1e13b1',
					professional_id: 'a81bc81b-dead-4e5d-abff-90865d1e13b3'
				}
			]);
		});
}
