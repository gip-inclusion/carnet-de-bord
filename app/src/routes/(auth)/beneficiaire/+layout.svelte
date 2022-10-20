<script>
	import Footer from '$lib/ui/base/Footer.svelte';
	import Header from '$lib/ui/base/Header.svelte';
</script>

<Header menuItems={[]} />

<div class="fr-container fr-py-6w fr-px-2w" style="min-height: calc(100vh - 200px)">
	<div class="flex flex-col gap-8"><slot /></div>
</div>

<Footer />
