import knex from '$lib/config/db/knex';
import { sendEmail } from '$lib/utils/sendEmail';
import { emailMagicLink } from '$lib/utils/emailMagicLink';
import type { RequestHandler } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';

export type Profile = 'professional' | 'beneficiary' | 'admin';

export const post: RequestHandler = async (request) => {
	const { email, type, appUrl } = request.body as unknown as {
		email: string;
		type: Profile;
		appUrl: string;
	};

	const profile = (await knex(`${type}`).where({ email }).first()) as unknown as {
		id: string;
		firstname: string;
		lastname: string;
	};

	console.log('profile', profile);
	if (!profile) {
		return {
			status: 401,
			body: {
				errors: 'PROFILE_NOT_FOUND'
			}
		};
	}

	const { firstname, lastname, id } = profile;

	const account = (await knex('account')
		.where({ [`${type}_id`]: id })
		.first()) as unknown as {
		id: string;
		type: Profile;
		beneficiary_id: string;
		professional_id: string;
		admin_id: string;
	};

	if (!account) {
		return {
			status: 401,
			body: {
				errors: 'ACCOUNT_NOT_FOUND'
			}
		};
	}

	const accessKey = uuidv4();

	await knex('account')
		.update({ access_key: accessKey, access_key_date: new Date() })
		.where({ id: account.id });

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
