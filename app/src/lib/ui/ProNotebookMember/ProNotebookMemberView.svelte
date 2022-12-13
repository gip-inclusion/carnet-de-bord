<script context="module" lang="ts">
	import type { GetNotebookQuery } from '$lib/graphql/_gen/typed-document-nodes';

	export type Member = GetNotebookQuery['notebook_public_view'][0]['members'][0];
</script>

<script lang="ts">
	import { formatDateLocale } from '$lib/utils/date';
	import { openComponent } from '$lib/stores';
	import { Button } from '$lib/ui/base';
	import ProWithStructureView from './ProWithStructureView.svelte';
	import ProAppointment from '$lib/ui/ProNotebookMember/ProAppointment.svelte';

	export let member: Member;
	export let notebookId: string;
	$: createdAt = member?.createdAt;
</script>

<div class="flex flex-col gap-6">
	<h1>Membre du groupe de suivi</h1>
	<p>Membre depuis le {formatDateLocale(createdAt)}</p>
	<ProWithStructureView account={member.account} />
	<ProAppointment {member} {notebookId} />
	<div class="mt-6">
		<Button
			on:click={() => {
				openComponent.close();
			}}>Fermer</Button
		>
	</div>
</div>
