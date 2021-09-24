<script lang="ts">
	import SearchBar from '../base/SearchBar.svelte';
	import {
		AddNotebookMemberDocument,
		SearchProfessionalDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { mutation, operationStore, query } from '@urql/svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import Button from '$lib/ui/base/Button.svelte';
	import { openComponent } from '$lib/stores';
	import { session } from '$app/stores';
	import { post } from '$lib/utils/post';
	import type { AccountRequest, Structure, SvelteEventHandler } from '$lib/types';
	import { displayFullName } from '../format';
	import ProAddedConfirmation from './ProAddedConfirmation.svelte';
	import ProNotebookMemberForm from './ProNotebookMemberForm.svelte';

	export let beneficiaryFirstname: string;
	export let beneficiaryLastname: string;
	export let notebookId: string;
	export let professionalIds: string[];

	let search: string | null;
	let selectedProfessionalId: string | null;
	export let newMember: { id: string } | null = null;

	const onChange: SvelteEventHandler<HTMLInputElement> = function (event) {
		selectedProfessionalId = event.currentTarget.value;
	};

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
			professionalIds,
		};
		$searchProfessionalResult.reexecute();
	}

	async function addMemberToNotebook(professionalId: string) {
		// TODO(tglatt): should wrap into a hasura action
		const store = await addNotebookMember({
			professionalId,
			notebookId: notebookId,
			creatorId: $session.user.professionalId,
		});
		newMember = store.data.newMember;
		//send email
		post('/pro/carnet/invitation', { notebookMemberId: newMember.id });
		openComponent.open({ component: ProAddedConfirmation, props: { confirmed: true } });
	}

	let errors: AccountRequest = {};
	let accountRequest: AccountRequest = {};
	let disabled = false;
	async function onSubmit(structure: Structure) {
		disabled = true;
		const response = await post('/inscription/request', {
			accountRequest,
			structureId: structure.id,
			requester: displayFullName($session.user),
		});

		if (response.status === 400) {
			errors = (await response.json()).errors as Record<keyof AccountRequest, string>;
		}

		if (response.status === 200) {
			const { professionalId } = await response.json();
			await addMemberToNotebook(professionalId);

			openComponent.open({ component: ProAddedConfirmation, props: { confirmed: false } });
		}
	}

	function onInput() {
		disabled = false;
	}

	function createPro() {
		openComponent.open({
			component: ProNotebookMemberForm,
			props: {
				disabled,
				accountRequest,
				errors,
				onCancel,
				onInput,
				onSubmit,
			},
		});
	}

	$: professionals = $searchProfessionalResult.data?.professionals || [];
	$: count = $searchProfessionalResult.data?.count.aggregate.count;
</script>

<section class="flex flex-col">
	<!-- haut -->
	<div class="flex-shrink">
		<div class="py-12">
			<h1>Inviter un accompagnateur</h1>
			<div>
				{`Recherchez un accompagnateur et envoyez une invitation à rejoindre le groupe de suivi de M.
		${beneficiaryFirstname} ${beneficiaryLastname}.`}
			</div>
		</div>

		<SearchBar
			inputLabel="Rechercher un bénéficiaire"
			inputHint="Nom, structure, code postal"
			bind:search
			btnDisabled={!search}
			handleSubmit={onSearch}
		/>
	</div>
	<!-- center -->
	<div class="py-4 flex-grow">
		<LoaderIndicator result={searchProfessionalResult}>
			{#if count === 0}
				<div class="flex flex-col gap-6">
					<div>Aucun résultat ne correspond à votre recherche</div>
					<div><Button on:click={createPro}>Inviter un nouvel accompagnateur</Button></div>
				</div>
			{:else if count > 0}
				<div>{count} résultats correspondent à votre recherche</div>
			{/if}
			{#each professionals as professional (professional.id)}
				<label for={professional.id} class="flex flex-row gap-2 justify-between items-center py-4">
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
				</label>
			{/each}
		</LoaderIndicator>
	</div>
	<!-- bas -->
	<div class="flex-shrink py-4 flex flex-row gap-6">
		<Button
			on:click={() => addMemberToNotebook(selectedProfessionalId)}
			disabled={!selectedProfessionalId}>Envoyer</Button
		>
		<Button on:click={onCancel} outline>Annuler</Button>
	</div>
</section>
