import objection, { ColumnNameMappers } from 'objection';
import knex from './knex';

const { Model, snakeCaseMappers } = objection;

Model.knex(knex);

export default class Structure extends Model {
	id!: string;
	name!: string;

	static tableName = 'structure';

	static get columnNameMappers(): ColumnNameMappers {
		return snakeCaseMappers();
	}

	static jsonSchema = {
		type: 'object',
		properties: {
			id: { type: 'string' },
			name: { type: 'string', minLength: 1, maxLength: 255 }
		}
	};
}
