<script lang="ts">
	import { openComponent } from '$lib/stores';
	import Button from '$lib/ui/base/Button.svelte';
	import * as Matomo from '$lib/tracking/matomo';

	function closeLayer() {
		openComponent.close();
	}

	async function logout() {
		Matomo.logout();
		window.location.href = '/auth/logout';
		closeLayer();
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
