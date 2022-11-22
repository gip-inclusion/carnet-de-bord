<script lang="ts">
	import { focusThemeKeys } from '$lib/constants/keys';
	import { displayFullName } from '$lib/ui/format';
	import { formatDateLocale } from '$lib/utils/date';
	import { Accordions, MainSection } from '$lib/ui/base';
	import type { GetNotebookByBeneficiaryIdQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import SocioProView from '../Beneficiary/SocioProView.svelte';
	import NotebookMembers from '../Beneficiary/NotebookMembers.svelte';
	import Accordion from '../base/Accordion.svelte';
	import ProNotebookPersonalInfoView from '$lib/ui/ProNotebookPersonalInfo/ProNotebookPersonalInfoView.svelte';
	import OrientationRequestBanner from '../OrientationRequest/OrientationRequestBanner.svelte';
	import OrientationHeader from '../OrientationHeader/OrientationHeader.svelte';

	type Notebook = GetNotebookByBeneficiaryIdQuery['notebook'][0];

	export let notebook: Notebook;

	$: beneficiary = notebook.beneficiary;
	$: members = notebook.members;
	$: lastUpdateFrom = members[0]?.account?.professional || members[0]?.account?.orientation_manager;
	$: orientationRequest =
		beneficiary?.orientationRequest?.length > 0 ? beneficiary.orientationRequest[0] : null;
</script>

<div class="fr-py-6w flex flex-col gap-8">
	{#if orientationRequest && !orientationRequest?.decidedAt}
		<OrientationRequestBanner {orientationRequest} />
	{:else}
		<OrientationHeader {notebook} />
	{/if}
	<ProNotebookPersonalInfoView
		{beneficiary}
		lastUpdateDate={members[0]?.lastModifiedAt}
		{lastUpdateFrom}
	/>
	<div>
		<MainSection title="Situation socioprofessionnelle">
			<SocioProView {notebook} />
		</MainSection>
		<MainSection title="Groupe de suivi">
			<NotebookMembers members={notebook.members} />
		</MainSection>
		<MainSection title="Plan d'action">
			{#if notebook.focuses.length === 0}
				Pas d'actions en cours
			{/if}
			<ul class="list-none pl-0">
				{#each notebook.focuses as focus}
					<li>
						<h3 class="fr-h4">
							<span><span class="fr-icon-arrow-right-s-line" aria-hidden="true" /></span
							>{focusThemeKeys.byKey[focus.theme]}
						</h3>
						{#if focus.situations.length > 0}
							<ul class="list-none pl-0">
								{#each focus.situations as situation}
									<li>{situation}</li>
								{/each}
							</ul>
						{/if}
						<div class="py-4">
							<Accordions>
								{#each focus.targets as target}
									<Accordion title={target.target}>
										<ul>
											{#each target.actions as action}
												<li>
													{action.action}
													créé le {formatDateLocale(action.createdAt)}
													{#if action.creator}
														par {displayFullName(
															action.creator?.professional || action.creator?.orientation_manager
														)}
													{/if}
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
		</MainSection>
	</div>
</div>
