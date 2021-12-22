import { stringsMatch } from '$lib/helpers';
import type { RequestHandler } from '@sveltejs/kit';
import romeCodes from './codesrometree.xls.json';

type RomeItem = {
	text: string;
	rome?: string;
	children?: RomeItem[];
};
function filterAndFlatten(list: RomeItem[], matcher: (s: string) => boolean) {
	return list.reduce((acc, { children, rome, text }) => {
		//HACK: create ROM table and prevent query from front if query.length < 3
		if (acc && acc.length > 20) {
			return acc;
		}
		let codes = [];
		if (children) {
			codes = filterAndFlatten(children, matcher);
		} else if (rome && (matcher(text) || matcher(rome))) {
			codes = [{ rome, text }];
		}
		return [...acc, ...codes];
	}, []);
}

export const get: RequestHandler = async (request) => {
	const query = request.query.get('query') as string;
	const matcher = stringsMatch(query);
	const matchingCodes = filterAndFlatten(romeCodes, matcher);

	return {
		status: 200,
		body: { data: matchingCodes },
	};
};
