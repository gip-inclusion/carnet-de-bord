<script lang="ts">
	import { HeaderCDB, FooterCDB, LayerCDB } from '$lib/ui/index';
</script>

<HeaderCDB menuItems={[]} />

<div class="fr-container" style="min-height: calc(100vh - 200px)">
	<slot />
	<LayerCDB />
</div>

<FooterCDB />
