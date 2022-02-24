import type { RequestEvent } from '@sveltejs/kit';

export function request(fn, data) {
	return fn(mockRequest(data));
}

export function mockRequest(data): RequestEvent {
	return {
		url: new URL('https://io.io'),
		locals: {},
		params: {},
		platform: 'test',
		request: {
			formData: null,
			cache: 'default',
			credentials: 'include',
			destination: null,
			headers: null,
			integrity: '',
			keepalive: true,
			method: 'GET',
			mode: 'cors',
			redirect: 'manual',
			referrer: '',
			referrerPolicy: 'origin',
			signal: null,
			clone: () => null,
			body: null,
			bodyUsed: false,
			url: '',
			arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
			blob: () => Promise.resolve(new Blob()),
			text: () => Promise.resolve(`${data}`),
			json: () => Promise.resolve(data),
		},
	};
}
