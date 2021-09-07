<script lang="ts">
	import { HeaderCDB, FooterCDB } from '$lib/ui/index';
</script>

<HeaderCDB menuItems={[]} />

<div class="fr-container" style="min-height: calc(100vh - 200px)">
	<slot />
</div>

<FooterCDB />
