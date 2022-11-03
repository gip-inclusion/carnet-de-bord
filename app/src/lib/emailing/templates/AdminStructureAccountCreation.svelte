<script lang="ts">
	import Greeting from './components/Greeting.svelte';
	import AccessButton from './components/AccessButton.svelte';
	import Footer from './components/Footer.svelte';
	import type { Account } from '../emails';

	export let structure: string;
	export let email: string;
	export let account: Account;
	export let link: string;
</script>

<div>
	<Greeting person={account} />
	<p>
		Un compte vous a été créé sur l'application Carnet de bord pour administrer la structure {structure}.
	</p>
	<p>Votre identifiant de connexion est <b>{email}</b></p>
	<AccessButton {link} />
	<Footer />
</div>
