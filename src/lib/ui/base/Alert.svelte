<script lang="ts">
	type AlertType = 'error' | 'success' | 'info';
	type AlertSize = 'sm' | 'md';
	export let type: AlertType;
	export let size: AlertSize = 'md';
	export let title = '';
	export let description = '';
	export let id: string | null = null;

	if (size === 'sm') {
		if (!description) {
			description = title;
			title = '';
		}
	} else {
		if (!title) {
			title = description;
			description = '';
		}
	}
</script>

<div {id} role="alert" class="fr-alert fr-alert--{type} fr-alert--{size}">
	{#if title}
		<p class="fr-alert__title">{title}</p>
	{/if}
	{#if description}
		<p>{description}</p>
	{/if}
</div>
