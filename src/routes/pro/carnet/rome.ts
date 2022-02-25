import { getGraphqlAPI } from '$lib/config/variables/public';
import { GetRomeCodesDocument } from '$lib/graphql/_gen/typed-document-nodes';
import type { RequestHandler } from '@sveltejs/kit';
import { createClient } from '@urql/core';
import { parse } from 'cookie';

export const get: RequestHandler = async (request) => {
	const query = request.url.searchParams.get('query');

	const cookie = parse(request.headers.cookie);
	const client = createClient({
		fetch,
		fetchOptions: {
			headers: {
				'Content-Type': 'application/json',
				authorization: `Bearer ${cookie.jwt}`,
			},
		},
		requestPolicy: 'network-only',
		url: getGraphqlAPI(),
	});

	const result = await client.query(GetRomeCodesDocument, { search: query }).toPromise();

	if (result.error) {
		// TODO send something meaningful instead
		return {
			status: 200,
			body: { data: [] },
		};
	}

	const matchingCodes = result.data.search_rome_codes;

	return {
		status: 200,
		body: { data: matchingCodes },
	};
};
