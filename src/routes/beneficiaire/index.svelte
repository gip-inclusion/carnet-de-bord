<script context="module" lang="ts">
	import {
		GetNotebookByBeneficiaryIdDocument,
		GetNotebookByBeneficiaryIdQueryStore,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { Accordion, Accordions } from '$lib/ui/base';
	import MainAccordion from '$lib/ui/base/MainAccordion.svelte';
	import NotebookMembers from '$lib/ui/Beneficiary/NotebookMembers.svelte';
	import BeneficiaryPersonalInfoView from '$lib/ui/Beneficiary/PersonnalInfoView.svelte';
	import SocioProView from '$lib/ui/Beneficiary/SocioProView.svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import type { Load } from '@sveltejs/kit';
	import { operationStore, query } from '@urql/svelte';

	export const load: Load = ({ session }) => {
		const id = session.user.beneficiaryId;
		const getNotebookResult = operationStore(GetNotebookByBeneficiaryIdDocument, { id });

		return {
			props: {
				getNotebookResult,
			},
		};
	};
</script>

<script lang="ts">
	import { focusThemeKeys } from '$lib/constants/keys';
	import { displayFullName } from '$lib/ui/format';
	import { formatDateLocale } from '$lib/utils/date';

	export let getNotebookResult: GetNotebookByBeneficiaryIdQueryStore;

	query(getNotebookResult);

	$: notebook = $getNotebookResult.data?.notebook[0];
	$: beneficiary = notebook?.beneficiary;
	$: members = notebook?.members;
</script>

<svelte:head>
	<title>Accueil Bénéficiaire - Carnet de bord</title>
</svelte:head>
<LoaderIndicator result={getNotebookResult}>
	<BeneficiaryPersonalInfoView
		{beneficiary}
		lastUpdateDate={members[0].lastModifiedAt}
		lastUpdateFrom={members[0].professional}
	/>

	<Accordions>
		<MainAccordion title="Situation socioprofessionnelle">
			<SocioProView {notebook} />
		</MainAccordion>
		<MainAccordion title="Groupe de suivi">
			<NotebookMembers members={notebook.members} />
		</MainAccordion>
		<MainAccordion title="Plan d'action">
			<ul class="list-none pl-0">
				{#each notebook.focuses as focus}
					<li>
						<h3 class="fr-h4">
							<span><span class="fr-fi-arrow-right-s-line" aria-hidden="true" /></span
							>{focusThemeKeys.byKey[focus.theme]}
						</h3>
						<p>{focus.situations.join('<br/>')}</p>
						<div class="py-4">
							<Accordions>
								{#each focus.targets as target}
									<Accordion title={target.target}>
										<ul>
											{#each target.actions as action}
												<li>
													{action.action}
													créé le {formatDateLocale(action.createdAt)}
													par {displayFullName(action.creator)}
												</li>
											{/each}
										</ul>
									</Accordion>
								{/each}
							</Accordions>
						</div>
					</li>
				{/each}
			</ul>
		</MainAccordion>
	</Accordions>
</LoaderIndicator>
