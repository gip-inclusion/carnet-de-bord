const fs = require('fs');
const path = require('path');
const Helper = require('@codeceptjs/helper');

// CodeceptJS's Playwright helper does not use the server's suggested
// filename, which makes it impossible to check if it was correctly
// provided.
// This variant creates a file in the provided directory, named like
// the server suggested.
// Also, like the Puppeteer helper's version of handleDownloads, this
// will clear the download directory before the download, to avoid
// false positives.
class Downloads extends Helper {
	async handleDownloadsToDirectory(downloadsDir = 'output/downloads') {
		const { page } = this.helpers.Playwright;

		this.debug('Clearing downloads directory');
		await fs.promises.rm(downloadsDir, { force: true, recursive: true });

		// This unawaited "waitForEvent" promise is sketchy,
		// but I can't think of a cleaner way to subscribe
		// to a future "download" event without blocking
		// the test script. Remember that the expected usage pattern
		// of the helper is:
		//  ```
		//  I.handleDownloadsToDirectory();
		//  I.click('link-to-download');
		//  ```
		// So this helper must resolve before the download has even been started.
		//
		// If the two lines above were reversed (`click` before `handleDownloadsToDirectory`)
		// we could await `page.waitForEvent`, but in that case we
		// would suffer from a race condition — if the download completes
		// between the `click` and the call to `handleDownloadsToDirectory`
		// then we'll never see a `download` event.
		//
		// This also means that this helper cannot meaningfully fail, so
		// `retryFailedStep` can't help us. This is why we have a large
		// timeout on `waitForEvent`, to allow sufficient time for the
		// expected download to complete.
		this.debug('Subscribing to download event');
		this._downloadPromise = page
			.waitForEvent('download', { timeout: 10000 })
			.then(async (download) => {
				const downloadPath = path.join(
					global.codecept_dir,
					downloadsDir,
					path.basename(download.suggestedFilename())
				);
				if (!fs.existsSync(path.dirname(downloadPath))) {
					fs.mkdirSync(path.dirname(downloadPath), '0777');
				}
				const filePath = await download.path();
				fs.copyFileSync(filePath, downloadPath);
				this.debug('Download completed');
				this.debugSection('Downloaded From', await download.url());
				this.debugSection('Downloaded To', downloadPath);
			})
			.catch((err) => {
				this.debugSection('Download failed', err);
			});
	}

	// This hook does a "best effort" to prevent a runaway promise from
	// polluting further tests.
	async _after() {
		if (this._downloadPromise) {
			await this._downloadPromise;
			delete this._downloadPromise;
		}
	}
}

module.exports = Downloads;
