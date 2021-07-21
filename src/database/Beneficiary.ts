import objection, { ColumnNameMappers } from 'objection';
import knex from './knex';

const { Model, snakeCaseMappers } = objection;

Model.knex(knex);

export default class Beneficiary extends Model {
	id!: string;
	lastname: string;
	firstname: string;
	email: string;

	static tableName = 'beneficiary';

	static get columnNameMappers(): ColumnNameMappers {
		return snakeCaseMappers();
	}

	static jsonSchema = {
		type: 'object',
		properties: {
			id: { type: 'string' }
		}
	};
}
