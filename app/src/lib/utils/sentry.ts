import { env } from '$env/dynamic/public';
import type { Options } from '@sentry/types';

type SentryInterface = {
	init: (options: Options) => void;
	captureException: (error: Error) => void;
};

let sentry: SentryInterface;

export function initSentry(Sentry: SentryInterface) {
	if (sentry) return;
	if (!env.PUBLIC_SENTRY_DSN) {
		return;
	}
	const appVersion = __version__;

	Sentry.init({
		dsn: env.PUBLIC_SENTRY_DSN,
		environment: env.PUBLIC_SENTRY_ENVIRONMENT || 'local-development',
		release: `carnet-de-bord-app@${appVersion}`,
		autoSessionTracking: false,
	});

	sentry = Sentry;
}

export function captureException(err: Error) {
	console.error(err);
	if (sentry) sentry.captureException(err);
}
