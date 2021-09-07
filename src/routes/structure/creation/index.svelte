<script lang="ts">
	import StructureFormInfo from '$lib/ui/StructureFormInfo.svelte';
</script>

<div class="flex flex-col gap-8 px-40 mt-8">
	<div>
		<h1>Soumettre une nouvelle structure</h1>
		<p>Votre demande fera l’objet d’une validation par l’administrateur du Carnet de bord.</p>
	</div>
	<div>
		<h2 class="bf-500 fr-h4">Identification de la structure</h2>
		<StructureFormInfo structure={{}} disabled={false} fieldErrors={{}} />
	</div>
</div>

<style lang="postcss">
	.bf-500 {
		color: var(--bf500);
	}
</style>
