import objection, { ColumnNameMappers } from 'objection';
import type { IBeneficiary, IAccount, IProfessional } from 'src/global';
import Beneficiary from './Beneficiary';
import knex from './knex';
import professional from './Professional';

const { Model, snakeCaseMappers } = objection;

Model.knex(knex);

export default class Account extends Model implements IAccount {
	id!: string;

	beneficiary: IBeneficiary;
	professional: IProfessional;

	static tableName = 'compte';

	static get columnNameMappers(): ColumnNameMappers {
		return snakeCaseMappers();
	}

	static relationMappings = {
		beneficiary: {
			relation: Model.BelongsToOneRelation,
			modelClass: Beneficiary,
			join: {
				from: 'account.beneficiary_id',
				to: 'beneficiary.id'
			}
		},
		profesional: {
			relation: Model.BelongsToOneRelation,
			modelClass: professional,
			join: {
				from: 'account.profesional_id',
				to: 'profesional.id'
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
