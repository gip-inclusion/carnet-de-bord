import knex from '$lib/config/db/knex';
import { sendEmail } from '$lib/utils/sendEmail';
import { emailMagicLink } from '$lib/utils/emailLoginRequest';
import type { RequestHandler } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import { getAppUrl } from '$lib/config/variables/private';

export const post: RequestHandler = async (request) => {
	const { username } = request.body as unknown as {
		username: string;
	};

	const account = (await knex('account').where({ username }).first()) as unknown as {
		id: string;
		type: 'professional' | 'beneficiary' | 'admin';
		beneficiary_id: string;
		professional_id: string;
		admin_id: string;
		confirmed: boolean;
	};

	if (!account) {
		return {
			status: 401,
			body: {
				errors: 'USER_NOT_FOUND'
			}
		};
	}

	if (!account.confirmed) {
		return {
			status: 403,
			body: {
				errors: 'ACCOUNT_NOT_CONFIRMED'
			}
		};
	}

	const { id, type, beneficiary_id, professional_id, admin_id } = account;

	const accessKey = uuidv4();

	await knex('account')
		.update({ access_key: accessKey, access_key_date: new Date() })
		.where({ id });

	const { email, firstname, lastname } = (await knex(`${type}`)
		.where({
			id: beneficiary_id || professional_id || admin_id
		})
		.first()) as unknown as {
		email: string;
		firstname: string;
		lastname: string;
	};

	const appUrl = getAppUrl();

	// send email
	sendEmail({
		to: email,
		subject: 'Accédez à votre espace Carnet de bord',
		html: emailMagicLink({ firstname, lastname, accessKey, appUrl })
	});

	return {
		status: 200,
		body: {
			email
		}
	};
};
