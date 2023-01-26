<script lang="ts">
	import { formatDateLocale } from '$lib/utils/date';
	import { getOrientationSystemLabel } from '$lib/utils/getOrientationSystemLabel';

	export let reorientationRequest;

	$: color =
		reorientationRequest.status == 'denied'
			? 'text-marianne-red'
			: reorientationRequest.status == 'accepted'
			? 'text-success'
			: 'text-france-blue';

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
		</div>
	</div>
</div>
