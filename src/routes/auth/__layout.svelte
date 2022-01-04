<script lang="ts">
	import { HeaderCDB, FooterCDB } from '$lib/ui/index';
	import { Video } from '$lib/ui/base';

	const videoOptions = {
		sources: [
			{
				url: 'https://nextcloud.fabrique.social.gouv.fr/s/Nx3wbt6LTMrNqGE/download/intro-cdb-with-subs.mp4',
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
		poster: '/videos/intro-cdb.png',
	};
</script>

<HeaderCDB menuItems={[]} />

<div style="min-height: calc(100vh - 142.5px) flex">
	<div class="flex flex-row">
		<div class="w-1/2 p-20 bg-gray-bg flex items-center justify-center">
			<Video {...videoOptions} />
		</div>
		<div class="w-1/2 p-20">
			<slot />
		</div>
	</div>
</div>

<FooterCDB />
