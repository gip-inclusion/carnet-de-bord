import { TargetStatus } from '$lib/enums';
import { ActionStatusEnum, NotebookEventTypeEnum } from './graphql/_gen/typed-document-nodes';

export const targetStatusValues: { label: string; name: string }[] = [
	{
		label: 'En cours',
		name: TargetStatus.InProgress,
	},
	{
		label: 'Réalisée',
		name: TargetStatus.Done,
	},
	{
		label: 'Abandonnée',
		name: TargetStatus.Abandonned,
	},
];
export const actionStatusValues: { label: string; name: ActionStatusEnum }[] = [
	{
		label: 'En cours',
		name: ActionStatusEnum.InProgress,
	},
	{
		label: 'Abandonnée par le bénéficiaire',
		name: ActionStatusEnum.Abandonned,
	},
	{
		label: 'Annulée par la structure',
		name: ActionStatusEnum.Canceled,
	},
	{
		label: 'Réalisée',
		name: ActionStatusEnum.Done,
	},
	{
		label: 'En projet',
		name: ActionStatusEnum.Planned,
	},
	{
		label: 'En attente',
		name: ActionStatusEnum.Standby,
	},
];
export const eventTypes: { label: string; name: string }[] = [
	{
		label: 'Action',
		name: NotebookEventTypeEnum.Action,
	},
	{
		label: 'Objectif',
		name: NotebookEventTypeEnum.Target,
	},
	{
		label: 'Réorientation',
		name: NotebookEventTypeEnum.Orientation,
	},
];
