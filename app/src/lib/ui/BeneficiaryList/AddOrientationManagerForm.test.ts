import { toOrientationManagerOptions } from './AddOrientationManagerForm.svelte';

describe('toOrientationManagerOptions', () => {
	it('uses the full name as the option label', () => {
		const options = toOrientationManagerOptions({
			orientation_manager: [
				{
					id: 'id',
					email: 'toto@toto.fr',
					firstname: 'Jojo',
					account: {
						id: 'account-id',
					},
				},
			],
		});
		expect(options).toMatchInlineSnapshot(`
			[
			  {
			    "label": "Jojo",
			    "name": "account-id",
			  },
			]
		`);
	});
	it('uses the email otherwise', () => {
		const options = toOrientationManagerOptions({
			orientation_manager: [
				{
					id: 'id',
					email: 'toto@toto.fr',
					account: {
						id: 'account-id',
					},
				},
			],
		});
		expect(options).toMatchInlineSnapshot(`
			[
			  {
			    "label": "toto@toto.fr",
			    "name": "account-id",
			  },
			]
		`);
	});
	it('ignores ones with no accounts', () => {
		const options = toOrientationManagerOptions({
			orientation_manager: [
				{
					id: 'id',
					email: 'toto',
				},
			],
		});
		expect(options).toEqual([]);
	});
});
