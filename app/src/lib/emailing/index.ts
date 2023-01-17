import { send as sender } from './send';
import { createLink } from './emails';
import type { Templates } from './emails';
import type Mail from 'nodemailer/lib/mailer';
import type { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import type { SvelteComponent } from 'svelte/types/runtime';

type Constructor<T> = new (...args: any[]) => T; // eslint-disable-line @typescript-eslint/no-explicit-any

export default async function send({
	options,
	template,
	params,
}: {
	options: Mail.Options;
	template: Templates;
	params: object;
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
}: {
	template: Templates;
	params: object;
}): Promise<string> {
	const { Component, formattedParams } = await prepareEmail({ template, params });

	return (Component as any).render(formattedParams).html; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export async function prepareEmail({
	template,
	params,
}: {
	template: Templates;
	params: object;
}): Promise<{ Component: Constructor<SvelteComponent>; formattedParams: object }> {
	const Component = (await import(`./templates/${template}.svelte`)).default;
	const formattedParams = { ...params[0], link: createLink(params[0].url) };
	delete formattedParams.url;

	return { Component, formattedParams };
}
