import objection, { ColumnNameMappers } from 'objection';
import knex from './knex';
import Structure from './Structure';

const { Model, snakeCaseMappers } = objection;

Model.knex(knex);

export default class Professional extends Model {
	id!: string;
	lastname: string;
	firstname: string;
	email: string;
	structure: Structure;

	static tableName = 'professional';

	static get columnNameMappers(): ColumnNameMappers {
		return snakeCaseMappers();
	}

	static relationMappings = {
		structure: {
			relation: Model.BelongsToOneRelation,
			modelClass: Structure,
			join: {
				from: 'professional.structure_id',
				to: 'structure.id'
			}
		}
	};

	static jsonSchema = {
		type: 'object',
		properties: {
			id: { type: 'string' }
		}
	};
}
