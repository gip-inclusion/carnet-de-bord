<script lang="ts">
	import * as Matomo from '$lib/tracking/matomo';
	import { onMount } from 'svelte';
	import { getCrispWebsiteId } from '$lib/config/variables/public';
	import Crisp from '$lib/chat/Crisp.svelte';
	import type { LayoutData } from './$types';
	import { accountData } from '$lib/stores';

	export let data: LayoutData;
	accountData.set(data.account);

	onMount(() => {
		Matomo.setCustomDimension(Matomo.CustomDimensions.Role, data.user.role);
		Matomo.setCustomDimension(Matomo.CustomDimensions.Deployment, data.user.deploymentId);
	});
</script>

<Crisp websiteId={getCrispWebsiteId()} />

<slot />
