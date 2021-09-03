const cdbUrl = 'http://localhost:3000';

describe('Login', () => {
	it('I can request a magic link as a pro', () => {
		const proLogin = 'paul.vercors';

		cy.clearCookies();
		cy.visit(`${cdbUrl}/auth/login`);
		cy.wait(300);
		cy.contains('label', 'Identifiant')
			.invoke('attr', 'for')
			.then((id) => {
				// note that the last Cypress command inside the `cy.then`
				// changes the yielded subject to its result
				cy.get(`#${id}`).type(proLogin);
			});
		cy.get('#login-submit').click();
		cy.contains('Un lien vous a été envoyé');
		cy.get('#resend-magiclink').click();
	});
});
