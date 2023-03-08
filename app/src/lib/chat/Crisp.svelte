<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { crispData } from '$lib/stores';
	import { displayFullName } from '$lib/ui/format';
	import { browser } from '$app/environment';
	export let websiteId: string;

	let unsubscribe: () => void;

	onMount(async () => {
		window.$crisp = [];
		window.CRISP_WEBSITE_ID = websiteId;

		(function () {
			const d = document;
			const s = d.createElement('script');
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
		const { name, deployment } = structure ?? {};

		//Available fields user:email, user:phone, user:nickname, user:avatar, user:company
		crisp.push(['set', 'user:nickname', [displayFullName({ firstname, lastname })]]);
		if (email) {
			crisp.push(['set', 'user:email', [`${email}`]]);
		}
		if (mobileNumber) {
			crisp.push(['set', 'user:phone', [`${mobileNumber}`]]);
		}
		if (name) {
			crisp.push(['set', 'user:company', [`${name}`]]);
		}
		// additionnal data in session:data
		crisp.push([
			'set',
			'session:data',
			[
				[
					['username', username],
					['deployment', deployment.label],
				],
			],
		]);

		// disable warning about shimmed JS methods (caused by Sentry)
		crisp.push(['safe', true]);
	});
	onDestroy(unsubscribe);
</script>

<svelte:head />
