<script context="module" lang="ts">
	import {
		Beneficiary,
		GetNotebookByBeneficiaryIdDocument,
		GetNotebookByBeneficiaryIdQueryStore
	} from '$lib/graphql/_gen/typed-document-nodes';
	import type { Option } from '$lib/types';
	import { Accordion, Accordions, Button, Select } from '$lib/ui/base';
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
				getNotebookResult
			}
		};
	};
</script>

<script lang="ts">
	export let getNotebookResult: GetNotebookByBeneficiaryIdQueryStore;

	query(getNotebookResult);

	$: notebook = $getNotebookResult.data?.notebook[0];
	$: beneficiary = notebook?.beneficiary as Beneficiary;
	$: members = notebook?.members;
	let selectedPeriod: Option | null;
	let periodOptions = [];
	let selectedOrder: Option | null;
	let orderOptions = [];
</script>

<LoaderIndicator result={getNotebookResult}>
	<div class="flex flex-col space-y-8 px-40">
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
						class="flex hover:ml-2 cursor-pointer gap-2 p-2 mb-2 w-full border-l-2 border-france-blue"
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
								class="flex flex-row gap-2 font-bold overflow-ellipsis overflow-hidden whitespace-nowrap"
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
			<Accordion title="Historique des démarches">
				<div class="flex flex-col">
					<div class="flex flex-row w-full justify-between">
						<Button disabled={true} on:click={() => alert('Not implemented!')}
							>Ajouter une étape
						</Button>
						<div class="flex flex-row justify-between space-x-4">
							<Select
								disabled={true}
								selected={selectedPeriod}
								options={periodOptions}
								selectLabel=""
								selectHint="Sélectionner une période"
							/>
							<Select
								disabled={true}
								selected={selectedOrder}
								options={orderOptions}
								selectLabel=""
								selectHint="Sélectionner un tri"
							/>
						</div>
					</div>
				</div>
			</Accordion>
		</Accordions>
	</div>
</LoaderIndicator>
