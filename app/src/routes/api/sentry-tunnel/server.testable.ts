import { error } from '@sveltejs/kit';

export type Params = {
	dsn: URL;
	body: string;
	fetchFn: typeof fetch;
};
export async function forwardToSentry({ dsn, body, fetchFn }: Params) {
	const parts = body.split('\n');
	const first = JSON.parse(parts[0]);
	const requestDsn = new URL(first.dsn);
	const projectId = dsn.pathname.replaceAll('/', '');

	if (dsn.toString() !== requestDsn.toString()) {
		throw error(400, `${requestDsn} is not the sentry dsn we use, rejecting the request`);
	}

	return await fetchFn(`https://${dsn.hostname}/api/${projectId}/envelope/`, {
		method: 'POST',
		body,
		headers: { 'Content-type': 'application/x-sentry-envelope' },
	});
}
