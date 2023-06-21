const Helper = require('@codeceptjs/helper');

class MyHelper extends Helper {
	_before() {
		const { Playwright } = this.helpers;
		Playwright.restartBrowser({ bypass: true });
	}
}

module.exports = MyHelper;
