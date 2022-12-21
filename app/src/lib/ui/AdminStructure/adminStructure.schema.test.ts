import { describe, it } from 'vitest';
import { adminStructureAccountSchema } from './adminStructure.schema';

describe('adminStructure schema', () => {
	it('should return a parsed object', () => {
		expect(
			adminStructureAccountSchema.cast({
				firstname: 'Lara',
				lastname: 'Pafromage',
				email: 'lara.pafromage@cd93.fr',
				phoneNumbers: '',
			})
		).toMatchInlineSnapshot(`
			{
			  "email": "lara.pafromage@cd93.fr",
			  "firstname": "Lara",
			  "lastname": "Pafromage",
			  "phoneNumbers": null,
			}
		`);
	});
});
