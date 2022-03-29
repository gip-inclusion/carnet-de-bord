class CdbFixtures {
	constructor(I) {
		this.I = I;
	}

	setupByTags(tags, queryParams) {
		if (tags.indexOf('@onboarding_admin_structure') >= 0) {
			this.onboardingSetup(queryParams['email'], 'admin_structure', false);
		}
		if (tags.indexOf('@onboarding_admin_structure_done') >= 0) {
			this.onboardingSetup('admin_structure', true);
		}
	}

	onboardingSetup(email, userType, onboardingDone) {
		this.I.sendMutation(
			`mutation AdminStructureByEmail {
			  update_account(where: {${userType}: {email: {_eq: "${email}"}}}, _set: {onboardingDone: ${onboardingDone}) {
			    affected_rows
			  }
			}`
		);
	}
}

module.exports = {
	CdbFixtures: CdbFixtures,
};
