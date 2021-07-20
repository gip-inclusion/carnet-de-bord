/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function seed(knex) {
	return knex('account')
		.del()
		.then(function () {
			return knex('account').insert([
				{
					username: 'jean.laroche',
					type: 'beneficiary',
					beneficiary_id: 'a81bc81b-dead-4e5d-abff-90865d1e13b1'
				},
				{
					username: 'paul.vercors',
					type: 'professional',
					professional_id: 'a81bc81b-dead-4e5d-abff-90865d1e13b3'
				},
				{
					username: 'admin',
					type: 'admin',
					admin_id: 'a81bc81a-dead-4e5d-abff-90865d1e13b7'
				}
			]);
		});
}
