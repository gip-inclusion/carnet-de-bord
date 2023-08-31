import { describe, it } from 'vitest';
import { structureSchema } from './structure.schema';

describe('structureSchema model', () => {
	it('should return a parsed structure model', async () => {
		expect(
			structureSchema.cast({
				id: '939364c2-d825-4e42-8dac-e7126fdb2f1c',
				siret: '',
				name: 'test lionel',
				sensible: true,
				shortDesc: 'testée',
				phone: '',
				email: '',
				postalCode: '08000',
				city: 'CHARLEVILLE MEZIERES',
				address1: '6 RUE JEAN BAPTISTE LEFORT',
				address2: '',
				website: '',
			})
		).toMatchInlineSnapshot(`
			{
			  "address1": "6 RUE JEAN BAPTISTE LEFORT",
			  "address2": null,
			  "city": "CHARLEVILLE MEZIERES",
			  "email": null,
			  "id": "939364c2-d825-4e42-8dac-e7126fdb2f1c",
			  "name": "test lionel",
			  "phone": null,
			  "postalCode": "08000",
			  "sensible": true,
			  "shortDesc": "testée",
			  "siret": null,
			  "website": null,
			}
		`);
	});
});
