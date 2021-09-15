<script context="module" lang="ts">
	import {
		Beneficiary,
		GetNotebookDocument,
		GetNotebookQueryStore,
		NotebookMember,
		UpdateNotebookVisitDateDocument,
		UpdateNotebookVisitDateMutationStore
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import { Accordion, Accordions, Button } from '$lib/ui/base';
	import { ProBeneficiaryFocusView } from '$lib/ui/ProBeneficiaryFocus';
	import { ProBeneficiarySocioProView } from '$lib/ui/ProBeneficiarySocioPro';
	import { ProCarnetPersonnalInfoView } from '$lib/ui/ProCarnetPersonalInfo';
	import ProMemberInvitation from '$lib/ui/ProInviteMember/ProMemberInvitation.svelte';
	import ProMemberInfo from '$lib/ui/ProMemberInfo.svelte';
	import { LoaderIndicator, Text } from '$lib/ui/utils';
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
	<div class="flex flex-col gap-8 px-40">
		<ProCarnetPersonnalInfoView
			{beneficiary}
			on:edit={() => alert('Not implemented!')}
			on:print={() => alert('Not implemented!')}
			lastUpdateDate={lastMember?.notebookModificationDate}
			lastUpdateFrom={lastMember?.professional}
		/>
		<Accordions>
			<Accordion title="Situation socioprofessionnelle">
				<ProBeneficiarySocioProView {notebook} />
			</Accordion>
			<Accordion title="Groupe de suivi">
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
			</Accordion>
			<Accordion title="Axe de travail">
				<ProBeneficiaryFocusView notebookId={notebook.id} focuses={notebook.focuses} />
			</Accordion>
		</Accordions>
	</div>
</LoaderIndicator>
