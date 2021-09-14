<script context="module" lang="ts">
	import { contactEmail } from '$lib/constants';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import { operationStore, OperationStore } from '@urql/svelte';
	import {
		GetStructuresDocument,
		GetStructuresQuery
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { query } from '@urql/svelte';
	import { createEventDispatcher } from 'svelte';
</script>

<script lang="ts">
	import type { AccountRequest, Structure } from '$lib/types';
	import { Input, Select } from '$lib/ui/base';
	import ProFormInfo from '$lib/ui/ProFormInfo.svelte';

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

	const structureMatchesSearch =
		(s: string) =>
		({ label, metadata }: StructureLight) =>
			[label, ...metadata].some((it) => it.toLocaleLowerCase().includes(s.toLocaleLowerCase()));
	$: structures =
		$result?.data?.structure.map((s) => ({
			...s,
			label: s.name,
			name: s.name || s.id,
			metadata: [...(s.shortDesc || '').split(' '), ...s.name.split(' ')]
		})) || [];

	let search = '';
	$: options = structures.filter(structureMatchesSearch(search));

	let structure: StructureLight | null;

	const isAccountRequestValid = (ar: AccountRequest) =>
		!!ar.firstname &&
		!!ar.lastname &&
		!!ar.mobileNumber &&
		!!ar.email &&
		!!ar.position &&
		!!ar.username;

	$: disableSubmission = disabled || !structure || !isAccountRequestValid(accountRequest);
</script>

<div>
	<LoaderIndicator {result}>
		<h2 class="bf-500 fr-h4">Structure</h2>
		<!-- @TODO let's replace both with a SearchInput component if it does not clash with the DSFR specs -->
		<div class="flex flex-row gap-2 w-full">
			<div class="w-full">
				<Input
					bind:val={search}
					inputHint="Ex : Mission locale Vallée de la Drôme"
					inputLabel="Filtrer les structures"
					additionalLabel=" "
				/>
			</div>
			<div class="w-full">
				<Select
					selectLabel="Sélectionnez votre structure"
					{options}
					bind:selected={structure}
					selectHint="Choisissez votre structure dans la liste"
					additionalLabel={`Si vous ne trouvez pas votre structure, veuillez <a href='mailto:${contactEmail}'>nous contacter</a>.`}
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
