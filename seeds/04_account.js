/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function seed(knex) {
	return knex('account')
		.del()
		.then(function () {
			return knex('account').insert([
				{
					email: 'jean.laroche@cdb.fr',
					type: 'beneficiary',
					beneficiary_id: 'a81bc81b-dead-4e5d-abff-90865d1e13b1'
				},
				{
					email: 'paul.vercors@cdb.fr',
					type: 'professional',
					professional_id: 'a81bc81b-dead-4e5d-abff-90865d1e13b3'
				},
				{
					email: 'admin@cdb.fr',
					type: 'admin'
				}
			]);
		});
}
