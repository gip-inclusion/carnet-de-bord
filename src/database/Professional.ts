import objection, { ColumnNameMappers } from 'objection';
import type { Contact, CivilStatus, IProfessional } from 'src/global';
import knex from './knex';
import Structure from './Structure';

const { Model, snakeCaseMappers } = objection;

Model.knex(knex);

export default class professional extends Model implements IProfessional {
	id!: string;
	civilStatus!: CivilStatus;
	contact!: Contact;
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
			id: { type: 'string' },
			address: {
				type: 'object',
				properties: {
					postalCode: { type: 'string' },
					city: { type: 'string' },
					address1: { type: 'string' }
				}
			},
			civilStatus: {
				type: 'object',
				properties: {
					civility: { type: 'string' },
					lastname: { type: 'string' },
					firstname: { type: 'string' }
				}
			},
			contact: {
				type: 'object',
				properties: {
					mobileNumber: { type: 'string' },
					email: { type: 'string' }
				}
			}
		}
	};
}
