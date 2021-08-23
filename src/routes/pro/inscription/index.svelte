<script context="module" lang="ts">
	import type { GetStructuresQuery } from '$lib/_gen/typed-document-nodes';
	import { GetStructuresDocument } from '$lib/_gen/typed-document-nodes';
	import type { Load } from '@sveltejs/kit';
	import type { OperationStore } from '@urql/svelte';
	import { operationStore, query } from '@urql/svelte';

	export const load: Load = async () => {
		const result = operationStore(GetStructuresDocument, {});

		return {
			props: {
				result
			}
		};
	};
</script>

<script lang="ts">
	import type { AccountRequest, RequestStep } from '$lib/types';
	import { post } from '$lib/utils/post';

	import { Input, Select } from '$lib/ui/base';
	import ProFormInfo from '$lib/ui/ProFormInfo.svelte';

	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';

	export let result: OperationStore<GetStructuresQuery>;

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
	$: structures = $result.data
		? $result.data.structure.map((s) => ({
				...s,
				label: s.name,
				name: s.name || s.id,
				metadata: [...(s.shortDesc || '').split(' '), ...s.name.split(' ')]
		  }))
		: [];

	let search = '';
	$: options = structures.filter(structureMatchesSearch(search));

	let structure: StructureLight | null;

	let accountRequest: AccountRequest = {};

	let requestStep: RequestStep = 'start';

	const isAccountRequestValid = (ar: AccountRequest) =>
		!!ar.firstname &&
		!!ar.lastname &&
		!!ar.mobileNumber &&
		!!ar.email &&
		!!ar.position &&
		!!ar.username;
	$: disableSubmission =
		requestStep === 'error' || !structure || !isAccountRequestValid(accountRequest);

	let errors: AccountRequest = {};

	async function handleSubmit() {
		const { protocol, host } = window.location;
		const response = await post('/admin/requestPro', {
			accountRequest,
			structureId: structure.id,
			appUrl: `${protocol}//${host}`
		});

		if (response.status === 400) {
			requestStep = 'error';
			errors = (await response.json()).errors as unknown as Record<keyof AccountRequest, string>;
		}

		if (response.status === 200) {
			requestStep = 'success';
		}
	}

	function resetForm() {
		requestStep = 'start';
	}
</script>

<div class="flex flex-col gap-8 px-40 mt-8">
	<LoaderIndicator {result}>
		{#if requestStep !== 'success'}
			<div>
				<h1>Inscription au Carnet de bord</h1>
				<p>Veuillez remplir le formulaire pour vous inscrire.</p>
			</div>
			<div>
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
							additionalLabel="Si vous ne trouvez pas votre structure, veuillez nous contacter."
						/>
					</div>
				</div>
				<!-- end @TODO -->
			</div>
			{#if structure}
				<div>
					<h2 class="bf-500 fr-h4">Informations personnelles</h2>
					<div>
						<ProFormInfo
							on:submit={handleSubmit}
							account={accountRequest}
							fieldErrors={errors}
							confirmText="Je valide mon inscription"
							disabled={disableSubmission}
							onInput={resetForm}
						/>
					</div>
				</div>
			{/if}
		{:else}
			<div>
				<h1>Demande d'inscription envoyée</h1>
				<p>Nous avons bien pris en compte votre demande de nouvelle inscription.</p>
				<p>
					Vous recevrez un courriel de confirmation, avec un lien pour vous connecter au Carnet de
					bord.
				</p>
			</div>
			<!-- @TODO what is this button supposed to do?
		<div>
			<Button>J'ai compris</Button>
		</div>
		-->
		{/if}
	</LoaderIndicator>
</div>

<style lang="postcss">
	.bf-500 {
		color: var(--bf500);
	}
</style>
