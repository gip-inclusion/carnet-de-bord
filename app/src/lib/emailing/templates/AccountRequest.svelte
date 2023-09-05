<script context="module" lang="ts">
	import type { InscriptionRequest } from '../../../routes/(public)/inscription/request/+server';
	export type AccountRequest = InscriptionRequest['accountRequest'];
</script>

<script lang="ts">
	import Greeting from './components/Greeting.svelte';
	import AccessButton from './components/AccessButton.svelte';
	import Footer from './components/Footer.svelte';
	import { displayFullName } from '$lib/ui/format';
	import type { Person } from '../emails';

	export let pro: AccountRequest;
	export let structureName: string;
	export let link: string;
	export let requester: Person | undefined;
</script>

<div>
	<Greeting />
	<p>Une demande de création d'un compte pour {displayFullName(pro)} a été reçue.</p>
	<b>Informations personnelles :</b>
	<ul>
		{#if structureName}<li>Structure : {structureName}</li>{/if}
		{#if pro}<li>NOM Prénom: {displayFullName(pro, 'lastname first')}</li>{/if}
		{#if pro.email}<li>Courriel : {pro.email}</li>{/if}
		{#if pro.mobileNumber}<li>téléphone : {pro.mobileNumber}</li>{/if}
		{#if pro.position}<li>position : {pro.position}</li>{/if}
		{#if requester}<p>Cette demande a été soumise par {displayFullName(requester)}.</p>{/if}
		<p>
			Vous recevez ce message parce que vous êtes manager de ce déploiement. Veuillez vous connecter
			à Carnet de bord pour confirmer cette inscription.
		</p>
	</ul>
	<AccessButton {link} />
	<Footer />
</div>
