import { _forwardToSentry } from './+server';

describe('Sentry tunnel', () => {
	it('fowards to sentry', async () => {
		const fakeFetch = vi.fn();
		const body = `
{"event_id":"6e193188f6fd4f9cb647a7e852e7c05b","sent_at":"2023-08-28T14:48:45.788Z","sdk":{"name":"sentry.javascript.svelte","version":"7.46.0"},"dsn":"https://1793e2fe81b04f5aad6e75e0372c9a12@sentry.fabrique.social.gouv.fr/63"}
{"type":"event"}
`.trim();
		await _forwardToSentry({
			dsn: new URL('https://1793e2fe81b04f5aad6e75e0372c9a12@sentry.fabrique.social.gouv.fr/63'),
			body,
			fetch: fakeFetch,
		});
		expect(fakeFetch).toHaveBeenCalledWith(
			'https://sentry.fabrique.social.gouv.fr/api/63/envelope/',
			{
				method: 'POST',
				body,
				headers: {
					'Content-type': 'application/x-sentry-envelope',
				},
			}
		);
	});
	it('rejects calls to unknown dsn', async () => {
		const fakeFetch = vi.fn();
		const body = JSON.stringify({ dsn: 'https://unknown.fr' });
		try {
			await _forwardToSentry({
				dsn: new URL('http://lol.com'),
				body,
				fetch: fakeFetch,
			});
		} catch {
			// nothing to do
		}
		expect(fakeFetch).not.toHaveBeenCalled();
	});
});
