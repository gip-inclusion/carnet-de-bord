import type { EndpointOutput } from '@sveltejs/kit';

export function actionError(message: string, status = 400): EndpointOutput {
	return {
		status,
		body: {
			message: message,
		},
	};
}
