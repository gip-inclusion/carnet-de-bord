<script lang="ts">
	export let icon: string;
	export let ariaLabel: string;
	export let classNames = '';
</script>

<button on:click type="button" class="bt text-2xl text-france-blue {classNames}">
	<span class={icon} aria-label={ariaLabel} />
</button>
