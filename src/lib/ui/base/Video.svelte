<script lang="ts" context="module">
	let counter = 0;
</script>

<script lang="ts">
	type Source = {
		url: string;
		type: string;
	};
	type Track = {
		url: string;
		label: string;
		lang: string;
	};
	export let sources: Source[];
	export let tracks: Track[];
	export let title = '';
	export let preload = 'metadata';
	export let poster = '';
	const videoId = `video-${counter++}`;
</script>

<div>
	{#if title}
		<h4 class="fr-h5 !text-france-blue">{title}</h4>
	{/if}
	<!-- svelte-ignore a11y-media-has-caption -->
	<!-- see https://github.com/sveltejs/svelte/issues/5967 -->
	<video id={videoId} controls {preload} {poster}>
		{#each sources as source}
			<source src={source.url} type={source.type} />
		{/each}
		{#each tracks as track}
			<track label={track.label} kind="captions" srclang={track.lang} src={track.url} default />
		{/each}
	</video>
</div>
