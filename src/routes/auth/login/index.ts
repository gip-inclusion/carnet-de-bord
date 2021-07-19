import { sendEmail } from '$business/EmailSender';
import Account from '$database/Account';
import emailMagicLink from '$lib/emails/emailMagicLink';
import { APP_URL } from '$lib/variables';
import type { RequestHandler } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';

export const post: RequestHandler = async (request) => {
	const { email } = request.body as unknown as {
		email: string;
	};

	const account = await await Account.query().findOne({ email });

	if (!account) {
		return {
			status: 401,
			body: {
				errors: 'USER_NOT_FOUND'
			}
		};
	}

	const { lastname, firstname } = account;

	const accessKey = uuidv4();

	await Account.query().update({ accessKey, accessKeyDate: new Date() }).where({ email });

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
