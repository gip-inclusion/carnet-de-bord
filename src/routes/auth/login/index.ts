import knex from '$lib/config/db/knex';
import { sendEmail } from '$lib/utils/sendEmail';
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

function emailMagicLink({
	firstname,
	lastname,
	accessKey,
	appUrl
}: {
	firstname: string;
	lastname: string;
	accessKey: string;
	appUrl: string;
}): string {
	return `<p>Bonjour ${firstname} ${lastname},</p>

  <p>Pour accéder à votre espace Carnet de bord, veuillez cliquer sur le lien ci-dessous:</p>
  &nbsp; &nbsp;
  <p style="padding-left: 20%">
    <a
      href="${appUrl}/auth/jwt/${accessKey}"
      style="
        background-color: #6a20ae;
        font-size: 14px;
        font-family: Helvetica, Arial, sans-serif;
        font-weight: bold;
        text-decoration: none;
        padding: 8px 10px;
        color: #ffffff;
        border-radius: 5px;
        display: inline-block;
      "
    >
      <span>Accédez à Carnet de bord</span>
    </a>
  </p>
  &nbsp; &nbsp;
  <p>L'équipe Carnet de bord</p>
  `;
}
