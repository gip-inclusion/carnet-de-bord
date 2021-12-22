<script lang="ts" context="module">
	import type { Pro } from './ProWithStructureView.svelte';
	export type Member = {
		professional: Pro;
	};
</script>

<script lang="ts">
	import { openComponent } from '$lib/stores';
	import { Button } from '$lib/ui/base';
	import ProWithStructureView from './ProWithStructureView.svelte';

	export let member: Member;
	$: professional = member?.professional;
</script>

<div class="flex flex-col gap-6">
	<h1>Membre du groupe de suivi</h1>
	<ProWithStructureView {professional} />
	<div class="mt-6">
		<Button
			on:click={() => {
				openComponent.close();
			}}>Fermer</Button
		>
	</div>
</div>
