<script context="module" lang="ts">
	import {
		Beneficiary,
		GetNotebookDocument,
		GetNotebookQueryStore,
		NotebookFocus,
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
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import { Button } from '$lib/ui/base';
	import Text from '$lib/ui/utils/Text.svelte';
	import { contractTypeKeys, focusThemeKeys } from '$lib/constants/keys';
	import { openComponent } from '$lib/stores';
	import ProMemberInfo from '$lib/ui/ProMemberInfo.svelte';
	import ProMemberInvitation from '$lib/ui/ProInviteMember/ProMemberInvitation.svelte';
	import { onDestroy } from 'svelte';
	import Card from '$lib/ui/base/Card.svelte';
	import ProBeneficiaryPersonnalInfos from '$lib/ui/ProBeneficiaryPersonnalInfos.svelte';
	import Accordions from '$lib/ui/base/Accordions.svelte';
	import Accordion from '$lib/ui/base/Accordion.svelte';
	import ProBeneficiarySocioProSituation from '$lib/ui/ProBeneficiarySocioProSituation.svelte';

	export let updateVisitDateResult: UpdateNotebookVisitDateMutationStore;
	export let getNotebookResult: GetNotebookQueryStore;

	const updateVisitDate = mutation(updateVisitDateResult);
	query(getNotebookResult);

	$: notebook = $getNotebookResult.data?.notebook;
	$: beneficiary = notebook?.beneficiary as Beneficiary;
	$: members = notebook?.members as NotebookMember[];
	$: member = members?.length ? members[0] : null;

	$: focuses = notebook?.focuses as NotebookFocus[];

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
		<ProBeneficiaryPersonnalInfos
			{beneficiary}
			on:edit={() => alert('Not implemented!')}
			on:print={() => alert('Not implemented!')}
			lastUpdateDate={members[0].notebookModificationDate}
			lastUpdateFrom={members[0].professional}
		/>
		<Accordions>
			<Accordion title="Situation socioprofessionnelle">
				<ProBeneficiarySocioProSituation {notebook} />
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
				<div class="flex  flex-row flex-wrap">
					{#each focuses as focus (focus.id)}
						<div class="w-1/2 p-4 box-border">
							<Card hideArrow={false}>
								<span slot="title">{focusThemeKeys.byKey[focus.theme]}</span>
								<span slot="description">{contractTypeKeys.byKey[focus.linkedTo]}</span>
							</Card>
						</div>
					{/each}
				</div>
			</Accordion>
		</Accordions>
	</div>
</LoaderIndicator>
