const cdbUrl = 'http://localhost:3000';

describe('Login', () => {
	it('I can request a magic link as a pro', () => {
		const login = 'paul.vercors';

		cy.clearCookies();
		cy.visit(`${cdbUrl}/auth/login`);
		cy.wait(300);
		cy.contains('label', 'Identifiant')
			.invoke('attr', 'for')
			.then((id) => {
				// note that the last Cypress command inside the `cy.then`
				// changes the yielded subject to its result
				cy.get(`#${id}`).type(login);
			});
		cy.get('#login-submit').click();
		cy.contains('Un lien vous a été envoyé');
		cy.get('#resend-magiclink').click();
	});

	it('I can request a magic link as an admin', () => {
		const login = 'admin';

		cy.clearCookies();
		cy.visit(`${cdbUrl}/auth/login`);
		cy.wait(300);
		cy.contains('label', 'Identifiant')
			.invoke('attr', 'for')
			.then((id) => {
				// note that the last Cypress command inside the `cy.then`
				// changes the yielded subject to its result
				cy.get(`#${id}`).type(login);
			});
		cy.get('#login-submit').click();
		cy.contains('Un lien vous a été envoyé');
		cy.get('#resend-magiclink').click();
	});

	it('I get an error message if my username is not recognized', () => {
		const login = 'adminz';

		cy.clearCookies();
		cy.visit(`${cdbUrl}/auth/login`);
		cy.wait(300);
		cy.contains('label', 'Identifiant')
			.invoke('attr', 'for')
			.then((id) => {
				// note that the last Cypress command inside the `cy.then`
				// changes the yielded subject to its result
				cy.get(`#${id}`).type(login);
			});
		cy.get('#login-submit').click();
		cy.contains("Ce nom d'utilisateur n'est pas rattaché");
	});

	it('I can request a link using my email address', () => {
		const email = 'paul.vercors@cdb.org';

		cy.clearCookies();
		cy.visit(`${cdbUrl}/auth/login`);
		cy.wait(300);
		cy.contains('oublié mon identifiant').click();
		cy.contains('Veuillez saisir votre adresse de courriel');
		cy.contains('label', 'Adresse de courriel')
			.invoke('attr', 'for')
			.then((id) => {
				// note that the last Cypress command inside the `cy.then`
				// changes the yielded subject to its result
				cy.get(`#${id}`).type(email);
			});
		cy.get('#email-submit').click();
		cy.contains('Demande de rappel');
		cy.contains("d'identifiant envoyée");
	});
});
