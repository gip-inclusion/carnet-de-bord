<script lang="ts">
	export let label = 'Chargement...';
</script>

<div class={`flex items-center gap-2 text-gray-500 ${$$props.class}`} role="status">
	<span class="h-8 w-8 block rounded-full border-4 border-t-vert-cdb-500 animate-spin" />
	{label}
</div>
