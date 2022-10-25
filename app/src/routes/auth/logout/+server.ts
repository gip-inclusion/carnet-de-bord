import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = (event) => {
	event.cookies.set('jwt', '', { path: '/', expires: new Date() });
	throw redirect(302, '/');
};
