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
	const errorMessage = await response.text();
	return Promise.reject(new Error(`${response.status} - ${response.statusText}\n${errorMessage}`));
}
