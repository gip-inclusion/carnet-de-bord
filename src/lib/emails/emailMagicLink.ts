export default ({
	firstname,
	lastname,
	accessKey,
	appUrl
}: {
	firstname: string;
	lastname: string;
	accessKey: string;
	appUrl: string;
}): string => {
	return `<p>Bonjour ${firstname} ${lastname},</p>

  <p>Pour accéder à votre espace Carnet de bord, veuillez cliquer sur le lien ci-dessous:</p>
  <p style="padding-left: 20%">
    &nbsp;
    <a
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
};
