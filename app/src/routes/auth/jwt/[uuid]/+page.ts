import type { JwtPayload } from '$lib/utils/getJwt';
import type { LoadEvent, LoadOutput } from '@sveltejs/kit';
export async function load({ url, params }: LoadEvent): Promise<LoadOutput> {
	const accessKey = params.uuid;
	const u = url.searchParams.get('url');
	return {
		accessKey,
		url: u,
	};
}
