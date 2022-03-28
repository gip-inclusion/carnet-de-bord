<script lang="ts">
	import { focusThemeKeys } from '$lib/constants/keys';
	import { displayFullName } from '$lib/ui/format';
	import { formatDateLocale } from '$lib/utils/date';
	import { Accordions, MainAccordion } from '$lib/ui/base';
	import type { GetNotebookByBeneficiaryIdQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import SocioProView from '../Beneficiary/SocioProView.svelte';
	import NotebookMembers from '../Beneficiary/NotebookMembers.svelte';
	import Accordion from '../base/Accordion.svelte';
	import BeneficiaryPersonalInfoView from '$lib/ui/Beneficiary/PersonnalInfoView.svelte';

	type Notebook = GetNotebookByBeneficiaryIdQuery['notebook'][0];

	export let notebook: Notebook;

	$: beneficiary = notebook.beneficiary;
	$: members = notebook.members;
</script>

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
						<span><span class="fr-fi-arrow-right-s-line" aria-hidden="true" /></span>{focusThemeKeys
							.byKey[focus.theme]}
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
