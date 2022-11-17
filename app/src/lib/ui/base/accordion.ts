import { type Writable, writable } from 'svelte/store';

export const ACCORDION = {};

export const accordionCounter = writable(0);

export type AccordionContext = {
	registerAccordionItem: (accordion: Record<never, never>) => void;
	accordionItems: Writable<Record<never, never>>;
	selectedItem: Writable<Record<never, never>>;
};
