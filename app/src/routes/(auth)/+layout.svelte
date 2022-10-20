<script lang="ts">
	import * as Matomo from '$lib/tracking/matomo';
	import { onMount } from 'svelte';
	import { getCrispWebsiteId } from '$lib/config/variables/public';
	import Crisp from '$lib/chat/Crisp.svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	onMount(() => {
		Matomo.setCustomDimension(Matomo.CustomDimensions.Role, data.user.role);
		Matomo.setCustomDimension(Matomo.CustomDimensions.Deployment, data.user.deploymentId);
	});
</script>

<Crisp websiteId={getCrispWebsiteId()} />

<slot />
