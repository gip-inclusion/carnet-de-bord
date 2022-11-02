import { send as sender } from './send';
import { templates, createLink } from './emails';
import type Mail from 'nodemailer/lib/mailer';
import type { SentMessageInfo } from 'nodemailer/lib/smtp-transport';

async function send<K extends keyof typeof templates>({
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
	const Component = (await import(`./templates/${capitalizeFirstLetter(template)}.svelte`)).default;
	const emailParams = { ...params[0], link: createLink(params[0].url) };
	const html = Component.render(emailParams).html;

	return sender({ ...options, html });
}

export default send;

function capitalizeFirstLetter(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
