import objection, { ColumnNameMappers } from 'objection';
import jwt, { SignOptions } from 'jsonwebtoken';
import type { IBeneficiary, IAccount, IProfessional } from 'src/global';
import Beneficiary from './Beneficiary';
import knex from './knex';
import Professional from './Professional';
import { getSecret } from '$lib/variables/jwt';

const { Model, snakeCaseMappers } = objection;

Model.knex(knex);

export default class Account extends Model implements IAccount {
	id!: string;
	username!: string;
	type!: string;

	accessKey: string;
	accessKeyDate: Date;

	lastLogin: Date;

	beneficiary: IBeneficiary;
	professional: IProfessional;

	static tableName = 'account';

	static get idColumn(): string {
		return 'id';
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
			id: { type: 'string' },
			username: { type: 'string' },
			type: { type: 'string' },
			accessKey: { type: ['string', 'null'] },
			accessKeyDate: { type: ['date'] },
			lastLogin: { type: 'date' }
		}
	};

	async getUser(): Promise<{
		id: string;
		username: string;
		roles: string[];
		token: string;
		type: string;
	}> {
		const token = await this.getJwt();
		return {
			id: this.id,
			username: this.username,
			roles: [this.type],
			token: token,
			type: this.type
		};
	}

	async getJwt(): Promise<string> {
		const signOptions: SignOptions = {
			algorithm: 'RS256',
			expiresIn: '30d',
			subject: this.id.toString()
		};

		const hasuraClaims = this.getHasuraClaims();
		const claim = {
			'https://hasura.io/jwt/claims': hasuraClaims,
			id: this.id,
			role: this.type
		};

		const { key } = await getSecret();

		const token = jwt.sign(claim, key, signOptions);
		return token;
	}

	getHasuraClaims(): unknown {
		return {
			'x-hasura-allowed-roles': [this.type],
			'x-hasura-default-role': this.type,
			'x-hasura-user-id': `${this.id}`
		};
	}
}
