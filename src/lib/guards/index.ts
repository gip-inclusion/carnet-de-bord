import type { LoadInput, LoadOutput } from '@sveltejs/kit';

const LOGIN_PAGE_PATH = '/login';

export async function authGuard({ page, session }: LoadInput): Promise<LoadOutput> {
	if (page.path === "/healthz") {
    return {};
  }
	if (!session.user && page.path !== LOGIN_PAGE_PATH) {
		return {
			status: 302,
			redirect: LOGIN_PAGE_PATH
		};
	}
	if (session.user && page.path === LOGIN_PAGE_PATH) {
		return {
			status: 302,
			redirect: '/'
		};
	}
	return {};
}

export default {
	authGuard
};
