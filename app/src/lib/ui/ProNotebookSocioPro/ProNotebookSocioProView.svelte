<script lang="ts">
	import { Button } from '../base';
	import SocioProView, {
		type SocioProInfo,
		type ExternalDataDetail,
	} from '../Beneficiary/SocioProView.svelte';

	export let notebook: SocioProInfo;
	export let externalDataDetail: ExternalDataDetail | null;
</script>

<div class="flex flex-col space-y-6">
	<SocioProView {notebook} {externalDataDetail} />

	<Button
		classNames="self-start"
		on:click
		outline
		title="Mettre à jour le diagnostic socioprofessionnel">Mettre à jour</Button
	>
</div>
