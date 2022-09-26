<script lang="ts">
	import { openComponent } from '$lib/stores';
	import { Button } from '$lib/ui/base';
</script>

<div class="flex flex-col gap-6">
	<h1>Nouvel axe de travail créé !</h1>
	<p>Le nouvel axe de travail a été créé avec succès.</p>
	<div>
		<Button on:click={openComponent.close}>J'ai compris</Button>
	</div>
</div>
