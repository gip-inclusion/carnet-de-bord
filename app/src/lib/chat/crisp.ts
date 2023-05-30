import { displayFullName } from '$lib/ui/format';

export function updateCrispUser(data) {
	const { username, firstname, lastname, email } = data;

	//Available fields user:email, user:phone, user:nickname, user:avatar, user:company
	window.$crisp.push(['set', 'user:nickname', [displayFullName({ firstname, lastname })]]);
	if (email) {
		window.$crisp.push(['set', 'user:email', [`${email}`]]);
	}

	// additionnal data in session:data
	window.$crisp.push(['set', 'session:data', [[['username', username]]]]);

	// disable warning about shimmed JS methods (caused by Sentry)
	window.$crisp.push(['safe', true]);
}
