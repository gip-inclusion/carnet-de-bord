/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function seed(knex) {
	return knex('beneficiary')
		.del()
		.then(function () {
			return knex('beneficiary').insert([
				{
					id: 'a81bc81b-dead-4e5d-abff-90865d1e13b1',
					lastname: 'Laroche',
					firstname: 'Jean',
					caf_number: '12345',
					pe_number: '89879',
					mobile_number: '0660203040',
					address1: '26 rue Camille Buffardel',
					postal_code: '26150',
					city: 'Die'
				}
			]);
		});
}
