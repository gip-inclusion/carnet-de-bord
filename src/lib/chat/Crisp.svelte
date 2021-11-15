<script lang="ts">
	import { onMount } from 'svelte';
	export let websiteId: string;

	onMount(async () => {
		window.$crisp = [];
		window.CRISP_WEBSITE_ID = websiteId;

		(function () {
			let d = document;
			let s = d.createElement('script');
			s.src = 'https://client.crisp.chat/l.js';
			s.async = true;
			d.getElementsByTagName('head')[0].appendChild(s);
		})();
	});
</script>

<svelte:head />
