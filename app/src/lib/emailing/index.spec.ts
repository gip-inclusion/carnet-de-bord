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

	describe('forgotLogin email', () => {
		it('renders email template as html string', async () => {
			const { Component, formattedParams } = await prepareEmail({
				template: 'ForgotLoginRequest',
				params: [
					{
						url,
						account: {
							firstname: 'Prénom',
							lastname: 'Nom',
							username: 'prenom.nom',
						},
					},
				],
			});

			const email = render(Component, { ...formattedParams }).container.firstChild;

			expect(email).toMatchSnapshot();
		});
	});

	describe('accountRequestValidate email', () => {
		it('renders email template as html string', async () => {
			const { Component, formattedParams } = await prepareEmail({
				template: 'AccountRequestValidate',
				params: [{ url, pro: { firstname: 'Prénom', lastname: 'Nom' } }],
			});

			const email = render(Component, { ...formattedParams }).container.firstChild;

			expect(email).toMatchSnapshot();
		});
	});

	describe('notebookInvitation email', () => {
		it('renders email template as html string without creator info', async () => {
			const { Component, formattedParams } = await prepareEmail({
				template: 'NotebookInvitation',
				params: [{ url, pro: { firstname: 'Prénom', lastname: 'Nom' }, creator: {} }],
			});

			const email = render(Component, { ...formattedParams }).container.firstChild;

			expect(email).toMatchSnapshot();
		});
		it('renders email template as html string with creator info', async () => {
			const { Component, formattedParams } = await prepareEmail({
				template: 'NotebookInvitation',
				params: [
					{
						url,
						pro: { firstname: 'Prénom', lastname: 'Nom' },
						creator: { firstname: 'Prénom du créateur', lastname: 'Nom du créateur' },
					},
				],
			});

			const email = render(Component, { ...formattedParams }).container.firstChild;

			expect(email).toMatchSnapshot();
		});
	});

	describe('accountRequest email', () => {
		it('renders email template as html string', async () => {
			const { Component, formattedParams } = await prepareEmail({
				template: 'AccountRequest',
				params: [
					{
						url,
						pro: {
							firstname: 'Prénom',
							lastname: 'Nom',
							email: 'prenom@nom.org',
							mobileNumber: '06123456789',
							position: 'Président de l‘univers',
						},
						structureName: 'Meilleure structure',
						requester: {
							firstname: 'Prénom du demandeur',
							lastname: 'Nom du demandeur',
						},
					},
				],
			});

			const email = render(Component, { ...formattedParams }).container.firstChild;

			expect(email).toMatchSnapshot();
		});
	});

	describe('accountCreatedByAdmin email', () => {
		it('renders email template as html string', async () => {
			const { Component, formattedParams } = await prepareEmail({
				template: 'AccountCreatedByAdmin',
				params: [
					{
						url,
						account: {
							firstname: 'Prénom',
							lastname: 'Nom',
							username: 'prenom.nom',
						},
					},
				],
			});

			const email = render(Component, { ...formattedParams }).container.firstChild;

			expect(email).toMatchSnapshot();
		});
	});

	describe('adminStructureAccountCreation email', () => {
		it('renders email template as html string', async () => {
			const { Component, formattedParams } = await prepareEmail({
				template: 'AdminStructureAccountCreation',
				params: [
					{
						url,
						email: 'prenom@nom.org',
						account: {
							firstname: 'Prénom',
							lastname: 'Nom',
						},
						structure: 'Meilleure structure',
					},
				],
			});

			const email = render(Component, { ...formattedParams }).container.firstChild;

			expect(email).toMatchSnapshot();
		});
	});

	describe('adminStructureAddedToStructure email', () => {
		it('renders email template as html string', async () => {
			const { Component, formattedParams } = await prepareEmail({
				template: 'AdminStructureAddedToStructure',
				params: [
					{
						url,
						email: 'prenom@nom.org',
						account: {
							firstname: 'Prénom',
							lastname: 'Nom',
						},
						structure: 'Meilleure structure',
					},
				],
			});

			const email = render(Component, { ...formattedParams }).container.firstChild;

			expect(email).toMatchSnapshot();
		});
	});

	describe('managerOnboarding email', () => {
		it('renders email template as html string', async () => {
			const { Component, formattedParams } = await prepareEmail({
				template: 'ManagerOnboarding',
				params: [
					{
						url,
						deployment: 'déploiement',
					},
				],
			});

			const email = render(Component, { ...formattedParams }).container.firstChild;

			expect(email).toMatchSnapshot();
		});
	});
});
