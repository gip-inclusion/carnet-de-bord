<script lang="ts">
	import { formatDateLocale } from '$lib/utils/date';

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
</script>

<div class="flex flex-row mb-8 items-center">
	<div class="{color} fr-icon-info-fill" />
	<div class="fr-container">
		<div class="fr-text--bold {color}">
			Demande de réorientation {decision} le {formatDateLocale(reorientationRequest.createdAt)}
		</div>
		<div>
			Orientation recommandée : {reorientationRequest.requestedOrientationType.label}
		</div>
	</div>
</div>
