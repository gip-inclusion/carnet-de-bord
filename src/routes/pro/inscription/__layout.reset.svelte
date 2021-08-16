<script context="module" lang="ts">
	export { load } from '$lib/commonImports';
	import { setClient, Client } from '@urql/svelte';
</script>

<script lang="ts">
	export let client: Client;
	setClient(client);
	import { HeaderCDB, FooterCDB } from '$lib/ui/index';

	const menuItems = [];
</script>

<HeaderCDB {menuItems} />

<div style="min-height: calc(100vh - 200px)">
	<slot />
</div>

<FooterCDB />
