<script lang="ts">
	import { onDestroy } from 'svelte';
	import { crispData } from '$lib/stores';
	import { displayFullName } from '$lib/ui/format';
	import { browser } from '$app/environment';

	let unsubscribe: () => void;

	unsubscribe = crispData.subscribe((data) => {
		if (!data || !browser) {
			return;
		}

		const crisp = window.$crisp;
		if (!crisp) {
			return;
		}
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
