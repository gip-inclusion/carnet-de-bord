import { sendEmail } from '$lib/emails/EmailSender';
import Account from '$database/Account';
import emailMagicLink from '$lib/emails/emailMagicLink';
import { APP_URL } from '$lib/variables';
import type { Beneficiary, Professional } from '$lib/_gen/typed-document-nodes';
import type { RequestHandler } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';

export const post: RequestHandler = async (request) => {
	const { username } = request.body as unknown as {
		username: string;
	};

	const account = await await Account.query().findOne({ username });

	if (!account) {
		return {
			status: 401,
			body: {
				errors: 'USER_NOT_FOUND'
			}
		};
	}

	const { id } = account;

	const accessKey = uuidv4();

	await Account.query().update({ accessKey, accessKeyDate: new Date() }).where({ id });

	const { email, firstname, lastname } = (await account.$relatedQuery(account.type)) as unknown as
		| Beneficiary
		| Professional;

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
