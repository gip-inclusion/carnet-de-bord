<script lang="ts">
	import { homeForRole } from '$lib/routes';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		goto(homeForRole('pro'));
	});
</script>
