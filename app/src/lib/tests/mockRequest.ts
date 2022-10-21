import type { RequestEvent, RequestHandler } from '@sveltejs/kit';

export default function mockRequest(
	fn: RequestHandler,
	data: unknown,
	headers: Record<string, string> = {}
) {
	return fn(_mockRequest(data, headers));
}

const mockHeader = (headers: Record<string, string> = {}) => {
	const map = new Map(Object.entries(headers));
	return Object.assign(map, { append: () => ({}) });
};

function _mockRequest(data: unknown, headers: Record<string, string> = {}): RequestEvent {
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
			headers: mockHeader(headers) as unknown as Headers,
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
