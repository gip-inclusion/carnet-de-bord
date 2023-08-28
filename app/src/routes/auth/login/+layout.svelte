<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Video } from '$lib/ui/base';
	import { onMount } from 'svelte';

	onMount(async () => {
		const response = await fetch('/me');
		if (response.ok) {
			const redirectPage = $page.url.searchParams.get('redirect') ?? '/';
			goto(redirectPage, { replaceState: false });
		}
	});

	const videoOptions = {
		sources: [
			/**
			 * Video with voiceover
			 */
			{
				url: '/videos/intro-cdb.mp4',
				type: 'video/mp4',
			},
		],
		tracks: [
			{
				url: '/videos/intro-cdb.websrt',
				label: 'Français',
				lang: 'fr',
			},
		],
		title: 'Découvrez Carnet de bord en vidéo !',
		preload: 'none',
		hideControls: true,
		poster: '/videos/intro-cdb.png',
	};
</script>

<div class="w-1/2 py-20 pr-10">
	<Video {...videoOptions} />
</div>
<div class="w-1/2 py-20 pl-10">
	<slot />
</div>
