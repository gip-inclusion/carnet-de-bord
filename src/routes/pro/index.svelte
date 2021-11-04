<script lang="ts" context="module">
	import redirectUrl from '$lib/utils/redirectUrl';
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';

	export async function load({ page, session }: LoadInput): Promise<LoadOutput> {
		const redirect = redirectUrl(page, session);
		if (redirect) {
			return {
				status: 302,
				redirect,
			};
		}
	}
</script>
