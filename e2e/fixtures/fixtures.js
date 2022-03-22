class CdbFixtures {
	constructor() {}

	static setupByTags(I, tags) {
		if (tags.indexOf('@_tagName') >= 0) {
			console.log('Do something');
		}
	}
}

module.exports = {
	CdbFixtures: CdbFixtures,
};
