<script lang="ts">
	import { SearchBar } from '$lib/ui/base';
	import {
		AddNotebookMemberDocument,
		SearchProfessionalDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { mutation, operationStore, query } from '@urql/svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import { Button } from '$lib/ui/base';
	import { openComponent } from '$lib/stores';
	import { session } from '$app/stores';
	import { post } from '$lib/utils/post';
	import type { SvelteEventHandler } from '$lib/types';
	import ProAddedConfirmation from '$lib/ui/ProNotebookMember/ProAddedConfirmation.svelte';
	import ProNotebookMemberForm from '$lib/ui/ProNotebookMember/ProNotebookMemberForm.svelte';
	import { trackEvent, trackSiteSearch } from '$lib/tracking/matomo';

	export let beneficiaryFirstname: string;
	export let beneficiaryLastname: string;
	export let notebookId: string;
	export let professionalIds: string[];

	let search: string | null;
	let selectedAccountId: string | null;

	const onChange: SvelteEventHandler<HTMLInputElement> = function (event) {
		selectedAccountId = event.currentTarget.value;
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
		selectedAccountId = null;
		$searchProfessionalResult.context.pause = false;
		$searchProfessionalResult.variables = {
			search: `%${search}%`,
			professionalIds,
		};
		$searchProfessionalResult.reexecute();
		trackSiteSearch(search, '/pro/notebook/member');
	}

	async function addMemberToNotebook(accountId: string) {
		trackEvent('pro', 'members', 'member added');
		// TODO(tglatt): should wrap into a hasura action
		const store = await addNotebookMember({
			accountId,
			notebookId: notebookId,
			creatorId: $session.user.id,
		});
		const { id: notebookMemberId } = store.data.newMember;
		//send email
		post('/pro/carnet/invitation', { notebookMemberId });
		openComponent.replace({ component: ProAddedConfirmation, props: { confirmed: true } });
	}

	function showAddNoteBookMember() {
		openComponent.open({
			component: ProNotebookMemberForm,
			props: {
				firstname: beneficiaryFirstname,
				lastname: beneficiaryLastname,
				notebookId,
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
				{`Recherchez un accompagnateur et envoyez une invitation à rejoindre le groupe de suivi de ${beneficiaryFirstname} ${beneficiaryLastname}.`}
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
					<div>
						<Button on:click={showAddNoteBookMember}>Inviter un nouvel accompagnateur</Button>
					</div>
				</div>
			{:else if count > 0}
				<div>{count} résultats correspondent à votre recherche</div>
			{/if}
			{#each professionals as professional (professional.id)}
				<div class="fr-radio-group">
					<input
						on:change={onChange}
						type="radio"
						id={professional.account.id}
						name="professional"
						value={professional.account.id}
					/>
					<label for={professional.id} class="flex flex-row justify-between items-center py-4">
						<div class="w-2/6">{professional.structure.name}</div>
						<div class="w-2/6">{professional.firstname} {professional.lastname}</div>
						<div class="w-1/6">{professional.structure.phone || ''}</div>
						<div class="w-1/6">{professional.structure.postalCode || ''}</div>
					</label>
				</div>
			{/each}
		</LoaderIndicator>
	</div>
	<!-- bas -->
	<div class="flex-shrink py-4 flex flex-row gap-6">
		<Button on:click={() => addMemberToNotebook(selectedAccountId)} disabled={!selectedAccountId}
			>Envoyer</Button
		>
		<Button on:click={onCancel} outline>Annuler</Button>
	</div>
</section>
