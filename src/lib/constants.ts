import { ActionStatus, EventType } from '$lib/enums';

// TODO(augustin): move this to an environment variable (distinct from SMTP_FROM)
export const contactEmail = 'support.carnet-de-bord@fabrique.social.gouv.fr';

export const statusValues: { label: string; name: string }[] = [
	{
		label: 'En cours',
		name: ActionStatus.InProgress,
	},
	{
		label: 'Réalisée',
		name: ActionStatus.Done,
	},
	{
		label: 'Abandonnée',
		name: ActionStatus.Abandoned,
	},
];

export const eventTypes: { label: string; name: string }[] = [
	{
		label: 'Action',
		name: EventType.Action,
	},
	{
		label: 'Objectif',
		name: EventType.Target,
	},
];
