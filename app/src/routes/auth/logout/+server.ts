import { type RequestHandler, redirect } from '@sveltejs/kit';

export const GET: RequestHandler = ({ cookies }) => {
	cookies.set('jwt', '', { path: '/', expires: new Date() });
	throw redirect(302, '/');
};
