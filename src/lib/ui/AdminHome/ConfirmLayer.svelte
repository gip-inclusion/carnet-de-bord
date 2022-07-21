<script lang="ts">
	import { openComponent } from '$lib/stores';
	import { Button } from '$lib/ui/base';

	function closeLayer() {
		openComponent.close();
	}

	export let title: string;
	export let text: string;
	export let ConfirmLabel = 'Oui';
	export let CancelLabel = 'Annuler';

	export let acceptHandler: () => void;
	export let cancelHandler: () => void;

	async function onAccept() {
		closeLayer();
		acceptHandler();
	}
	async function onCancel() {
		closeLayer();
		if (cancelHandler) cancelHandler();
	}
</script>

<div class="flex h-full items-center">
	<div class="px-16">
		<h1>{title}</h1>
		<p>{text}</p>
		<div class="flex flex-row gap-6">
			<Button on:click={onAccept}>{ConfirmLabel}</Button>
			<Button outline on:click={onCancel}>{CancelLabel}</Button>
		</div>
	</div>
</div>
