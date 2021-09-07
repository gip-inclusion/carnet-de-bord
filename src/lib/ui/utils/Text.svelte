<script lang="ts">
	export let value: string;
	export let classNames = '';
	export let defaultValue = '-';
</script>

<div class={classNames}>{value || defaultValue}</div>
