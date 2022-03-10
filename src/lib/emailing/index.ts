import { send as sender } from './send';
import templates from './emails';
import type Mail from 'nodemailer/lib/mailer';
import type { SentMessageInfo } from 'nodemailer/lib/smtp-transport';

function send<K extends keyof typeof templates>({
	options,
	template,
	params,
}: {
	options: Mail.Options;
	template: K;
	params: Parameters<typeof templates[K]>;
}): Promise<SentMessageInfo> {
	if (!templates[template]) {
		return Promise.reject(
			`Invalid template name: ${template}. Available templates are: ${Object.keys(templates).join(
				', '
			)}.`
		);
	}
	return sender({ ...options, html: templates[template].apply(null, params) });
}

export default send;
