<script lang="ts" context="module">
	let counter = 0;
</script>

<script lang="ts">
	import { trackEvent } from '$lib/tracking/matomo';

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
	export let hideControls = false;
	const videoId = `video-${counter++}`;

	let tracked = false;

	function trackVideo() {
		if (!tracked) {
			tracked = true;
			trackEvent('media', 'video', 'play');
		}
	}

	let hovered: boolean;
	$: controls = !hideControls || hovered;
</script>

<div class="flex flex-col">
	{#if title}
		<h4 class="!text-vert-cdb">{title}</h4>
	{/if}
	<!-- svelte-ignore a11y-media-has-caption -->
	<!-- see https://github.com/sveltejs/svelte/issues/5967 -->
	<video
		class="!cursor-pointer"
		id={videoId}
		{controls}
		{preload}
		{poster}
		on:mouseenter={() => (hovered = true)}
		on:mouseleave={() => (hovered = false)}
		on:click={trackVideo}
	>
		{#each sources as source}
			<source src={source.url} type={source.type} />
		{/each}
		{#each tracks as track}
			<track label={track.label} kind="captions" srclang={track.lang} src={track.url} default />
		{/each}
	</video>
</div>
