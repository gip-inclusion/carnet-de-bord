export function post(
	endpoint: string,
	data: unknown,
	headers: Record<string, string> = {}
): Promise<Response> {
	return fetch(endpoint, {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify(data || {}),
		headers: {
			...headers,
			Accept: 'application/json; version=1.0',
			'Content-Type': 'application/json',
		},
	});
}
