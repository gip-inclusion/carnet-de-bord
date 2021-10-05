/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { homeForRole } from '$lib/routes';

/* should return null to indicate redirection should not occur */
function redirectUrl(page: any, session: any): string | null {
	if (['/healthz', '/inscription'].includes(page.path)) {
		return null;
	}

	if (session.user) {
		if (page.path === '/') {
			const { role } = session.user;
			return homeForRole(role);
		}
		return null;
	} else {
		if (page.path === '/') {
			return null;
		}
		if (page.path.startsWith('/auth')) {
			return null;
		}
		return '/auth/login';
	}
}

export default redirectUrl;
