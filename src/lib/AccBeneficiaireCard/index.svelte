<script lang="ts">
	export let beneficiaire;
</script>

<div class="border-2 m-2">
	<div class="flex flex-row">
		<div class="p-2 bg-blue-200" />
		<div>
			<div>{beneficiaire.nom}</div>
			<div class="pl-2">{beneficiaire.prenom}</div>
		</div>
	</div>
</div>
