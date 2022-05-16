<script lang="ts">
	import { formatDateLocale } from '$lib/utils/date';
	import { openComponent } from '$lib/stores';
	import { Button } from '$lib/ui/base';
	import ProWithStructureView from './ProWithStructureView.svelte';
	import ProAppointment from '$lib/ui/ProNotebookMember/ProAppointment.svelte';
	import type { GetNotebookQuery } from '$lib/graphql/_gen/typed-document-nodes';

	type Member = GetNotebookQuery['notebook']['members'][0];

	export let member: Member;
	export let notebookId: string;
	$: professional = member?.account.professional;
	$: createdAt = member?.createdAt;
</script>

<div class="flex flex-col gap-6">
	<h1>Membre du groupe de suivi</h1>
	<p>Membre depuis le {formatDateLocale(createdAt)}</p>
	<ProWithStructureView {professional} />
	<ProAppointment {professional} {member} {notebookId} />
	<div class="mt-6">
		<Button
			on:click={() => {
				openComponent.close();
			}}>Fermer</Button
		>
	</div>
</div>
