import * as client from '$lib/graphql/adminClient';
import * as emailing from '$lib/emailing';
import type { EndpointOutput } from '@sveltejs/kit';
import { Client, CombinedError } from '@urql/core';
import type { Data, Error } from './loginCheck';
import * as loginCheck from './loginCheck';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

let clientSpy: jest.SpyInstance<Partial<Client>, any>;
let emailerSpy: jest.SpyInstance<Promise<SMTPTransport.SentMessageInfo>, any>;

const toGqlError = (e: string) => new CombinedError({ networkError: Error(e) });
const err = toGqlError('fake error');
const makeBody: (body: Record<string, unknown>) => { request: Request } = (
	body: Record<string, unknown>
) => ({
	request: { json: () => Promise.resolve(body) } as Request,
});

const toResult = (data: any, error = null) => ({
	toPromise: () => Promise.resolve({ data, error }),
});

beforeEach(() => {
	jest.restoreAllMocks();
	jest.spyOn(console, 'info').mockImplementation(jest.fn());
	jest.spyOn(console, 'log').mockImplementation(jest.fn());
	jest.spyOn(console, 'debug').mockImplementation(jest.fn());
	clientSpy = jest.spyOn(client, 'adminClient');
	emailerSpy = jest.spyOn(emailing, 'default').mockImplementation(() => Promise.resolve(null));
	global.fetch = jest
		.fn()
		.mockImplementation(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));
});

describe('/auth/login', () => {
	test.each([undefined, null, '', 0, 1, [], {}])(
		'should respond 400 when the request is malformed: %p',
		async (username) => {
			const result = await loginCheck.post(
				makeBody({
					username,
				})
			);

			expect(result).toEqual<EndpointOutput<Data | Error>>({
				status: 400,
				body: { error: 'INVALID_BODY' },
			});
		}
	);

	test('should respond 500 when there is an error creating a beneficiary for a beneficiary without an account', async () => {
		const beneficiaryForUsernameError = toResult(null, err);
		clientSpy.mockImplementation(() => ({
			query: jest.fn().mockReturnValueOnce(beneficiaryForUsernameError),
		}));

		const username = 'test';
		const result = await loginCheck.post(
			makeBody({
				username,
			})
		);

		expect(result).toEqual<EndpointOutput<Data | Error>>({
			status: 500,
			body: { error: 'SERVER_ERROR' },
		});
	});

	test('should respond 500 when there is an error when searching for beneficiaries without an account', async () => {
		const username = 'test';

		const beneficiaryWithoutAccount = {};
		const beneficiaryForUsernameNone = toResult({ beneficiary: [beneficiaryWithoutAccount] });
		const createBeneficiaryError = toResult(null, err);

		clientSpy.mockImplementation(() => ({
			query: jest.fn().mockReturnValueOnce(beneficiaryForUsernameNone),
			mutation: jest.fn().mockReturnValueOnce(createBeneficiaryError),
		}));

		const result = await loginCheck.post(
			makeBody({
				username,
			})
		);

		expect(result).toEqual<EndpointOutput<Data | Error>>({
			status: 500,
			body: { error: 'SERVER_ERROR' },
		});
	});

	test('should respond 500 when accessKey creation fails', async () => {
		const username = 'test';

		const accountConfirmed = { confirmed: true, beneficiary: {} };
		const beneficiaryForUsernameNone = toResult({ beneficiary: [] });
		const accountByEmailNone = toResult({ account: [] });
		const accountByUsernameConfirmed = toResult({
			account: [accountConfirmed],
		});
		const updatedAccount = toResult(null, err);

		clientSpy.mockImplementation(() => ({
			query: jest
				.fn()
				.mockReturnValueOnce(beneficiaryForUsernameNone)
				.mockReturnValueOnce(accountByEmailNone)
				.mockReturnValueOnce(accountByUsernameConfirmed),
			mutation: jest.fn().mockReturnValueOnce(updatedAccount),
		}));

		const result = await loginCheck.post(
			makeBody({
				username,
			})
		);

		expect(result).toEqual<EndpointOutput<Data | Error>>({
			status: 500,
			body: { error: 'SERVER_ERROR' },
		});
		expect(emailerSpy).toHaveBeenCalledTimes(0);
	});

	test.each([
		['with', 'email', 'confirmed', 'succeeds'],
		['without', 'email', 'unconfirmed', 'is not tried'],
		['with', 'email', 'confirmed', 'fails'],
		['without', 'email', 'unconfirmed', 'is not tried'],
		['with', 'username', 'confirmed', 'succeeds'],
		['without', 'username', 'unconfirmed', 'is not tried'],
		['with', 'username', 'confirmed', 'fails'],
		['without', 'username', 'unconfirmed', 'is not tried'],
		['without', 'nothing', 'N/A', 'is not tried'],
	])(
		'should respond 200 %p an accessUrl in sandbox mode if %p is found (%p) - email notification %p',
		async (withAccessUrl, key, confirm, sendEmail) => {
			const username = 'test';
			const accessKey = 'accessKey';

			let emailingCalls = 0;
			const body: Record<string, string> = {};
			if (withAccessUrl === 'with') {
				body.accessUrl = `/auth/jwt/${accessKey}`;
			}
			const confirmed = confirm === 'confirmed';

			const accountConfirmed = { confirmed, beneficiary: {} };
			const beneficiaryForUsernameNone = toResult({ beneficiary: [] });
			let accountByEmail = toResult({ account: [] });
			let accountByUsername = toResult({ account: [] });
			if (key === 'email') {
				accountByEmail = toResult({
					account: [accountConfirmed],
				});
			} else if (key === 'username') {
				accountByUsername = toResult({
					account: [accountConfirmed],
				});
			}
			const updatedAccount = toResult({ account: { accessKey } });

			clientSpy.mockImplementation(() => ({
				query: jest
					.fn()
					.mockReturnValueOnce(beneficiaryForUsernameNone)
					.mockReturnValueOnce(accountByEmail)
					.mockReturnValueOnce(accountByUsername),
				mutation: jest.fn().mockReturnValueOnce(updatedAccount),
			}));

			if (sendEmail === 'succeeds') {
				emailingCalls = 1;
				emailerSpy = jest
					.spyOn(emailing, 'default')
					.mockImplementation(() => Promise.resolve(null));
			} else if (sendEmail === 'fails') {
				emailingCalls = 1;
				emailerSpy = jest
					.spyOn(emailing, 'default')
					.mockImplementation(() => Promise.reject('fake failure'));
			}

			const result = await loginCheck.post(
				makeBody({
					username,
				})
			);

			expect(result).toEqual<EndpointOutput<Data | Error>>({
				status: 200,
				body,
			});
			expect(emailerSpy).toHaveBeenCalledTimes(emailingCalls);
		}
	);
});
