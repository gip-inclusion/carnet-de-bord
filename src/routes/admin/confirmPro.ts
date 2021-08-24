import knex from '$lib/config/db/knex';
import type { RequestHandler } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '$lib/utils/sendEmail';
import { emailMagicLink } from '$lib/utils/emailMagicLink';
import { getAppUrl } from '$lib/config/variables/private';

export const post: RequestHandler = async (request) => {
	const { id } = request.body as unknown as {
		id: string;
	};

	const appUrl = getAppUrl();

	const account = (await knex('account').where({ id }).first()) as {
		id: string;
		professional_id: string | null;
	};

	if (!account) {
		return {
			status: 404,
			body: {
				errors: 'Account not found'
			}
		};
	}

	if (!account.professional_id) {
		return {
			status: 404,
			body: {
				errors: 'Not a professional account'
			}
		};
	}

	const existingPro = (await knex('professional')
		.where({ id: account.professional_id })
		.first()) as {
		email: string;
		firstname: string;
		lastname: string;
	};

	if (!existingPro) {
		return {
			status: 404,
			body: {
				errors: 'Professional not found'
			}
		};
	}

	const { email, lastname, firstname } = existingPro;

	const accessKey = uuidv4();

	await knex('account')
		.update({ access_key: accessKey, access_key_date: new Date(), confirmed: true })
		.where({ id });

	// send email
	sendEmail({
		to: email,
		subject: 'Accédez à votre espace Carnet de bord',
		html: emailMagicLink({ firstname, lastname, accessKey, appUrl })
	});

	return {
		status: 200,
		body: {}
	};
};
