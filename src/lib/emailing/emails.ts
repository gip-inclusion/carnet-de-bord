import { displayFullName } from '$lib/ui/format';

type Person = {
	firstname: string;
	lastname: string;
};

type Pro = Person;

type Creator = Person;

type Account = { username: string } & Person;

type Url = {
	appUrl: string;
	accessKey?: string;
	redirectUrl?: string;
};

function createLink({ appUrl, accessKey, redirectUrl }: Url) {
	return `${appUrl}${accessKey ? `/auth/jwt/${accessKey}` : ''}${
		redirectUrl ? `?url=${redirectUrl}` : ''
	}}`;
}

function createAccessButton(url: Url) {
	return `
    <p>Pour accéder au carnet de bord, veuillez cliquer sur le lien ci-dessous:</p>
    <p style="padding-left: 20%">
      <a
      rel="nofollow"
      href="${createLink(url)}"
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
  `;
}

function greeting(person?: Person) {
	return `<p>Bonjour ${person ? ` ${displayFullName(person)}` : ''},</p>`;
}

function footer() {
	return "<p>L'équipe Carnet de bord</p>";
}

export function notebookInvitation({
	pro,
	creator,
	url,
}: {
	pro: Pro;
	creator: Creator;
	url: Url;
}): string {
	return `
    ${greeting(pro)}
    <p>Votre avez été invité à rejoindre un carnet de bord par <b>${displayFullName(
			creator
		)}</b> .</p>
    ${createAccessButton(url)}
    ${footer()}
  `;
}

export function loginRequest({ pro, url }: { pro: Pro; url: Url }): string {
	return `
    ${greeting(pro)}
    ${createAccessButton(url)}
    ${footer()}
  `;
}

export function forgotLoginRequest({ account, url }: { account: Account; url: Url }): string {
	return `
    ${greeting(account)}
    <p>Votre identifiant de connexion est <b>${account.username}</b>.</p>
    ${createAccessButton(url)}
    ${footer()}
  `;
}

export function accountRequestValidate({ pro, url }: { pro: Pro; url: Url }): string {
	return `
    ${greeting(pro)}
    <p>Votre demande d'inscription à Carnet de bord a été acceptée.</p>
    ${createAccessButton(url)}
    ${footer()}
  `;
}

export function accountRequest({
	pro,
	url,
	requester,
}: {
	pro: Pro;
	url: Url;
	requester?: Person;
}): string {
	return `
    ${greeting()}
    <p>Une demande de création d'un compte pour ${displayFullName(pro)} a été reçue.</p>
    ${requester ? `<p>Cette demande a été soumise par ${displayFullName(requester)}.</p>` : ''}
    ${createAccessButton(url)}
    ${footer()}
  `;
}

export default {
	notebookInvitation,
	loginRequest,
	forgotLoginRequest,
	accountRequestValidate,
	accountRequest,
};
