<script lang="ts" context="module">
	import type { Pro } from './ProWithStructureView.svelte';

	import { formatDateLocale } from '$lib/utils/date';
	export type Member = {
		professional: Pro;
		createdAt: string;
	};
</script>

<script lang="ts">
	import { openComponent } from '$lib/stores';
	import { Button } from '$lib/ui/base';
	import ProWithStructureView from './ProWithStructureView.svelte';
	import ProAppointment from '$lib/ui/ProNotebookMember/ProAppointment.svelte';

	export let member: Member;
	export let notebookId: string;
	$: professional = member?.professional;
	$: createdAt = member?.createdAt;
</script>

<div class="flex flex-col gap-6">
	<h1>Membre du groupe de suivi</h1>
	<p>Membre depuis le {formatDateLocale(createdAt)}</p>
	<ProWithStructureView {professional} />
	<ProAppointment {professional} {notebookId} />
	<div class="mt-6">
		<Button
			on:click={() => {
				openComponent.close();
			}}>Fermer</Button
		>
	</div>
</div>
