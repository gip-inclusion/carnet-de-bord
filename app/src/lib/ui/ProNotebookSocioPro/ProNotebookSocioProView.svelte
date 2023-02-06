<script lang="ts">
	import { openComponent } from '$lib/stores';
	import { Button } from '../base';
	import ProCarnetSocioProUpdate from './ProNotebookSocioProUpdate.svelte';
	import SocioProView, { type SocioProInfo } from '../Beneficiary/SocioProView.svelte';

	export let notebook: SocioProInfo;

	const editSocioProSituation = () => {
		openComponent.open({
			component: ProCarnetSocioProUpdate,
			props: {
				notebook: {
					...notebook,
					wantedJobs: notebook.wantedJobs.map(({ rome_code }) => rome_code.id),
				},
				options: notebook.wantedJobs.map(({ rome_code }) => rome_code),
			},
		});
	};
</script>

<div class="flex flex-col space-y-6">
	<SocioProView {notebook} />
	<Button classNames="self-start" on:click={() => editSocioProSituation()} outline
		>Mettre à jour</Button
	>
</div>
