/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

function redirectUrl(page: any, session: any): string | null {
	if (page.path === '/healthz') {
		return null;
	}
	if (!session.user && !page.path.startsWith('/auth')) {
		return '/auth/login';
	}
	if (session.user && page.path.startsWith('/auth')) {
		return '/';
	}
	return null;
}

export default redirectUrl;
