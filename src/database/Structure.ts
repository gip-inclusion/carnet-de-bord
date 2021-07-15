import objection, { ColumnNameMappers } from 'objection';
import type { Adresse, IStructure } from 'src/global';
import knex from './knex';

const { Model, snakeCaseMappers } = objection;

Model.knex(knex);

export default class Structure extends Model implements IStructure {
	id!: string;
	nom!: string;
	adresse!: Adresse;

	static tableName = 'structure';

	static get columnNameMappers(): ColumnNameMappers {
		return snakeCaseMappers();
	}

	static jsonSchema = {
		type: 'object',
		properties: {
			id: { type: 'string' },
			nom: { type: 'string', minLength: 1, maxLength: 255 },
			adresse: {
				type: 'object',
				properties: {
					codePostal: { type: 'string' },
					commune: { type: 'string' },
					voie: { type: 'string' }
				}
			}
		}
	};
}
