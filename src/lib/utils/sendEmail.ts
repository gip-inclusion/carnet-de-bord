import nodemailer from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

const { VITE_SMTP_FROM, VITE_SMTP_HOST, VITE_SMTP_PASS, VITE_SMTP_PORT, VITE_SMTP_USER } =
	process.env as unknown as {
		VITE_SMTP_FROM: string;
		VITE_SMTP_HOST: string;
		VITE_SMTP_PASS: string;
		VITE_SMTP_PORT: number;
		VITE_SMTP_USER: string;
	};

const smtpConfig = {
	host: VITE_SMTP_HOST,
	ignoreTLS: false,
	port: VITE_SMTP_PORT,
	requireTLS: true,
	secure: false,
	auth: {
		pass: VITE_SMTP_PASS,
		user: VITE_SMTP_USER
	}
};

export function sendEmail({
	to,
	subject,
	text,
	html,
	bcc
}: Mail.Options): Promise<SMTPTransport.SentMessageInfo> {
	const transporter = nodemailer.createTransport(smtpConfig);
	const mailOptions = {
		bcc,
		from: VITE_SMTP_FROM,
		html,
		subject,
		text,
		to
	};
	return transporter.sendMail(mailOptions);
}
