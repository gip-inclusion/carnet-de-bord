import { v4 as uuidv4 } from 'uuid';
import { proAccountSchema } from '$lib/ui/ProCreationForm/pro.schema';
import * as XLSX from 'xlsx/xlsx.mjs';
import { localeDateToIso } from './date';

interface ImportParsingException {
	code: string;
	column: number;
	row: number;
}

export function generateErrorMessages(exception: ImportParsingException): string[] {
	const errors = [];
	switch (exception.code) {
		case 'INCORRECT_HEADER':
			errors.push(
				...[
					'Les entêtes de votre fichier ne correspondent pas à ceux du fichier modèle.',
					'Vérifiez que le nombre de colonnes ainsi que leur intitulé sont corrects.',
				]
			);
			break;
		case 'REQUIRED_FIELD':
			errors.push(...['Certains champs obligatoires sont invalides.']);
			break;
		case 'INCONSISTENT_COLUMNS_NUMBER':
			errors.push(
				...[`Nombre de colonnes incorrect, l'erreur se trouve à la ligne: ${exception.row}`]
			);
			break;
		case 'EMPTY_FILE':
			errors.push('Le fichier que vous avez chargé est vide.');
			break;
		default:
			return errors;
	}
	return errors;
}

function parseFile(reader, filteType: string): object[] {
	let content = reader.result;
	if (filteType === 'text/csv') {
		const decoder = new TextDecoder('utf-8');
		content = decoder.decode(reader.result);
	} else {
		const workbook = XLSX.read(content);
		content = XLSX.utils.sheet_to_csv(Object.values(workbook.Sheets)[0], {
			blankrows: false,
			FS: ';',
		});
	}
	return content
		.split(/\r?\n/)
		.filter((row) => row.length > 1)
		.map((row) => row.split(';'));
}

function mapToHeaders(data, headers: { label: string; key: string }[]): object[] {
	const headerKeys = headers.map((header) => header.key);
	data.shift();
	return data.map((row) => row.reduce((acc, curr, i) => ({ ...acc, [headerKeys[i]]: curr }), {}));
}

function validateImportFileShape(data, headers: { label: string; key: string }[]): void {
	if (data.length <= 1) {
		throw {
			code: 'EMPTY_FILE',
			row: 0,
		};
	}
	if (data[0].filter((headerLabel) => headerLabel !== '').length !== headers.length) {
		throw {
			code: 'INCORRECT_HEADER',
			row: 0,
		};
	}
	data.forEach((row, index) => {
		if (row.length !== headers.length) {
			throw {
				code: 'INCONSISTENT_COLUMNS_NUMBER',
				row: index,
			};
		}
	});
	return;
}

export function parseEntities(
	file: Blob,
	importType: string | object,
	headers,
	callback: (results: Record<string, unknown>, errors: string[]) => void
) {
	let entities = [];
	const reader = new FileReader();
	reader.onload = () => {
		try {
			const result = parseFile(reader, file.type);
			const validationErrors = [];
			validateImportFileShape(result, headers);
			const records: object[] = mapToHeaders(result, headers);
			if (records) {
				entities = records.map((entity: Record<string, unknown>, index) => {
					entity.uid = uuidv4();
					entity.valid = validate(entity, importType.toString());
					if (!entity.valid) {
						validationErrors.push(index);
					}
					return entity;
				});
				const idToImport = entities.filter(({ valid }) => valid).map(({ uid }) => uid);
				callback(
					{ entities, idToImport },
					validationErrors.length > 0
						? generateErrorMessages({ code: 'REQUIRED_FIELD' } as ImportParsingException)
						: []
				);
			}
		} catch (exception: ImportParsingException | unknown) {
			callback(
				{ entities: [], idToImport: [] },
				generateErrorMessages(exception as ImportParsingException)
			);
		}
	};
	reader.readAsArrayBuffer(file);
}

function validate(entity: null | undefined | Record<string, unknown>, entityType: string): boolean {
	if (entity.dateOfBirth) {
		entity.dateOfBirth = localeDateToIso(entity.dateOfBirth as string);
	}
	switch (entityType) {
		case 'BeneficiaryImport':
			return !!entity && !!entity.firstname && !!entity.lastname && !!entity.dateOfBirth;
		case 'NotebookMemberImport':
			return (
				!!entity &&
				!!entity.firstname &&
				!!entity.lastname &&
				!!entity.dateOfBirth &&
				!!entity.addEmails &&
				!!entity.removeEmails &&
				!!entity.addStructures
			);
		case 'NotebookMemberBinding':
			return !!entity && !!entity.notebookId && !!entity.proEmails;
		case 'StructureImport':
			return (
				!!entity && !!entity.name && !!entity.city && !!entity.postalCode && !!entity.adminEmail
			);
		case 'ProImport':
			try {
				proAccountSchema.validateSync(entity);
				return true;
			} catch (e) {
				console.error(e);
				return false;
			}
		default:
			return false;
	}
}
