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
	<p>Votre demande d'inscription à Carnet de bord a été acceptée.</p>
	<AccessButton {link} />
	<Footer />
</div>
