/**
 * @jest-environment jsdom
 */

import { prepareEmail } from './';
import { render } from '@testing-library/svelte';

const url = {
	appUrl: 'some-url.com',
	accessKey: 'access-key',
	redirectUrl: 'redirect-to-url.com',
};

describe('creating email', () => {
	describe('login email', () => {
		it('render email template as html string', async () => {
			const { Component, formattedParams } = await prepareEmail({
				template: 'LoginRequest',
				params: [{ url, pro: { firstname: 'Prénom', lastname: 'Nom' } }],
			});

			const email = render(Component, { ...formattedParams }).container.firstChild;

			expect(email).toMatchSnapshot();
		});
	});
});
