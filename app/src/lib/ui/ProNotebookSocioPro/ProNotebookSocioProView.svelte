<script lang="ts">
	import { Button } from '../base';
	import { RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';
	import SocioProView, {
		type SocioProInfo,
		type ExternalDataDetail,
		type Focus,
	} from '../Beneficiary/SocioProView.svelte';
	import { homeForRole } from '$lib/routes';
	import { goto } from '$app/navigation';

	export let notebook: SocioProInfo;
	export let externalDataDetail: ExternalDataDetail | null;
	export let focuses: Focus[] | null;
</script>

<div class="flex flex-col space-y-6">
	<SocioProView {notebook} {externalDataDetail} {focuses} />

	<Button
		classNames="self-start"
		on:click={() => goto(`${homeForRole(RoleEnum.Professional)}/carnet/${notebook.id}/diagnostic`)}
		outline>Mettre à jour</Button
	>
</div>
