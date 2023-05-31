<script lang="ts">
	import * as Matomo from '$lib/tracking/matomo';
	import { onDestroy, onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import { accountData, crispData } from '$lib/stores';
	import { updateCrispUser } from '$lib/chat/crisp';
	import { RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';

	export let data: LayoutData;
	accountData.set(data.account);

	const { username } = data.account;
	if (
		[
			RoleEnum.AdminStructure,
			RoleEnum.Manager,
			RoleEnum.OrientationManager,
			RoleEnum.Professional,
		].includes(data.account.type)
	) {
		const { firstname, lastname, email } =
			data.account.professional ||
			data.account.admin_structure ||
			data.account.orientation_manager ||
			data.account.manager;

		crispData.set({ username, firstname, lastname, email });
	}

	let interval;

	onMount(() => {
		//hack @lionelb we use a loop to correctly set user info in crisp
		// after crisp is initialized
		interval = setInterval(() => {
			if (window.$crisp && $crispData) {
				updateCrispUser($crispData);
				clearInterval(interval);
			}
		}, 100);
		Matomo.setCustomDimension(Matomo.CustomDimensions.Role, data.user.role);
		Matomo.setCustomDimension(Matomo.CustomDimensions.Deployment, data.user.deploymentId);
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<slot />
