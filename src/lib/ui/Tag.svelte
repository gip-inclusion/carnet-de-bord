<script lang="ts">
	export let classNames = '';
</script>

<div
	{...$$props}
	class="m-1 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 rounded-full bg-gray-100 cursor-pointer {classNames}"
>
	<slot />
</div>
