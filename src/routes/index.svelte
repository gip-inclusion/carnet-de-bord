<script lang="ts">
	import { homeForRole } from '$lib/routes';
	import { session } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(async () => {
		const user = $session.user;
		if (user) {
			const { role } = user;
			const home = homeForRole(role);
			goto(home);
		}
	});
</script>
