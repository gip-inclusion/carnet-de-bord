<script lang="ts">
	import Greeting from './components/Greeting.svelte';
	import Footer from './components/Footer.svelte';
	import AccessButton from './components/AccessButton.svelte';
	import { displayFullName } from '$lib/ui/format';
	import type { Person } from '../emails';

	export let link: string;
	export let pro: Person;
	export let creator: Person;
</script>

<div>
	<Greeting person={pro} />
	{#if creator.firstname && creator.lastname}
		<p>
			Vous avez été invité(e) à rejoindre un carnet de bord par
			<b>{displayFullName(creator)}</b>.
		</p>
	{/if}
	<AccessButton {link} />
	<Footer />
</div>
