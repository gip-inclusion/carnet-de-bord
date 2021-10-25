import type { RequestHandler } from '@sveltejs/kit';
import source from './marne.json';

export const post: RequestHandler = async (_request) => {
	return {
		status: 200,
		body: source,
	};
};
