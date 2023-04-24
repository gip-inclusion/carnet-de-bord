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
	headers: Record<string, string> = {
		Accept: 'application/json; version=1.0',
	}
): Promise<T> {
	return post(endpoint, data, headers);
}

export function postApiJson<T>(
	endpoint: string,
	data: unknown,
	headers: Record<string, string> = defaultHeaders
): Promise<T> {
	return post(endpoint, data, { ...defaultHeaders, ...headers });
}

async function handleResponse<T>(response: Response): Promise<T> {
	if (response.ok) {
		if (response.status === 204) {
			return;
		}
		return response.json();
	}

	let errorMessage: string;
	if (response.headers.get('Content-type').includes('application/json')) {
		const errorBody = await response.json();
		errorMessage = errorBody.message ?? errorBody.detail ?? JSON.stringify(errorBody);
	} else {
		errorMessage = await response.text();
	}

	throw new HTTPError(errorMessage, response.status, response.statusText);
}

class HTTPError extends Error {
	status: number;
	statusText: string;
	constructor(message: string, status: number, statusText: string) {
		super(message);
		this.status = status;
		this.statusText = statusText;
	}
}
