<script context="module" lang="ts">
	import {
		Beneficiary,
		GetNotebookByBeneficiaryIdDocument,
		GetNotebookByBeneficiaryIdQueryStore,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { Accordion, Accordions } from '$lib/ui/base';
	import { PartNotebookPersonalInfoView } from '$lib/ui/PartNotebookPersonalInfo';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import Text from '$lib/ui/utils/Text.svelte';
	import type { Load } from '@sveltejs/kit';
	import { operationStore, query } from '@urql/svelte';

	export const load: Load = ({ session }) => {
		const id = session.user.beneficiaryId;
		const getNotebookResult = operationStore(GetNotebookByBeneficiaryIdDocument, { id });

		return {
			props: {
				getNotebookResult,
			},
		};
	};
</script>

<script lang="ts">
	export let getNotebookResult: GetNotebookByBeneficiaryIdQueryStore;

	query(getNotebookResult);

	$: notebook = $getNotebookResult.data?.notebook[0];
	$: beneficiary = notebook?.beneficiary as Beneficiary;
	$: members = notebook?.members;
</script>

<LoaderIndicator result={getNotebookResult}>
	<div class="flex flex-col px-40 space-y-8">
		<PartNotebookPersonalInfoView
			{beneficiary}
			on:edit={() => alert('Not implemented!')}
			on:print={() => alert('Not implemented!')}
			lastUpdateDate={members[0].notebookModificationDate}
			lastUpdateFrom={members[0].professional}
		/>

		<Accordions>
			<Accordion title="Groupe de suivi">
				{#each members as member, i}
					<div
						class:bg-gray-100={i % 2 === 0}
						class="flex w-full gap-2 p-2 mb-2 border-l-2 cursor-pointer hover:ml-2 border-france-blue"
					>
						<div class="flex flex-col w-1/2 min-w-0">
							<div class="text-gray-text-alt">Structure</div>
							<Text
								classNames="font-bold overflow-ellipsis overflow-hidden whitespace-nowrap"
								value={member.professional.structure.name}
							/>
						</div>
						<div class="flex flex-col w-1/4 min-w-0">
							<div class="text-gray-text-alt">Accompagnateur</div>
							<div
								class="flex flex-row gap-2 overflow-hidden font-bold overflow-ellipsis whitespace-nowrap"
							>
								<Text classNames="font-bold" value={member.professional.firstname} />
								<Text classNames="font-bold" value={member.professional.lastname} />
							</div>
						</div>
						<div class="flex flex-col w-1/4 min-w-0">
							<div class="text-gray-text-alt">Fonction</div>
							<Text
								classNames="font-bold overflow-ellipsis overflow-hidden whitespace-nowrap"
								value={member.professional.position}
							/>
						</div>
					</div>
				{/each}
			</Accordion>
		</Accordions>
	</div>
</LoaderIndicator>
