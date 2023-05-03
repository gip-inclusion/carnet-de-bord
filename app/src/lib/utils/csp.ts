import { env as realPrivateEnv } from '$env/dynamic/private';
import { env as realPublicEnv } from '$env/dynamic/public';

function formatURLForCSP(originalUrl) {
	if (!originalUrl) return;
	const url = new URL(originalUrl);

	return `${url.protocol}//${url.host}`;
}

export function expandURLsInCSP(
	csp,
	privateEnv: Record<string, string> = realPrivateEnv,
	publicEnv: Record<string, string> = realPublicEnv
) {
	return csp.replace(/%(\w+)%/g, (_, varname) => {
		return formatURLForCSP(privateEnv[varname] ?? publicEnv[varname] ?? '');
	});
}
