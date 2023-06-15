<script lang="ts">
	import type { GetNotebookQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { formatDateLocale } from '$lib/utils/date';
	import { getOrientationSystemLabel } from '$lib/utils/getOrientationSystemLabel';
	import Dialog from '../Dialog.svelte';
	import Text from '../utils/Text.svelte';

	export let reorientationRequest: GetNotebookQuery['notebook_public_view'][number]['beneficiary']['orientationRequest'][number];

	$: color =
		reorientationRequest.status == 'denied'
			? 'text-marianne-red'
			: reorientationRequest.status == 'accepted'
			? 'text-success'
			: 'text-vert-cdb';

	$: decision =
		reorientationRequest.status == 'denied'
			? 'refusée'
			: reorientationRequest.status == 'accepted'
			? 'acceptée'
			: 'envoyée';

	$: date =
		reorientationRequest.status == 'denied' || reorientationRequest.status == 'accepted'
			? formatDateLocale(reorientationRequest.decidedAt)
			: formatDateLocale(reorientationRequest.createdAt);

	$: [orientationLabel, displayedOrientation] =
		decision == 'acceptée'
			? [
					"Décision d'orientation",
					getOrientationSystemLabel(reorientationRequest.decidedOrientationSystem),
			  ]
			: [
					'Orientation recommandée',
					getOrientationSystemLabel(reorientationRequest.requestedOrientationSystem),
			  ];
</script>

<div class="bg-gray-100">
	<div class="fr-container">
		<div class="flex flex-row gap-4 items-top fr-py-3w">
			<div class="{color} fr-icon-info-fill" aria-hidden />
			<div>
				<p class="fr-text--bold {color} mb-0">
					Demande de réorientation {decision} le {date}
				</p>
				<p class="mb-0">
					{orientationLabel} : {displayedOrientation}
				</p>
			</div>
			<div>
				{#if reorientationRequest.status === 'denied' && reorientationRequest.decisionReason}
					<Dialog
						label="Voir le motif du maintien d'accompagnement"
						buttonLabel="Voir le motif du refus"
						showButtons={false}
						title="Maintien de l'accompagnement"
						buttonCssClasses="fr-btn--tertiary-no-outline"
					>
						<p>
							Date de la demande de réorientation&nbsp;: <b> {date} </b>
						</p>
						<p>
							Orientation recommandée&nbsp;: <span class="fr-badge fr-badge-sm fr-badge--grey"
								>{getOrientationSystemLabel(reorientationRequest.requestedOrientationSystem)}
							</span>
						</p>
						<h2 class="fr-h4">Motif du maintien</h2>
						<div class="bg-gray-100 p-4">
							<Text
								value={reorientationRequest.decisionReason}
								defaultValue="non renseigné"
								defaultValueClassNames=" italic text-gray"
							/>
						</div>
					</Dialog>
				{/if}
			</div>
		</div>
	</div>
</div>
