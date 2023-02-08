<script lang="ts">
	import { connectedUser, graphqlAPI, token } from '$lib/stores';
	import { Elm as OrientationHomeElm } from '../../../../elm/OrientationHome/Main.elm';
	import { onMount } from 'svelte';

	let elmNode: HTMLElement;
	onMount(() => {
		if (!elmNode) return;
		OrientationHomeElm.OrientationHome.Main.init({
			node: elmNode,
			flags: {
				token: $token,
				serverUrl: $graphqlAPI,
				accountId: $connectedUser.id,
			},
		});
	});
</script>

<h1 class="fr-h2 fr-mt-6w">Accueil</h1>
<div>
	<!-- Elm app needs to be wrapped by a div to avoid navigation exceptions when unmounting -->
	<div bind:this={elmNode} />
</div>
