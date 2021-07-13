<script lang="ts">
	import { session } from '$app/stores';
	import { goto } from '$app/navigation';

	const user = $session.user;

	if (user.type === 'pro') {
		goto('/pro');
	} else if (user.type === 'admin') {
		goto('/admin');
	} else if (user.type === 'part') {
		goto('/part');
	}
</script>
