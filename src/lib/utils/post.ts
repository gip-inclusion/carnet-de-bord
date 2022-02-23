export function post(endpoint: string, data: unknown): Promise<Response> {
	return fetch(endpoint, {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify(data || {}),
		headers: {
			Accept: 'application/json; version=1.0',
			'Content-Type': 'application/json',
		},
	});
}
