import { backendAPI } from '$lib/stores';
import { get } from 'svelte/store';

const defaultHeaders = {
	Accept: 'application/json; version=1.0',
	'Content-Type': 'application/json',
};
type Data = Record<string, unknown>;
export function post<T = Data>(
	endpoint: string,
	data: unknown,
	headers: Record<string, string> = defaultHeaders
): Promise<T> {
	const shouldStringify = typeof data !== 'string' && !(data instanceof FormData);
	return fetch(`${endpoint}`, {
		method: 'POST',
		credentials: 'include',
		body: shouldStringify ? JSON.stringify(data || {}) : data,
		headers: {
			...headers,
		},
	}).then(handleResponse<T>);
}
export function postApiFormData<T>(
	endpoint: string,
	data: unknown,
	headers: Record<string, string> = defaultHeaders
): Promise<T> {
	return post(`${get(backendAPI)}${endpoint}`, data, headers);
}

export function postApiJson<T>(
	endpoint: string,
	data: unknown,
	headers: Record<string, string> = defaultHeaders
): Promise<T> {
	return post(`${get(backendAPI)}${endpoint}`, data, { ...defaultHeaders, ...headers });
}

async function handleResponse<T>(response: Response): Promise<T> {
	if (response.ok) {
		return response.json();
	}

	if (response.headers.get('Content-type').includes('application/json')) {
		const { message } = await response.json();
		if (message) {
			throw new HTTPError(message, response.status, response.statusText);
		}
	}
	const errorMessage = await response.text();
	throw new HTTPError(errorMessage, response.status, response.statusText);
}

class HTTPError extends Error {
	status: string;
	statusText: string;
	constructor(message, status, statusText) {
		super(message);
		this.status = status;
		this.statusText = statusText;
	}
}
