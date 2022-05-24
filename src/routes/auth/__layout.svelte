<script lang="ts">
	import { HeaderCDB, FooterCDB } from '$lib/ui/index';
	import { Video } from '$lib/ui/base';

	const videoOptions = {
		sources: [
			/**
			 * Video with neither subtitles nor voiceover
			 * {
			 *   url: 'https://nextcloud.fabrique.social.gouv.fr/s/TtM2A7KkD55MqZ3/download/intro-cdb.mp4',
			 *   type: 'video/mp4',
			 * },
			 */

			/**
			 * Video with voiceover
			 */
			{
				url: 'https://nextcloud.fabrique.social.gouv.fr/s/KjFZxq4CFE76fyD/download/intro-cdb-voiceover.mp4',
				type: 'video/mp4',
			},

			/**
			 * Video with embedded subtitles
			 * {
			 *   url: 'https://nextcloud.fabrique.social.gouv.fr/s/Nx3wbt6LTMrNqGE/download/intro-cdb-with-subs.mp4',
			 *   type: 'video/mp4',
			 * },
			 */
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

<HeaderCDB menuItems={[]} />

<div class="fr-container" style="min-height: calc(100vh - 142.5px)">
	<div class="flex flex-row">
		<div class="w-1/2 py-20 pr-10">
			<Video {...videoOptions} />
		</div>
		<div class="w-1/2 py-20 pl-10">
			<slot />
		</div>
	</div>
</div>

<FooterCDB />
