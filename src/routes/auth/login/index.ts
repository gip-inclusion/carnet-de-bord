import knex from '$lib/config/db/knex';
import emailMagicLink from '$lib/emails/emailMagicLink';
import { sendEmail } from '$lib/emails/EmailSender';
import { APP_URL } from '$lib/config/env';
import type { RequestHandler } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';

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
	};

	if (!account) {
		return {
			status: 401,
			body: {
				errors: 'USER_NOT_FOUND'
			}
		};
	}

	const { id, type, beneficiary_id, professional_id, admin_id } = account;
	console.log(account);

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

	// send email
	sendEmail({
		to: email,
		subject: 'Accédez à votre espace Carnet de bord',
		html: emailMagicLink({ firstname, lastname, accessKey, appUrl: APP_URL })
	});

	return {
		status: 200,
		body: {
			email: email
		}
	};
};
