/**
 * @jest-environment jsdom
 */

import { createMail } from './';
import { render } from '@testing-library/svelte';

const url = {
	appUrl: 'some-url.com',
	accessKey: 'access-key',
	redirectUrl: 'redirect-to-url.com',
};

describe('creating email', () => {
	describe('login email', () => {
		it('render email template as html string', async () => {
			const email = await createMail({
				template: 'LoginRequest',
				params: [{ url, pro: { firstname: 'Prénom', lastname: 'Nom' } }],
				render,
			});

			expect(email).toMatchSnapshot();
		});
	});
});
