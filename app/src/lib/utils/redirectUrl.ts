/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { baseUrlForRole, homeForRole } from '$lib/routes';

/* should return null to indicate redirection should not occur */
function redirectUrl(url: URL, session: any): string | null {
	if (['/healthz', '/inscription'].includes(url.pathname)) {
		return null;
	}

	if (url.pathname === '/mentions-legales') {
		return null;
	}

	if (url.pathname === '/politique-confidentialite') {
		return null;
	}

	if (session.user) {
		const { role } = session.user;
		if (url.pathname === '/' || !url.pathname.startsWith(baseUrlForRole(role))) {
			return homeForRole(role);
		}
		return null;
	} else {
		if (url.pathname === '/') {
			return null;
		}
		if (url.pathname.startsWith('/auth')) {
			return null;
		}
		return '/auth/login';
	}
}

export default redirectUrl;
