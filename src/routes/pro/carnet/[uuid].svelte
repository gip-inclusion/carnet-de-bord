<script context="module" lang="ts">
	import {
		Beneficiary,
		GetNotebookDocument,
		GetNotebookQueryStore,
		NotebookMember,
		UpdateNotebookVisitDateDocument,
		UpdateNotebookVisitDateMutationStore
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { Accordion, Accordions } from '$lib/ui/base';
	import { ProNotebookFocusView } from '$lib/ui/ProNotebookFocus';
	import { ProNotebookMembersView } from '$lib/ui/ProNotebookMember';
	import { ProNotebookPersonalInfoView } from '$lib/ui/ProNotebookPersonalInfo';
	import { ProNotebookSocioProView } from '$lib/ui/ProNotebookSocioPro';
	import { LoaderIndicator } from '$lib/ui/utils';
	import type { Load } from '@sveltejs/kit';
	import { mutation, operationStore, query } from '@urql/svelte';
	import { onDestroy } from 'svelte';

	export const load: Load = ({ page }) => {
		const id = page.params.uuid;
		const getNotebookResult = operationStore(GetNotebookDocument, { id });
		const updateVisitDateResult = operationStore(UpdateNotebookVisitDateDocument, {
			notebookId: id,
			notebookVisitDate: new Date()
		});
		return {
			props: {
				getNotebookResult,
				updateVisitDateResult
			}
		};
	};
</script>

<script lang="ts">
	export let updateVisitDateResult: UpdateNotebookVisitDateMutationStore;
	export let getNotebookResult: GetNotebookQueryStore;

	const updateVisitDate = mutation(updateVisitDateResult);
	query(getNotebookResult);

	$: notebook = $getNotebookResult.data?.notebook;
	$: beneficiary = notebook?.beneficiary as Beneficiary;
	$: members = notebook?.members as NotebookMember[];
	$: lastMember = members?.length ? members[0] : null;

	onDestroy(() => {
		updateVisitDate();
	});
</script>

<LoaderIndicator result={getNotebookResult}>
	<div class="flex flex-col gap-8 px-40">
		<ProNotebookPersonalInfoView
			{beneficiary}
			on:edit={() => alert('Not implemented!')}
			on:print={() => alert('Not implemented!')}
			lastUpdateDate={lastMember?.notebookModificationDate}
			lastUpdateFrom={lastMember?.professional}
		/>
		<Accordions>
			<Accordion title="Situation socioprofessionnelle">
				<ProNotebookSocioProView {notebook} />
			</Accordion>
			<Accordion title="Groupe de suivi">
				<ProNotebookMembersView
					{members}
					notebookId={notebook.id}
					beneficiaryFirstname={beneficiary.firstname}
					beneficiaryLastname={beneficiary.lastname}
				/>
			</Accordion>
			<Accordion title="Axe de travail">
				<ProNotebookFocusView notebookId={notebook.id} focuses={notebook.focuses} />
			</Accordion>
		</Accordions>
	</div>
</LoaderIndicator>
