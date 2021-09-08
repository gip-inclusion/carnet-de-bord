<script context="module" lang="ts">
	import {
		Beneficiary,
		GetNotebookDocument,
		GetNotebookQueryStore,
		NotebookMember,
		UpdateNotebookVisitDateDocument,
		UpdateNotebookVisitDateMutationStore
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { mutation, operationStore, query } from '@urql/svelte';
	import type { Load } from '@sveltejs/kit';

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
	import type { Option } from '$lib/ui/base/types';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import { Button, Select } from '$lib/ui/base';
	import Text from '$lib/ui/utils/Text.svelte';
	import { displayFullName, displayMobileNumber, displayFullAddress } from '$lib/ui/format';
	import { formatDate } from '$lib/utils/date';
	import { getLabels } from '$lib/utils/getLabels';
	import {
		cerObjectLabelValue,
		rightLabelValue,
		workSituationLabelValue
	} from '$lib/constants/LabelValues';
	import { openComponent } from '$lib/stores';
	import ProMemberInfo from '$lib/ui/ProMemberInfo.svelte';
	import ProMemberInvitation from '$lib/ui/ProInviteMember/ProMemberInvitation.svelte';
	import { onDestroy } from 'svelte';

	export let updateVisitDateResult: UpdateNotebookVisitDateMutationStore;
	export let getNotebookResult: GetNotebookQueryStore;

	const updateVisitDate = mutation(updateVisitDateResult);

	query(getNotebookResult);

	$: notebook = $getNotebookResult.data?.notebook;
	$: beneficiary = notebook?.beneficiary as Beneficiary;
	$: members = notebook?.members as NotebookMember[];
	$: member = members?.length ? members[0] : null;

	let selectedPeriod: Option | null;
	let periodOptions = [];
	let selectedOrder: Option | null;
	let orderOptions = [];

	const openMemberInfo = (member: NotebookMember) => {
		openComponent.open({ component: ProMemberInfo, props: { member } });
	};

	onDestroy(() => {
		updateVisitDate();
	});

	const openInviteMember = (beneficiary: Beneficiary, notebookId: string) => {
		openComponent.open({
			component: ProMemberInvitation,
			props: {
				beneficiaryFirstname: beneficiary.firstname,
				beneficiaryLastname: beneficiary.lastname,
				notebookId,
				professionalIds: members ? members.map((m) => m.professional.id) : []
			}
		});
	};
</script>

<LoaderIndicator result={getNotebookResult}>
	<div class="flex flex-col space-y-8 px-40">
		<div class="flex flex-col space-y-2">
			<div class="flex flex-col">
				{#if member?.notebookModificationDate}
					<div class="mb-2">
						Informations mises à jour le {formatDate(member.notebookModificationDate)} par
						{member.professional.firstname}
						{member.professional.lastname}
					</div>
				{/if}
				<div>
					<h1 class="fr-h2 float-left bf-500">
						{displayFullName(beneficiary)}
					</h1>
					<div class="float-right align-middle">
						<Button
							disabled={true}
							on:click={() => alert('Not implemented!')}
							outline={true}
							icon="ri-printer-line"
						/>
						<Button
							disabled={true}
							on:click={() => alert('Not implemented!')}
							outline={true}
							icon="ri-edit-line"
						/>
					</div>
				</div>
				<div>Né le {beneficiary.dateOfBirth}</div>
			</div>
			<!-- extract Infos -->
			<div class="flex flex-row">
				<div class="flex flex-col w-7/12 space-y-4">
					<div class="w-full">
						<h3 class="text-lg bf-500 mb-none">{displayMobileNumber(beneficiary)}</h3>
						<div>{beneficiary.email}</div>
						<div>
							{displayFullAddress(beneficiary)}
						</div>
					</div>
					<div class="w-full">
						<h4 class="text-base mb-none">Identifiant Pôle emploi</h4>
						<Text value={beneficiary.peNumber} />
					</div>
					<div class="w-full">
						<h4 class="text-base mb-none">Identifiant CAF</h4>
						<Text value={beneficiary.cafNumber} />
					</div>
				</div>
				<div class="flex flex-col w-5/12 space-y-4">
					<div class="flex flex-row">
						<div class="w-full">
							<h3 class="text-lg bf-500 mb-none">Situation</h3>
							<Text
								value={getLabels(notebook.workSituations, workSituationLabelValue).join(', ')}
							/>
						</div>
						<div class="w-full">
							<h3 class="text-lg bf-500 mb-none">Sujet du CER</h3>
							<Text value={getLabels(notebook.cerObjects, cerObjectLabelValue).join(', ')} />
						</div>
					</div>
					<div class="flex flex-row">
						<div class="w-full">
							<h3 class="text-lg bf-500 mb-none">Mes droits</h3>
							<Text value={getLabels(notebook.rights, rightLabelValue).join(', ')} />
						</div>
					</div>
				</div>
			</div>
			<!-- extract Infos -->
		</div>
		<!-- extract Groupe de suivi -->
		<div class="flex flex-col">
			<h2 class="fr-h4 bf-500">Groupe de suivi</h2>
			<div class="flex flex-row w-full justify-between">
				<Button
					on:click={() => {
						openInviteMember(beneficiary, notebook.id);
					}}>Ajouter un accompagnateur</Button
				>
			</div>
			<div class="py-8">
				{#each members as member, i}
					<div
						class:bg-gray-100={i % 2 === 0}
						class="flex hover:ml-2 cursor-pointer gap-2 p-2 mb-2 w-full border-l-2 border-france-blue"
						on:click={() => {
							openMemberInfo(member);
						}}
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
						<button>
							<i class="text-2xl text-france-blue ri-arrow-right-line" />
						</button>
					</div>
				{/each}
			</div>
		</div>
		<div class="flex flex-col">
			<h2 class="fr-h4 bf-500">Historique des démarches</h2>
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
		<!-- extract Historique des démarches -->
	</div>
</LoaderIndicator>

<style lang="postcss">
	.bf-500 {
		color: var(--bf500);
	}

	.mb-none {
		margin-bottom: 0 !important;
	}
</style>
