class CdbFixtures {
	constructor() {}

	static setupByTags(I, tags) {
		if (tags.indexOf('@_loginStructureAdmin') >= 0) {
			CdbFixtures.createStructureAdmin(I);
		}
	}

	static cleanUpByTags(tags) {
		if (tags.indexOf('@_loginStructureAdmin') >= 0) {
			CdbFixtures.deleteStructureAdmin();
		}
	}

	static createStructureAdmin(I) {
		I.sendMutation(
			`mutation insert_admin_structure {
			  insert_admin_structure(objects: {firstname: "Vincent", lastname: "Tim", email: "vincent.tim@beta.gouv.fr", deploymentId: "4dab8036-a86e-4d5f-9bd4-6ce88c1940d0"}) {
			    affected_rows
			  }
			}`
		);
	}

	static deleteStructureAdmin() {}
}

module.exports = {
	CdbFixtures: CdbFixtures,
};
