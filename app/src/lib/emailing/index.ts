import { send as sender } from './send';
import { createLink } from './emails';
import type { Templates } from './emails';
import type Mail from 'nodemailer/lib/mailer';
import type { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import type { SvelteComponent } from 'svelte/types/runtime';

type Constructor<T> = new (...args: any[]) => T;
type RenderFunction = (component: Constructor<SvelteComponent>, params: object) => ({ container: HTMLElement });

export default async function send({
	options,
	template,
	params,
}: {
	options: Mail.Options;
	template: Templates;
	params: unknown;
}): Promise<SentMessageInfo> {
	const html = await createMail({ template, params });
	if (typeof html !== 'string') {
		throw new Error('impossible to send non string');
	}
	return sender({ ...options, html });
}

export async function createMail({
	template,
	params,
	render,
}: {
	template: Templates;
	params: unknown;
	render?: RenderFunction;
}): Promise<string | ChildNode> {
	const Component = (await import(`./templates/${template}.svelte`)).default;
	const emailParams = { ...params[0], link: createLink(params[0].url) };
	delete emailParams.url;

	if (render) {
		return render(Component, { ...emailParams }).container.firstChild;
	}
	return Component.render(emailParams).html;
}
