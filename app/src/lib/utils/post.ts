import { backendAPI } from '$lib/stores';
import { get } from 'svelte/store';

const defaultHeaders = {
	Accept: 'application/json; version=1.0',
	'Content-Type': 'application/json',
};
export function post(
	endpoint: string,
	data: unknown,
	headers: Record<string, string> = defaultHeaders
): Promise<Response> {
	const shouldStringify = typeof data !== 'string' && !(data instanceof FormData);
	return fetch(`${get(backendAPI)}${endpoint}`, {
		method: 'POST',
		credentials: 'include',
		body: shouldStringify ? JSON.stringify(data || {}) : data,
		headers: {
			...headers,
		},
	});
}
