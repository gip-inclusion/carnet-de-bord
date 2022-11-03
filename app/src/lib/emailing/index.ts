import { send as sender } from './send';
import { createLink } from './emails';
import type { Templates } from './emails';
import type Mail from 'nodemailer/lib/mailer';
import type { SentMessageInfo } from 'nodemailer/lib/smtp-transport';

async function send({
	options,
	template,
	params,
}: {
	options: Mail.Options;
	template: Templates;
	params: unknown;
}): Promise<SentMessageInfo> {
	const Component = (await import(`./templates/${capitalizeFirstLetter(template)}.svelte`)).default;
	const emailParams = { ...params[0], link: createLink(params[0].url) };
	const html = Component.render(emailParams).html;

	return sender({ ...options, html });
}

export default send;

function capitalizeFirstLetter(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
