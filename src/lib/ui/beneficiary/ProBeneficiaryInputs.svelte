<script lang="ts">
	import type { ExternalUser } from '$lib/types';

	import BeneficiaryFormInfo from './BeneficiaryInputs.svelte';
	export let user: ExternalUser;
</script>

<div class="font-bold mb-6">Veuillez renseigner les informations ci-dessous.</div>
<BeneficiaryFormInfo bind:user />
