<script lang="ts">
	import Greeting from './components/Greeting.svelte';
	import AccessButton from './components/AccessButton.svelte';
	import Footer from './components/Footer.svelte';
	import type { Person } from '../emails';

	export let email: string;
	export let account: Person;
	export let structure: string;
	export let link: string;
</script>

<div>
	<Greeting person={account} />
	<AccessButton {link} />
	<p>Vous pouvez désormais administrer la structure {structure}.</p>
	<p>Votre identifiant de connexion est <b>{email}</b></p>
	<Footer />
</div>
