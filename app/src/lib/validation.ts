import { isDate } from 'date-fns';
import { string as yupString } from 'yup';

export function validateLuhn(num: string): boolean {
	const nbDigits = num.length;
	let sum = 0;
	for (let i = 0; i < nbDigits; i++) {
		let digit = parseInt(num[nbDigits - 1 - i], 10);
		if (i % 2 === 1) {
			digit = digit * 2;
			if (digit > 9) digit = digit - 9;
		}
		sum = sum + digit;
	}
	return sum % 10 === 0;
}

export function validatePhoneNumber(value: string): boolean {
	return /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(value.trim());
}

export function validateNir(value: string): boolean {
	return /^[\d\w]{13}$/.test(value.trim());
}

export function validateCodePostal(value: string): boolean {
	// le code postal est composé de 5 chiffres mais
	// ne peut pas commencer par 00 sinon il est pas valide
	if (value.slice(0, 2) === '00') return false;
	return /[0-9]{5}/.test(value);
}

export function validateUrl(value: string): boolean {
	return value.startsWith('https://') || value.startsWith('http://');
}

export function validateDateInput(value: string): boolean {
	if (!/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(value)) {
		return false;
	}
	const date = new Date(value);
	return isDate(date);
}

export const cityOrNameValidation = yupString().matches(
	/^[A-Za-zÀ-ÖØ-öø-ÿ\- ']+$/,
	'Seuls les espaces, les lettres, l’apostrophe et le tiret sont acceptés'
);

export const nullifyEmptyString = (value) => (value ? value : null);
