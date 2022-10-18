<script lang="ts">
	import { setClient } from '@urql/svelte';
	import type { LayoutData } from './$types';
	import * as Matomo from '$lib/tracking/matomo';
	import { onMount } from 'svelte';
	import { getCrispWebsiteId } from '$lib/config/variables/public';
	import Crisp from '$lib/chat/Crisp.svelte';
	import LayerCdb from '$lib/ui/LayerCDB.svelte';

	export let data: LayoutData;

	setClient(data.client);

	onMount(() => {
		Matomo.setCustomDimension(Matomo.CustomDimensions.Role, data.user.role);
		Matomo.setCustomDimension(Matomo.CustomDimensions.Deployment, data.user.deploymentId);
	});
</script>

<Crisp websiteId={getCrispWebsiteId()} />
<slot />
<LayerCdb />
