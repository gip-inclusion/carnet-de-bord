<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { crispData } from '$lib/stores';
	import { displayFullName } from '$lib/ui/format';
	import { browser } from '$app/env';
	export let websiteId: string;

	let unsubscribe: () => void;

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

	unsubscribe = crispData.subscribe((data) => {
		if (!data || !browser) {
			return;
		}

		const crisp = window.$crisp;
		const { username, firstname, lastname, email, mobileNumber, structure } = data;
		const { name, city } = structure ?? {};
		crisp.push(['set', 'user:nickname', [displayFullName({ firstname, lastname })]]);
		if (username) {
			crisp.push(['set', 'user:description', [`nom d'utilisateur : ${username}`]]);
		}
		if (email) {
			crisp.push(['set', 'user:email', [`${email}`]]);
		}
		if (mobileNumber) {
			crisp.push(['set', 'user:phone', [`${mobileNumber}`]]);
		}
		/* if (label) { */
		/*   crisp.push(["set", "user:phone", [`${mobileNumber}`]]); */
		/* } */
		if (name) {
			const extra = {} as Record<string, string[]>;
			if (city) {
				extra.geolocation = [`${city}`];
			}
			crisp.push(['set', 'user:company', [`${name}`]]);
		}
	});
	onDestroy(unsubscribe);
</script>

<svelte:head />
