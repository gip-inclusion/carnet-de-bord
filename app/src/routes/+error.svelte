<script lang="ts">
	import Footer from '$lib/ui/base/Footer.svelte';
	import Header from '$lib/ui/base/Header.svelte';

	import { LayerCDB } from '$lib/ui/index';
</script>

<Header menuItems={[]} />

<div
	class="fr-container fr-container--fluid fr-py-6w fr-px-2w"
	style="min-height: calc(100vh - 200px)"
>
	<div class="flex flex-col gap-8">
		<h1>La page que vous avez demandé n'existe pas !</h1>
		<h2>Peut-être vouliez-vous vous rendre sur <a href="/">l'accueil</a> ?</h2>
	</div>
	<LayerCDB />
</div>

<Footer />
