<script lang="ts">
	export { load } from '$lib/commonImports';
	import { HeaderCDB, FooterCDB } from '$lib/ui/index';
</script>

<HeaderCDB menuItems={[]} />

<div style="min-height: calc(100vh - 200px)">
	<div class="flex flex-row">
		<div class="w-1/2 bg-gray-bg"><img src="" alt="" /></div>
		<div class="w-1/2 p-20">
			<slot />
		</div>
	</div>
</div>

<FooterCDB />
