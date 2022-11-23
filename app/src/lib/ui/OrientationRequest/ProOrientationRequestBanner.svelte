<script lang="ts">
	import { formatDateLocale } from '$lib/utils/date';

	export let reorientationRequest;
</script>

<div class="flex flex-row mb-8 items-center">
	<div class="text-france-blue fr-icon-info-fill" />
	<div class="fr-container">
		{#if reorientationRequest.status == 'pending'}
			<div class="fr-text--bold text-france-blue">
				Demande de réorientation envoyée le {formatDateLocale(reorientationRequest.createdAt)}
			</div>
		{:else if reorientationRequest.status == 'accepted'}
			<div class="fr-text--bold text-france-green">
				Demande de réorientation acceptée le {formatDateLocale(reorientationRequest.decidedAt)}
			</div>
		{:else if reorientationRequest.status == 'denied'}
			<div class="fr-text--bold text-france-red">
				Demande de réorientation refusée le {formatDateLocale(reorientationRequest.decidedAt)}
			</div>
		{/if}
		<div>
			Orientation recommandée : {reorientationRequest.requestedOrientationType.label}
		</div>
	</div>
</div>
