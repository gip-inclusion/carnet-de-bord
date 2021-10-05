<script lang="ts" context="module">
	import { homeForRole } from '$lib/routes';

	export async function load({ session }) {
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
