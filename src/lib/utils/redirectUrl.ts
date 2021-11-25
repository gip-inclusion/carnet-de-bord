/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { baseUrlForRole, homeForRole } from '$lib/routes';

/* should return null to indicate redirection should not occur */
function redirectUrl(page: any, session: any): string | null {
	if (['/healthz', '/inscription'].includes(page.path)) {
		return null;
	}

	if (page.path === '/mentions-legales') {
		return null;
	}

	if (page.path === '/politique-confidentialite') {
		return null;
	}

	if (session.user) {
		const { role } = session.user;
		if (page.path === '/' || !page.path.startsWith(baseUrlForRole(role))) {
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
