/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@urql/core';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>) => {
	return createClient({
		url: '/graphql',
		fetch,
	});
};
