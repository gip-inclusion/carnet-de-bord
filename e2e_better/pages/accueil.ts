import { Connexion, connexion } from "./Connexion";

const { Je } = inject();

export class Accueil {
	accéder() {
		Je.suisSurLaPage("/");
		return this;
	}
	refuserTousLesCookies() {
		tryTo(() => {
			Je.cliqueSur("Tout refuser");
			Je.neVoisPas("Tout refuser");
		}).catch(() => this.refuserTousLesCookies());
		return this;
	}
	accéderÀMonCompte(): Connexion {
		Je.cliqueSur("Accéder à mon compte");
		Je.vois("Se connecter");
		return connexion;
	}
}

export const accueil = new Accueil();
