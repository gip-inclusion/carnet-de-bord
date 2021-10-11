<script type="ts">
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';
	import { openComponent } from '$lib/stores';
	import { post } from '$lib/utils/post';
	import Button from '$lib/ui/base/Button.svelte';
	import * as Matomo from '$lib/tracking/matomo';

	function closeLayer() {
		openComponent.close();
	}

	async function logout() {
		await post(`/auth/logout`, {});
		Matomo.disconnectUser();
		$session.user = null;
		closeLayer();
		goto('/');
	}
</script>

<div class="flex h-full items-center">
	<div class="px-16">
		<h1>Déconnexion</h1>
		<p>Êtes-vous sûr de vouloir vous déconnecter&nbsp;?</p>

		<div class="flex flex-row gap-6">
			<Button on:click={logout}>Oui</Button>
			<Button outline on:click={closeLayer}>Non</Button>
		</div>
	</div>
</div>
