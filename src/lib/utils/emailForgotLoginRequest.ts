export function emailForgotLoginRequest({
	username,
	firstname,
	lastname,
	accessKey,
	appUrl,
}: {
	firstname: string;
	username: string;
	lastname: string;
	accessKey: string;
	appUrl: string;
}): string {
	return `<p>Bonjour ${firstname} ${lastname},</p>

  <p>Votre identifiant de connexion est <b>${username}</b> .</p>
	<p>Pour accéder à votre espace Carnet de bord, veuillez cliquer sur le lien ci-dessous:</p>
   &nbsp;
  <p style="padding-left: 20%">
    <a
      rel="nofollow"
      href="${appUrl}/auth/jwt/${accessKey}"
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
