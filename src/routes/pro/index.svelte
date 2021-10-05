<script lang="ts" context="module">
	import { homeForRole } from '$lib/routes';
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';

	export async function load({ session }: LoadInput): Promise<LoadOutput> {
		const { user } = session;

		if (!user) {
			return {
				status: 302,
				redirect: '/login',
			};
		}
		const { role } = user;

		const home = homeForRole(role);

		return {
			status: 302,
			redirect: home,
		};
	}
</script>
