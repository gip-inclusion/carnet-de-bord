<script lang="ts">
	import { pluck } from '$lib/helpers';
	export let icon: string;
	export let title: string;
	export let type = 'button';

	$: buttonProps = pluck(['icon', 'title', 'class'], $$props);
</script>

<button on:click {type} {title} class="fr-btn {icon} {$$props.class}" {...buttonProps}>
	{title}
</button>
