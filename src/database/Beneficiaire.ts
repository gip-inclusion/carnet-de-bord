import objection from 'objection';
import type { IBeneficiaire } from 'src/global';
import knex from './knex';

const { Model, snakeCaseMappers } = objection;

Model.knex(knex);

export default class Beneficiaire extends Model implements IBeneficiaire {
	id!: number;
	nom!: string;
	prenom!: string;
	email: string;
	telPortable: string;
	numeroCaf: string;
	numeroPe: string;

	// Table name is the only required property.
	static tableName = 'beneficiaire';

	static get columnNameMappers() {
		// If your columns are UPPER_SNAKE_CASE you can
		// use snakeCaseMappers({ upperCase: true })
		return snakeCaseMappers();
	}

	// Optional JSON schema. This is not the database schema! Nothing is generated
	// based on this. This is only used for validation. Whenever a model instance
	// is created it is checked against this schema. http://json-schema.org/.
	static jsonSchema = {
		type: 'object',
		properties: {
			id: { type: 'integer' },
			nom: { type: 'string', minLength: 1, maxLength: 255 },
			prenom: { type: 'string', minLength: 1, maxLength: 255 },
			email: { type: 'string', minLength: 1, maxLength: 255 },
			telPortable: { type: 'string', minLength: 1, maxLength: 255 },
			numeroCaf: { type: 'string', minLength: 1, maxLength: 255 },
			numeroPe: { type: 'string', minLength: 1, maxLength: 255 }
		}
	};
}
