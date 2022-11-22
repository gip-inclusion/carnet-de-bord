<script lang="ts">
	import Greeting from './components/Greeting.svelte';
	import AccessButton from './components/AccessButton.svelte';
	import Footer from './components/Footer.svelte';
	import type { Account } from '../emails';

	export let account: Account;
	export let link: string;
</script>

<div>
	<Greeting person={account} />
	<p>
		Votre identifiant de connexion est <b>{account.username}</b>
	</p>
	<AccessButton {link} />
	<Footer />
</div>
