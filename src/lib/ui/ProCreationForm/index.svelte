<script context="module" lang="ts">
	import { contactEmail } from '$lib/constants';
	import {
		GetStructuresDocument,
		GetStructuresQuery,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import type { AccountRequest, Structure } from '$lib/types';
	import ProFormInfo from '$lib/ui/ProFormInfo.svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import { operationStore, OperationStore, query } from '@urql/svelte';
	import Svelecte from 'svelecte';
	import { createEventDispatcher } from 'svelte';
</script>

<script lang="ts">
	export let disabled = false;
	export let errors: AccountRequest = {};
	export let accountRequest: AccountRequest = {};
	export let onSubmit: (s: Structure) => void = (s) => {
		dispatch('submit', { structure: s });
	};
	export let onInput: () => void = () => {
		dispatch('input', {});
	};
	export let onCancel: () => void = () => {
		dispatch('cancel', {});
	};

	const dispatch = createEventDispatcher();

	let result: OperationStore<GetStructuresQuery> = operationStore(GetStructuresDocument, {});
	query(result);

	type StructureLight = {
		id: string;
		name: string;
		label: string;
		metadata: string[];
	};

	$: options = $result?.data?.structure;

	let structure: StructureLight | null;

	const isAccountRequestValid = (ar: AccountRequest) =>
		!!ar.firstname && !!ar.lastname && !!ar.mobileNumber && !!ar.email && !!ar.position;

	$: disableSubmission = disabled || !structure || !isAccountRequestValid(accountRequest);
</script>

<div>
	<LoaderIndicator {result}>
		<h2 class="bf-500 fr-h4">Structure</h2>
		<div class="flex flex-row w-full gap-2">
			<div class="w-full">
				<label class="flex-grow mb-2 fr-label" for="structureSelect">
					<div>Sélectionnez votre structure</div>
					<span class="fr-hint-text justify-self-stretch">
						Si vous ne trouvez pas votre structure, veuillez <a href="mailto:${contactEmail}"
							>nous contacter</a
						>.
					</span>
				</label>
				<Svelecte
					name="structureSelect"
					{options}
					placeholder=""
					bind:selection={structure}
					disableSifter={false}
					class="svelecte-control custom-svelecte"
					valueField="id"
					labelField="name"
					clearable={true}
				/>
			</div>
		</div>
		<!-- end @TODO -->
	</LoaderIndicator>
</div>
{#if structure}
	<div>
		<h2 class="bf-500 fr-h4">Informations personnelles</h2>
		<div>
			<ProFormInfo
				bind:account={accountRequest}
				fieldErrors={errors}
				confirmText="Je valide mon inscription"
				disabled={disableSubmission}
				on:submit={() => onSubmit(structure)}
				on:cancel={onCancel}
				{onInput}
			/>
		</div>
	</div>
{/if}

<style lang="postcss">
	.bf-500 {
		color: var(--bf500);
	}
</style>
