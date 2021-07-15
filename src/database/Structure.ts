import objection, { ColumnNameMappers } from 'objection';
import type { Address, IStructure } from 'src/global';
import knex from './knex';

const { Model, snakeCaseMappers } = objection;

Model.knex(knex);

export default class Structure extends Model implements IStructure {
	id!: string;
	name!: string;
	address!: Address;

	static tableName = 'structure';

	static get columnNameMappers(): ColumnNameMappers {
		return snakeCaseMappers();
	}

	static jsonSchema = {
		type: 'object',
		properties: {
			id: { type: 'string' },
			name: { type: 'string', minLength: 1, maxLength: 255 },
			address: {
				type: 'object',
				properties: {
					postalCode: { type: 'string' },
					city: { type: 'string' },
					address1: { type: 'string' }
				}
			}
		}
	};
}
