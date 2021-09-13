<script lang="ts">
	import { Button } from '$lib/ui/base';
	import { openComponent } from '$lib/stores';
	export let confirmed = true;
</script>

<div>
	<h1>Invitation envoyée</h1>
	{#if confirmed}
		<div class="pb-8">
			Le nouvel accompagnateur a été ajouté au groupe de suivi du bénéficiaire. Un mail de
			notification lui a été envoyé.
		</div>
	{:else}
		<div class="pb-8">
			Le nouvel accompagnateur a été créé et ajouté au groupe de suivi du bénéficiaire. Un mail de
			notification lui sera envoyé quand ses informations auront été validées par un administrateur.
		</div>
	{/if}
	<Button
		on:click={() => {
			openComponent.close();
		}}>J'ai compris</Button
	>
</div>
