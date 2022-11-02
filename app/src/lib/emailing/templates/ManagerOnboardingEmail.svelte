<script lang="ts">
	import AccessButton from './components/AccessButton.svelte';
	import Footer from './components/Footer.svelte';

	export let link: string;
	export let deployment: string;
</script>

<div>
	<p>Bonjour,</p>
	<p>
		Un compte vous a été créé sur l'application Carnet de bord pour administrer le déploiement <strong
			>${deployment}</strong
		>.
	</p>
	<AccessButton {link} />
	<Footer />
</div>
