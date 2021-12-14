/*eslint-disable no-template-curly-in-string*/

import type {
	ArrayLocale,
	BooleanLocale,
	DateLocale,
	MixedLocale,
	NumberLocale,
	ObjectLocale,
	StringLocale,
} from 'yup/lib/locale';
import type { MessageParams } from 'yup/lib/types';
import { formatDateLocale } from './date';

// Based on https://github.com/jquense/yup/blob/2973d0a/src/locale.js
export const mixed: Required<MixedLocale> = {
	default: 'Ce champ est invalide',
	defined: 'Ce champ doit être défini',
	required: 'Ce champ est obligatoire',
	oneOf: "Ce champ doit avoir l'une des valeurs suivantes : ${values}",
	notOneOf: "Ce champ ne doit pas être l'une des valeurs suivantes : ${values}",
	notType: ({ originalValue, type }: MessageParams) => {
		// const isCast = originalValue != null && originalValue !== value;
		// let msg =
		// 	`Ce champ doit être du type \`${type}\`, ` +
		// 	`mais la valeur finale était: \`${printValue(value, true)}\`` +
		// 	(isCast ? ` (converti de la valeur \`${printValue(originalValue, true)}\`).` : '.');

		// if (value === null) {
		// 	msg +=
		// 		`\n Si « null » est conçue comme une valeur vide assurez-vous de marquer le schéma comme` +
		// 		' `.nullable()`';
		// }
		if (type === 'date' && !originalValue) {
			return `Ce champ est obligatoire`;
		}
		if (type === 'date' && originalValue) {
			return `La date n'est pas valide`;
		}
		return `Ce champ doit être du type \`${type}\``;
	},
};

export const string: Required<StringLocale> = {
	length: 'Ce champ doit faire exactement ${length} caractère(s)',
	min: 'Ce champ doit faire au moins ${min} caractère(s)',
	max: 'Ce champ doit faire au plus ${max} caractère(s)',
	matches: 'Ce champ doit correspondre au format demandé',
	email: 'Ce champ doit être un email valide',
	url: 'Ce champ doit être une URL valide',
	trim: 'Ce champ doit être une chaîne garnie',
	uuid: 'Ce champ doit être un uuid',
	lowercase: 'Ce champ doit être une chaîne en minuscules',
	uppercase: 'Ce champ doit être une chaîne en majuscules',
};

export const number: Required<NumberLocale> = {
	min: 'Ce champ doit être supérieur ou égal à ${min}',
	max: 'Ce champ doit être inférieur ou égal à ${max}',
	lessThan: 'Ce champ doit être inférieur à ${less}',
	moreThan: 'Ce champ doit être supérieur à ${more}',
	positive: 'Ce champ doit être un nombre positif',
	negative: 'Ce champ doit être un nombre négatif',
	integer: 'Ce champ doit être un nombre entier',
};

export const date: Required<DateLocale> = {
	min: ({ min }) =>
		`La date doit être après le ${
			min instanceof Date ? min.toLocaleDateString('fr-FR') : formatDateLocale(min)
		}`,
	max: ({ max }) =>
		`La date doit être avant le ${
			max instanceof Date ? max.toLocaleDateString('fr-FR') : formatDateLocale(max)
		}`,
};

export const boolean: Required<BooleanLocale> = {
	isValue: 'Ce champ doit être ${value} ',
};

export const object: Required<ObjectLocale> = {
	noUnknown: 'Ce champ ne peut pas avoir des clés non spécifiées',
};

export const array: Required<ArrayLocale> = {
	length: 'Ce champ doit avoir exactement ${length} élément(s)',
	min: 'Ce champ doit avoir au moins ${min} élément(s)',
	max: 'Ce champ champ doit avoir au plus ${max} élément(s)',
};
