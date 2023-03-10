<script lang="ts">
	import { pluck } from '$lib/helpers';
	export let icon: string;
	export let title: string;
	export let type: 'button' | 'reset' | 'submit' = 'button';

	$: buttonProps = pluck(['icon', 'title', 'class', 'type'], $$props);
</script>

<button on:click {type} {title} class="fr-btn {icon} {$$props.class ?? ''}" {...buttonProps}>
	{title}
</button>
