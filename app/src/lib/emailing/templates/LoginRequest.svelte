<script lang="ts">
	import Greeting from './components/Greeting.svelte';
	import AccessButton from './components/AccessButton.svelte';
	import Footer from './components/Footer.svelte';
	import type { Person } from '../emails';

	export let pro: Person;
	export let link: string;
</script>

<div>
	<Greeting person={pro} />
	<AccessButton {link} />
	<Footer />
</div>
