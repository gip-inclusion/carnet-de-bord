import { env } from '$env/dynamic/public';
import { forwardToSentry } from './server.testable';

export async function POST({ request, fetch }) {
	return await forwardToSentry({
		dsn: new URL(env.PUBLIC_SENTRY_DSN),
		body: await request.text(),
		fetch,
	});
}
