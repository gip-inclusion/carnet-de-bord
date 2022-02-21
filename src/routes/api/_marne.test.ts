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
				focuses: [],
			},
		} as unknown as ServerRequest<unknown, ExternalDeploymentApiBody>);
		expect(global.fetch).toHaveBeenCalledWith('service.url/BE/LIONEL/01-12-2000', {
			headers: { Authorization: 'bearer 1234567890' },
		});
	});
	test('should parse the data and create new focuses', async () => {
		const expectedBody = {
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
				email: 'marc.sainpat@okinawa.jp',
				peNumber: '0000001',
			},
			focuses: [
				{
					theme: 'sante',
					creatorId: 'creator-uuid',
					notebookId: 'notebook-uuid',
					linkedTo: 'cer',
					situations: ["Difficulté d'accès à l'emploi du fait d'un handicap"],
					targets: {
						data: [
							{
								creatorId: 'creator-uuid',
								target: 'Bénéficier de soins',
								actions: {
									data: [
										{
											action: 'Suivi santé',
											createdAt: '2021-10-18',
											creatorId: 'creator-uuid',
											initialId: '123456_AU_188',
											status: 'new',
										},
									],
								},
							},
						],
					},
				},
				{
					theme: 'emploi',
					linkedTo: 'cer',
					notebookId: 'notebook-uuid',
					creatorId: 'creator-uuid',
					situations: ['Dernier emploi : moins de 3 mois'],
					targets: {
						data: [
							{
								creatorId: 'creator-uuid',
								target:
									'Favoriser la mise en relation entre un candidat et un employeur en aidant les bénéficiaires à mieux cibler les emplois de proximité',
								actions: {
									data: [
										{
											action: 'PLATEFORME actif51',
											createdAt: '2021-10-18',
											initialId: '123456_CO_53',
											status: 'new',
											creatorId: 'creator-uuid',
										},
									],
								},
							},
						],
					},
				},
			],
			targets: [],
			actions: [],
		};
		const result = await post({
			body: {
				url: 'service.url',
				headers: { Authorization: 'bearer 1234567890' },
				input: {
					firstname: 'lionel',
					lastname: 'be',
					dateOfBirth: '2000-12-01',
				},
				notebookId: 'notebook-uuid',
				professionalId: 'creator-uuid',
				focuses: [],
			},
		} as unknown as ServerRequest<unknown, ExternalDeploymentApiBody>);

		expect(result).toEqual<EndpointOutput<ExternalDeploymentApiOutput>>({
			status: 200,
			body: expectedBody,
		});
	});

	test('should parse the data and create new target', async () => {
		const expectedBody = {
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
				email: 'marc.sainpat@okinawa.jp',
				peNumber: '0000001',
			},
			focuses: [
				{
					id: 'focus_uuid',
					situations: ['previous situation', "Difficulté d'accès à l'emploi du fait d'un handicap"],
				},
				{
					linkedTo: 'cer',
					theme: 'emploi',
					notebookId: 'notebookId',
					creatorId: 'uuid',
					situations: ['Dernier emploi : moins de 3 mois'],
					targets: {
						data: [
							{
								creatorId: 'uuid',
								target:
									'Favoriser la mise en relation entre un candidat et un employeur en aidant les bénéficiaires à mieux cibler les emplois de proximité',
								actions: {
									data: [
										{
											action: 'PLATEFORME actif51',
											createdAt: '2021-10-18',
											creatorId: 'uuid',
											initialId: '123456_CO_53',
											status: 'new',
										},
									],
								},
							},
						],
					},
				},
			],
			targets: [
				{
					target: 'Bénéficier de soins',
					creatorId: 'uuid',
					focusId: 'focus_uuid',
					actions: {
						data: [
							{
								createdAt: '2021-10-18',
								action: 'Suivi santé',
								creatorId: 'uuid',
								initialId: '123456_AU_188',
								status: 'new',
							},
						],
					},
				},
			],
			actions: [],
		};
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
				focuses: [
					{
						id: 'focus_uuid',
						linkedTo: 'cer',
						theme: 'sante',
						situations: ['previous situation'],
						targets: [
							{
								id: 'target_uuid',
								target: 'Bilan de santé CMPS',
								actions: [],
							},
						],
					},
				],
			},
		} as unknown as ServerRequest<unknown, ExternalDeploymentApiBody>);

		expect(result).toEqual<EndpointOutput<ExternalDeploymentApiOutput>>({
			status: 200,
			body: expectedBody,
		});
	});

	test('should parse the data and only create new action', async () => {
		const expectedBody = {
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
				email: 'marc.sainpat@okinawa.jp',
				peNumber: '0000001',
			},
			focuses: [
				{
					id: 'focus_uuid',
					situations: ['previous situation', "Difficulté d'accès à l'emploi du fait d'un handicap"],
				},
				{
					theme: 'emploi',
					notebookId: 'notebookId',
					creatorId: 'uuid',
					linkedTo: 'cer',
					situations: ['Dernier emploi : moins de 3 mois'],
					targets: {
						data: [
							{
								creatorId: 'uuid',
								target:
									'Favoriser la mise en relation entre un candidat et un employeur en aidant les bénéficiaires à mieux cibler les emplois de proximité',
								actions: {
									data: [
										{
											createdAt: '2021-10-18',
											action: 'PLATEFORME actif51',
											creatorId: 'uuid',
											initialId: '123456_CO_53',
											status: 'new',
										},
									],
								},
							},
						],
					},
				},
			],
			targets: [],
			actions: [
				{
					targetId: 'target_uuid',
					action: 'Suivi santé',
					creatorId: 'uuid',
					initialId: '123456_AU_188',
					status: 'new',
				},
			],
		};

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
				focuses: [
					{
						id: 'focus_uuid',
						linkedTo: 'cer',
						theme: 'sante',
						situations: ['previous situation'],
						targets: [
							{
								id: 'target_uuid',
								target: 'Bénéficier de soins',
								actions: [],
							},
						],
					},
				],
			},
		} as unknown as ServerRequest<unknown, ExternalDeploymentApiBody>);

		expect(result).toEqual<EndpointOutput<ExternalDeploymentApiOutput>>({
			status: 200,
			body: expectedBody,
		});
	});
});
