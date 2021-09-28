export function emailNotebookInvitation({
	firstname,
	lastname,
	creatorFirstname,
	creatorLastname,
	accessKey,
	appUrl,
	notebookId,
}: {
	firstname: string;
	lastname: string;
	creatorFirstname: string;
	creatorLastname: string;
	accessKey: string;
	appUrl: string;
	notebookId: string;
}): string {
	return `<p>Bonjour ${firstname} ${lastname},</p>

  <p>Votre avez été invité à rejoindre un carnet de bord par <b>${creatorFirstname} ${creatorLastname}</b> .</p>
	<p>Pour accéder au carnet de bord, veuillez cliquer sur le lien ci-dessous:</p>
   &nbsp;
  <p style="padding-left: 20%">
    <a
			rel="nofollow"
      href="${appUrl}/auth/jwt/${accessKey}?url=/pro/carnet/${notebookId}"
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
  &nbsp; &nbsp;
  <p>L'équipe Carnet de bord</p>
  `;
}
