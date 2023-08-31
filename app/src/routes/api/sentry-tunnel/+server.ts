import { env } from '$env/dynamic/public';
import { error } from '@sveltejs/kit';

export type Params = {
	dsn: URL;
	body: string;
	fetch: typeof fetch;
};
export async function _forwardToSentry({ dsn, body, fetch }: Params) {
	const parts = body.split('\n');
	const first = JSON.parse(parts[0]);
	const requestDsn = new URL(first.dsn);
	const projectId = dsn.pathname.replaceAll('/', '');

	if (dsn.toString() !== requestDsn.toString()) {
		throw error(400, `${requestDsn} is not the sentry dsn we use, rejecting the request`);
	}

	return await fetch(`https://${dsn.hostname}/api/${projectId}/envelope/`, {
		method: 'POST',
		body,
		headers: { 'Content-type': 'application/x-sentry-envelope' },
	});
}

export async function POST({ request, fetch }) {
	return await _forwardToSentry({
		dsn: new URL(env.PUBLIC_SENTRY_DSN),
		body: await request.text(),
		fetch,
	});
}
