import type { EndpointOutput } from '@sveltejs/kit';
import type { ServerRequest } from '@sveltejs/kit/types/hooks';
import type { Login, Data, Error } from './loginCheck';
/* */
import * as loginCheck from './loginCheck';

jest.mock('./loginCheck');

describe('/auth/login', () => {
	test.each([undefined, null, '', 0, 1, [], {}])(
		'should respond 400 when the request is malformed: %p',
		async (username) => {
			const result = await loginCheck.post({
				body: { username },
			} as unknown as ServerRequest<unknown, Login>);

			expect(result).toEqual<EndpointOutput<Data | Error>>({
				status: 400,
				body: { error: 'INVALID_BODY' },
			});
		}
	);

	test.only('should respond 500 when there is an error when searching for beneficiaries without an account', async () => {
		loginCheck.getBeneficiaryForEmail.mockResolvedValue("");
		const username = 'test';
		const result = await loginCheck.post({
			body: { username },
		} as unknown as ServerRequest<unknown, Login>);

		expect(result).toEqual<EndpointOutput<Data | Error>>({
			status: 500,
			body: { error: 'SERVER_ERROR' },
		});
	});

	// test.only('should respond 500 when the first URQL client succeeds and the second fails', async () => {
	//   const data = { beneficiary: [{ id: '' }] };
	//   const error = 'err';
	//   const username = 'test';
	//   const result = await post({
	//     body: { username },
	//   } as unknown as ServerRequest<unknown, Login>);
	//
	//   expect(result).toEqual<EndpointOutput<Data | Error>>({
	//     status: 500,
	//     body: { error: 'SERVER_ERROR' },
	//   });
	// });
});
