<script lang="ts">
	import { session } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(async () => {
		const user = $session.user;
		if (user) {
			if (user.type === 'professional') {
				goto('/pro');
			} else if (user.type === 'admin') {
				goto('/admin');
			} else if (user.type === 'beneficiary') {
				goto('/part');
			} else {
				goto('/auth/login');
			}
		}
	});
</script>
