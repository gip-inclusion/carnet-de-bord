export function post(endpoint: string, data: unknown, token?: string): Promise<Response> {
	const auth = token ? { Authorization: `Bearer ${token}` } : {};
	return fetch(endpoint, {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify(data || {}),
		headers: {
			'Content-Type': 'application/json',
			...auth,
		},
	});
}
