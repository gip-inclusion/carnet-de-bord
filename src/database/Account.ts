import objection, { ColumnNameMappers } from 'objection';
import type { IBeneficiary, IAccount, IProfessional } from 'src/global';
import Beneficiary from './Beneficiary';
import knex from './knex';
import Professional from './Professional';

const { Model, snakeCaseMappers } = objection;

Model.knex(knex);

export default class Account extends Model implements IAccount {
	username!: string;
	type!: string;

	accessKey: string;
	accessKeyDate: Date;

	lastLogin: Date;

	beneficiary: IBeneficiary;
	professional: IProfessional;

	static tableName = 'account';

	static get idColumn(): string {
		return 'username';
	}

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
		professional: {
			relation: Model.BelongsToOneRelation,
			modelClass: Professional,
			join: {
				from: 'account.professional_id',
				to: 'professional.id'
			}
		}
	};

	static jsonSchema = {
		type: 'object',
		properties: {
			username: { type: 'string' },
			type: { type: 'string' },
			accessKey: { type: ['string', 'null'] },
			accessKeyDate: { type: ['date'] },
			lastLogin: { type: 'date' }
		}
	};
}
