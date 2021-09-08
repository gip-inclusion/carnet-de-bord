<script lang="ts">
	import SearchBar from '../base/SearchBar.svelte';
	import {
		AddNotebookMemberDocument,
		SearchProfessionalDocument
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { mutation, operationStore, query } from '@urql/svelte';
	import LoaderIndicator from '../utils/LoaderIndicator.svelte';
	import Button from '../base/Button.svelte';
	import { openComponent } from '$lib/stores';
	import { session } from '$app/stores';

	export let beneficiaryFistname: string;
	export let beneficiaryLastname: string;
	export let notebookId: string;
	export let professionalIds;

	let search;
	let selectedProfessionalId;
	let newMember;

	function onChange(event: Event) {
		const target = event.target as HTMLInputElement;
		selectedProfessionalId = target.value;
	}

	function onCancel() {
		openComponent.close();
	}

	const searchProfessionalResult = operationStore(
		SearchProfessionalDocument,
		{ search: null },
		{ pause: true }
	);

	const addNotebookMemberStore = operationStore(AddNotebookMemberDocument);
	const addNotebookMember = mutation(addNotebookMemberStore);

	query(searchProfessionalResult);

	function onSearch() {
		$searchProfessionalResult.context.pause = false;
		$searchProfessionalResult.variables = {
			search: `%${search}%`,
			professionalIds
		};
		$searchProfessionalResult.reexecute();
	}

	async function onClick() {
		const store = await addNotebookMember({
			professionalId: selectedProfessionalId,
			notebookId: notebookId,
			creatorId: $session.user.professionalId
		});
		newMember = store.data.insert_notebook_member_one;
	}

	$: professionals = $searchProfessionalResult.data?.professionals || [];
	$: count = $searchProfessionalResult.data?.count.aggregate.count;
</script>

<section class="px-16 pt-28 pb-8 flex flex-col">
	<!-- haut -->
	{#if !newMember}
		<div class="flex-shrink">
			<div class="py-12">
				<h1>Inviter un accompagnateur</h1>
				<div>
					{`Recherchez un accompagnateur et envoyez une invitation à rejoindre le groupe de suivi de M.
		${beneficiaryFistname} ${beneficiaryLastname}.`}
				</div>
			</div>

			<SearchBar
				inputLabel="Rechercher un bénéficiaire"
				inputHint="nom, structure, code postal"
				bind:search
				btnDisabled={!search}
				handleSubmit={onSearch}
			/>
		</div>
		<!-- center -->
		<div class="py-4 flex-grow">
			<LoaderIndicator result={searchProfessionalResult}>
				{#if count === 0}
					<div>Aucun résultat ne correspond à votre recherche</div>
				{:else if count > 0}
					<div>{count} résultats correspondent à votre recherche</div>
				{/if}
				{#each professionals as professional (professional.id)}
					<div class="flex flex-row gap-2 justify-between items-center py-4">
						<input
							on:change={onChange}
							type="radio"
							id={professional.id}
							name="professional"
							value={professional.id}
						/>
						<div class="w-2/6">{professional.structure.name}</div>
						<div class="w-2/6">{professional.firstname} {professional.lastname}</div>
						<div class="w-1/6">{professional.structure.phone || ''}</div>
						<div class="w-1/6">{professional.structure.postalCode || ''}</div>
					</div>
				{/each}
			</LoaderIndicator>
		</div>
		<!-- bas -->
		<div class="flex-shrink py-4">
			<Button on:click={onClick} disabled={!selectedProfessionalId}>Envoyer</Button>
			<Button on:click={onCancel} outline>Annuler</Button>
		</div>
	{:else}
		<div>
			<h1>Invitation envoyée</h1>
			<div class="pb-8">
				Le nouvel accompagnateur a été ajouté au le groupe de suivi du bénéficiaire. Un mail de
				notification lui a été envoyé.
			</div>
			<Button
				on:click={() => {
					openComponent.close();
				}}>J'ai compris</Button
			>
		</div>
	{/if}
</section>
