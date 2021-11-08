import type { EndpointOutput } from '@sveltejs/kit';
import type { ServerRequest } from '@sveltejs/kit/types/hooks';
import type {
	ExternalDeploymentApiBody,
	ExternalDeploymentApiOutput,
} from '../actions/update_notebook';
import fixtures from './fixtures.json';
import { post } from './marne';

global.fetch = jest
	.fn()
	.mockImplementation(() => Promise.resolve({ ok: true, json: () => Promise.resolve(fixtures) }));

describe('marne request handler', () => {
	test('should call the correct url', async () => {
		await post({
			body: {
				url: 'service.url',
				headers: { Authorization: 'bearer 1234567890' },
				input: {
					firstname: 'lionel',
					lastname: 'be',
					dateOfBirth: '2000-12-01',
				},
				professionalId: 'uuid',
			},
		} as unknown as ServerRequest<unknown, ExternalDeploymentApiBody>);
		expect(global.fetch).toHaveBeenCalledWith('service.url/BE/LIONEL/01-12-2000', {
			headers: { Authorization: 'bearer 1234567890' },
		});
	});

	test('should parse the data', async () => {
		const result = await post({
			body: {
				url: 'service.url',
				headers: { Authorization: 'bearer 1234567890' },
				input: {
					firstname: 'lionel',
					lastname: 'be',
					dateOfBirth: '2000-12-01',
				},
				notebookId: 'notebookId',
				professionalId: 'uuid',
			},
		} as unknown as ServerRequest<unknown, ExternalDeploymentApiBody>);

		expect(result).toEqual<EndpointOutput<ExternalDeploymentApiOutput>>({
			status: 200,
			body: {
				notebook: {
					rightRsa: 'rsa_droit_ouvert_versable',
					contractSignDate: '2021-10-10',
					contractType: 'cer',
				},
				beneficiary: {
					firstname: 'Marc',
					lastname: 'Sainpat',
					dateOfBirth: '03/11/1980',
					mobileNumber: '0600000911',
					address1: '36 B rue des cerisiers',
					address2: 'chez Mme Tartempion',
					postalCode: '51000',
					city: 'châlons-en-champagne',
					cafNumber: '6660002',
				},
				focuses: [
					{
						theme: 'sante',
						creatorId: 'uuid',
						notebookId: 'notebookId',
						linkedTo: 'CER',
						situations: ["Difficulté d'accès à l'emploi du fait d'un handicap"],
						targets: {
							data: [
								{
									target: 'Suivi Santé',
								},
							],
						},
					},
					{
						theme: 'emploi',
						notebookId: 'notebookId',
						creatorId: 'uuid',
						situations: ['Dernier emploi : moins de 3 mois'],
						targets: {
							data: [
								{
									target: 'Inscription sur actif51',
								},
							],
						},
					},
				],
			},
		});
	});
});
