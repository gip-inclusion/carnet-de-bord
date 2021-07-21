<script lang="ts">
	import { session } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(async () => {
		const user = $session.user;
		if (user) {
			const { role } = user;
			switch (role) {
				case 'professional':
					goto('/pro');
					break;
				case 'admin':
					goto('/admin');
					break;
				case 'beneficiary':
					goto('/beneficiary');
					break;
				default:
					goto('/auth/login');
					break;
			}
		}
	});
</script>
