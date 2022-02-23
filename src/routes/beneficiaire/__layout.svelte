<script>
	import { FooterCDB, HeaderCDB, LayerCDB } from '$lib/ui';
</script>

<HeaderCDB menuItems={[]} />

<div class="fr-container fr-py-6w fr-px-2w" style="min-height: calc(100vh - 200px)">
	<div class="flex flex-col gap-8 px-40"><slot /></div>
	<LayerCDB />
</div>

<FooterCDB />
