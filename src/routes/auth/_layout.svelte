<!--
cannot use this because of a weird bug in Svelte where it looks this file up in a cyclic way, like so:
ENOENT: no such file or directory, open '/home/augustin/Code/carnet-de-bord/src/routes/auth/src/routes/auth/__layout.svelte'

It looks it up in
/home/augustin/Code/carnet-de-bord/src/routes/auth/src/routes/auth/__layout.svelte
while it should look it up in
/home/augustin/Code/carnet-de-bord/src/routes/auth/__layout.svelte
-->
<div class="flex flex-row">
	<div class="w-1/2 bg-gray-bg"><img src="" alt="" /></div>
	<div class="w-1/2 p-20">
		<slot />
	</div>
</div>
