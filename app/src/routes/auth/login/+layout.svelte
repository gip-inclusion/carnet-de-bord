<script lang="ts">
	import { Video } from '$lib/ui/base';

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
