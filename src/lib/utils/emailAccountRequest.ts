export function emailAccountRequest({
	firstname,
	lastname,
	appUrl,
	requester
}: {
	firstname: string;
	lastname: string;
	appUrl: string;
	requester?: string;
}): string {
	return `<p>Bonjour,</p>

  <p>Une demande de création de compte pour ${firstname} ${lastname} a été reçue${
		requester ? ` par ${requester}` : ''
	}&nbsp;:</p>
  &nbsp; &nbsp;
  <p style="padding-left: 20%">
    <a
      href="${appUrl}"
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
      <span>Accédez à l'espace administrateur</span>
    </a>
  </p>
  &nbsp; &nbsp;
  <p>L'équipe Carnet de bord</p>
  `;
}
