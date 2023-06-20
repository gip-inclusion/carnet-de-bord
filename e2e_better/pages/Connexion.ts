import { accueilPro } from "./accueilPro";

const { Je } = inject();

export class Connexion {
	connexionAvec(email: string) {
		Je.remplisLeChamp("Courriel", email);
		Je.cliqueSur("Se connecter");
		Je.cliqueSur("Ouvrir Carnet de bord");
		Je.cliqueSur("Continuer sur Carnet de bord");
		Je.seeInCurrentUrl("/pro");
		return accueilPro;
	}
}
export const connexion = new Connexion();
