<script context="module" lang="ts">
	import { homeForRole } from '$lib/routes';
	import { Breadcrumbs, Card } from '$lib/ui/base';
</script>

<script lang="ts">
	import { pluralize } from '$lib/helpers';

	$: breadcrumbs = [
		{
			name: 'accueil',
			path: homeForRole('orientation_manager'),
			label: 'Accueil',
		},
	];
	$: metrics = [
		{
			label: `${pluralize('Bénéficiaire', 609)} sur mon territoire`,
			amount: 609,
			link: 'orientation/beneficiaires',
		},
		{
			label: `${pluralize('Bénéficiaire', 562)} ${pluralize('accompagné', 562)}`,
			amount: 562,
			link: 'orientation/beneficiaires?filter=withMember',
		},
		{
			label: `${pluralize('Bénéficiaire', 47)} à orienter`,
			amount: 47,
			classNames: 'text-marianne-red',
			link: 'orientation/beneficiaires?filter=noMember',
		},
	];
</script>

<svelte:head>
	<title>Chargé d'orientation - Carnet de bord</title>
</svelte:head>

<Breadcrumbs segments={breadcrumbs} />
<div class="flex flex-col gap-6">
	<div class="flex flex-row gap-6">
		<div class="grow">
			<h2 class="fr-h4 !text-france-blue">Accueil</h2>
			<div class="fr-grid-row fr-grid-row--gutters">
				{#each metrics as item (item.label)}
					<div class="fr-col-sm-6 fr-col-md-4 fr-col-lg-4">
						<Card horizontal={true} hideArrow={!item.link} href={item.link}>
							<div slot="title">
								<div
									class={`pb-1 flex flex-row font-bold text-3xl tracking-wider ${
										item.classNames || ''
									}`}
								>
									{item.amount}
								</div>
								<span class={`font-normal leading-6 text-sm ${item.classNames}`}>{item.label}</span>
							</div>
						</Card>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
