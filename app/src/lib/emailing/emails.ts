import { displayFullName } from '$lib/ui/format';
import type { InscriptionRequest } from 'src/routes/(public)/inscription/request/+server';

type Person = {
	firstname: string;
	lastname: string;
};

type IncompletePerson = {
	firstname?: string;
	lastname?: string;
};

type Pro = Person;

type AccountRequest = InscriptionRequest['accountRequest'];

type Creator = Person | IncompletePerson;

type Account = { username: string } & Person;

type Url = {
	appUrl: string;
	accessKey?: string;
	redirectUrl?: string;
};

function createLink({ appUrl, accessKey, redirectUrl }: Url) {
	return `${appUrl}${accessKey ? `/auth/jwt/${accessKey}` : ''}${
		redirectUrl ? `?url=${redirectUrl}` : ''
	}`;
}

function createAccessButton(url: Url) {
	return `
    <p>Pour accéder à Carnet de bord, veuillez cliquer sur le lien ci-dessous&nbsp;:</p>
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
	return `<p>Bonjour${person ? ` ${displayFullName(person)}` : ''},</p>`;
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
    ${
			creator.firstname &&
			creator.lastname &&
			`<p>Vous avez été invité(e) à rejoindre un carnet de bord par <b>${displayFullName(
				creator
			)}</b> .</p>`
		}
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
    <p>Votre identifiant de connexion est <b>${account.username}</b></p>
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
	structureName,
	url,
	requester,
}: {
	pro: AccountRequest;
	structureName: string;
	url: Url;
	requester?: Person;
}): string {
	return `
    ${greeting()}
    <p>Une demande de création d'un compte pour ${displayFullName(pro)} a été reçue.</p>
		<b>Informations personnelles:</b>
		<ul>
		  ${structureName && `<li>Structure: ${structureName}</li>`}
		  ${pro.firstname && `<li>Prénom: ${pro.firstname}</li>`}
		  ${pro.lastname && `<li>Nom: ${pro.lastname}</li>`}
		  ${pro.email && `<li>Courriel: ${pro.email}</li>`}
		  ${pro.mobileNumber && `<li>téléphone: ${pro.mobileNumber}</li>`}
		  ${pro.position && `<li>position: ${pro.position}</li>`}
    ${requester ? `<p>Cette demande a été soumise par ${displayFullName(requester)}.</p>` : ''}
    <p>Vous recevez ce message parce que vous êtes manager de ce déploiement. Veuillez vous connecter à Carnet de bord pour confirmer cette inscription.</p>
    ${createAccessButton(url)}
    ${footer()}
  `;
}

export function accountCreatedByAdmin({ account, url }: { account: Account; url: Url }): string {
	return `
    ${greeting(account)}
    <p>Un compte vous a été créé sur l'application Carnet de bord.</p>
    <p>Votre identifiant de connexion est <b>${account.username}</b></p>
    ${createAccessButton(url)}
    ${footer()}
  `;
}

type AdminStructureEmailParams = {
	email: string;
	account: Person;
	structure: string;
	url: Url;
};

export function adminStructureAccountCreation(params: AdminStructureEmailParams): string {
	return `
    ${greeting(params.account)}
    <p>Un compte vous a été créé sur l'application Carnet de bord pour administrer la structure ${
			params.structure
		}.</p>
    <p>Votre identifiant de connexion est <b>${params.email}</b></p>
    ${createAccessButton(params.url)}
    ${footer()}
  `;
}

export function adminStructureAddedToStructure(params: AdminStructureEmailParams): string {
	return `
    ${greeting(params.account)}
    <p>Vous pouvez désormais administrer la structure ${params.structure}.</p>
    <p>Votre identifiant de connexion est <b>${params.email}</b></p>
    ${createAccessButton(params.url)}
    ${footer()}
  `;
}

export function managerOnboarding({ url, deployment }: { url: Url; deployment: string }): string {
	return `
    <p>Bonjour,</p>
    <p>Un compte vous a été créé sur l'application Carnet de bord pour administrer le déploiement <strong>${deployment}</strong>.</p>
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
	accountCreatedByAdmin,
	adminStructureAccountCreation,
	adminStructureAddedToStructure,
	managerOnboarding,
};
