<script lang="ts">
	import { HeaderCDB, FooterCDB } from '$lib/ui/index';
</script>

<HeaderCDB menuItems={[]} />

<div style="min-height: calc(100vh - 142.5px) flex">
	<div class="flex flex-row">
		<div class="w-1/2 bg-gray-bg flex items-center justify-center">
			<img class="h-full max-h-96" src="/static/logo-cdb.svg" alt="" aria-hidden />
		</div>
		<div class="w-1/2 p-20">
			<slot />
		</div>
	</div>
</div>

<FooterCDB />
