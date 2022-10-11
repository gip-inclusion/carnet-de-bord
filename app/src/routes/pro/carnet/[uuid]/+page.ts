import type {
	GetNotebookQueryStore,
	GetNotebookEventsQueryStore,
} from '$lib/graphql/_gen/typed-document-nodes';
import {
	GetNotebookDocument,
	UpdateNotebookVisitDateDocument,
	GetNotebookEventsDocument,
} from '$lib/graphql/_gen/typed-document-nodes';
import { stringsMatch } from '$lib/helpers';
import { MainAccordion, Accordions, Select, SearchBar } from '$lib/ui/base';
import { ProNotebookFocusView } from '$lib/ui/ProNotebookFocus';
import { ProNotebookMembersView } from '$lib/ui/ProNotebookMember';
import { ProNotebookPersonalInfoView } from '$lib/ui/ProNotebookPersonalInfo';
import { ProNotebookSocioProView } from '$lib/ui/ProNotebookSocioPro';
import { LoaderIndicator } from '$lib/ui/utils';
import { statusValues, eventTypes } from '$lib/constants';
import { EventType } from '$lib/enums';
import { formatDateLocale } from '$lib/utils/date';
import type { PageLoad } from '@sveltejs/kit';
import { mutation, operationStore, query } from '@urql/svelte';
import { addMonths } from 'date-fns';
import { focusThemeKeys } from '$lib/constants/keys';

type Period =
	| typeof allEvents
	| typeof threeMonths
	| typeof threeSixMonths
	| typeof sixTwelveMonths
	| typeof twelveMonths
	| null;
const allEvents = 'allEvents';
const threeMonths = '-3months';
const threeSixMonths = '3-6months';
const sixTwelveMonths = '6-12months';
const twelveMonths = '+12months';

function toDateFormat(date: Date) {
	const yyyy = date.getFullYear().toString().padStart(4, '0');
	const mm = (1 + date.getMonth()).toString().padStart(2, '0');
	const dd = date.getDate().toString().padStart(2, '0');

	return `${yyyy}-${mm}-${dd}`;
}

function eventCategory(event): string {
	if (event.eventType == EventType.Action || event.eventType == EventType.Target) {
		return (
			constantToString(event.eventType, eventTypes) +
			' ' +
			focusThemeKeys.byKey[event.event.category]
		);
	} else {
		return 'Inconnue';
	}
}

function constantToString(status: string, statusValues: { label: string; name: string }[]): string {
	let status_string: { label: string; name: string } = statusValues.find((v) => v.name == status);

	return status_string ? status_string.label : 'Inconnu';
}

function buildQueryVariables<Vars>(
	variables: Vars & {
		eventsStart?: string;
		eventsEnd?: string;
	},
	selected: Period
) {
	let eventsStart: Date;
	let eventsEnd: Date;
	const today = new Date();
	if (selected === threeMonths) {
		eventsStart = addMonths(today, -3);
	} else if (selected === threeSixMonths) {
		eventsStart = addMonths(today, -6);
		eventsEnd = addMonths(today, -3);
	} else if (selected === sixTwelveMonths) {
		eventsStart = addMonths(today, -12);
		eventsEnd = addMonths(today, -6);
	} else if (selected === twelveMonths) {
		eventsEnd = addMonths(today, -12);
	}

	if (eventsStart) {
		variables.eventsStart = toDateFormat(eventsStart);
	}
	if (eventsEnd) {
		variables.eventsEnd = toDateFormat(eventsEnd);
	}
	return variables;
}

export const load: PageLoad = ({ params }) => {
	const notebookId = params.uuid;
	const variables = { id: notebookId };
	const selected = threeMonths;
	const getNotebook = operationStore(
		GetNotebookDocument,
		buildQueryVariables(variables, selected),
		{ additionalTypenames: ['notebook_action', 'notebook_appointment'] }
	);

	return {
		notebookId,
		getNotebook,
		selected,
	};
};
