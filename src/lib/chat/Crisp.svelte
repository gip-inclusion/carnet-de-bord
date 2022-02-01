<script lang="ts">
	import { onMount } from 'svelte';
	import { crispData } from '$lib/stores';
	import { displayFullName } from '$lib/ui/format';
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

		if (typeof window.$crisp !== 'undefined') {
			const crisp = window.$crisp;
			crispData.subscribe((data) => {
				if (data) {
					const { username, firstname, lastname, email, mobileNumber, position, structure } = data;
					const { name, city, deployment } = structure ?? {};
					const { label } = deployment ?? {};
					crisp.push([
						'set',
						'session:data',
						[
							[
								['firstname', firstname],
								['lastname', lastname],
								['username', username],
								['email', email],
								['mobileNumber', mobileNumber],
								['position', position],
								['structure', name],
								['city', city],
								['deployment', label],
							],
						],
					]);
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
						crisp.push(['set', 'user:company', [`${name}`, extra]]);
					}
				}
			});
		}
	});
</script>

<svelte:head />
