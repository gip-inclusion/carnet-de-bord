<script type="ts">
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';
	import { openComponent } from '$lib/stores';
	import { post } from '$lib/utils/post';
	import Button from '../base/Button.svelte';

	async function logout() {
		await post(`/auth/logout`, {});
		$session.user = null;
		goto('/');
	}

	function closeLayer() {
		openComponent.close();
	}
</script>

<div class="flex h-full items-center">
	<div class="px-16">
		<h1>Déconnexion</h1>
		<p>Êtes-vous sûr de vouloir vous déconnecter&nbsp;?</p>
		<div class="inline-block pr-6">
			<Button on:click={logout}>Oui</Button>
		</div>
		<Button outline on:click={closeLayer}>Non</Button>
	</div>
</div>
