CREATE TABLE "public"."rsa_closure_reason" (
	"code" text NOT NULL,
	"label" text NOT NULL,
	PRIMARY KEY ("code")
);
COMMENT ON TABLE "public"."rsa_closure_reason" IS E'code and reason for rsa closure reason';

INSERT INTO rsa_closure_reason VALUES ('caf_decision_pcg','cloture suite décision du Président du Conseil général');
INSERT INTO rsa_closure_reason VALUES ('caf_echeance','Cloture suite à échéance (4 mois sans droits)');
INSERT INTO rsa_closure_reason VALUES ('caf_annulation_bascule_rmi','Cloture suite à l''annulation de la bascule RMI/API');
INSERT INTO rsa_closure_reason VALUES ('caf_mutation','Cloture suite à mutation du dossier dans un autre organisme');
INSERT INTO rsa_closure_reason VALUES ('caf_regroupement','cloture pour regroupement de dossier');
INSERT INTO rsa_closure_reason VALUES ('caf_radie_fin_droit','radié fin de droit');
INSERT INTO rsa_closure_reason VALUES ('caf_radie_autre_motif','radié autre motif');
INSERT INTO rsa_closure_reason VALUES ('caf_radie_option_rsta','radié option RSTA Dom');
INSERT INTO rsa_closure_reason VALUES ('caf_radie_option_rso','radié option RSO Dom');


CREATE TABLE "public"."rsa_suspension_reason" (
	"code" text NOT NULL,
	"label" text NOT NULL,
	PRIMARY KEY ("code")
);
COMMENT ON TABLE "public"."rsa_suspension_reason" IS E'rsa suspension code and reason for enum';

INSERT INTO public.rsa_suspension_reason VALUES ('caf_ressources_trop_eleve' , 'Ressources trop élévées');
INSERT INTO public.rsa_suspension_reason VALUES ('caf_moins_25_sans_enf_personne_charge' , 'Moins 25 ans sans enft/autre person. à charge');
INSERT INTO public.rsa_suspension_reason VALUES ('caf_activite_non_conforme' , 'Activité non conforme');
INSERT INTO public.rsa_suspension_reason VALUES ('caf_titre_sejour_invalid' , 'Titre de séjour non valide');
INSERT INTO public.rsa_suspension_reason VALUES ('caf_rsa_inferieur_seuil' , 'RSA inférieur au seuil');
INSERT INTO public.rsa_suspension_reason VALUES ('caf_declaration_ressource_non_fournie' , 'Déclaration Trimestrielle Ressources non fournie');
INSERT INTO public.rsa_suspension_reason VALUES ('caf_residence_non_conforme' , 'Résidence non conforme');
INSERT INTO public.rsa_suspension_reason VALUES ('caf_pas_isolement' , 'Pas d''isolement');
INSERT INTO public.rsa_suspension_reason VALUES ('caf_prestation_exclue' , 'Prestation exclue affil partielle');
INSERT INTO public.rsa_suspension_reason VALUES ('caf_regime_non_conforme' , 'Régime non conforme');
INSERT INTO public.rsa_suspension_reason VALUES ('caf_demande_avantage_vieillesse_absent' , 'Demande avantage vielliesse absent ou tardif');
INSERT INTO public.rsa_suspension_reason VALUES ('caf_titre_sejour_absent' , 'Titre de séjour absent');
INSERT INTO public.rsa_suspension_reason VALUES ('caf_hospitalisation' , 'Hospitalisation');
INSERT INTO public.rsa_suspension_reason VALUES ('caf_action_non_engagee' , 'Action non engagée');
INSERT INTO public.rsa_suspension_reason VALUES ('caf_surface_ponderee_sup' , 'Surface pondérée > plafond ou inconnue');
INSERT INTO public.rsa_suspension_reason VALUES ('caf_droit_eteins_autre' , 'Droit éteint ou autre cas  !L8207!');
INSERT INTO public.rsa_suspension_reason VALUES ('caf_pas_allocataire' , 'Pas d''allocataire');
INSERT INTO public.rsa_suspension_reason VALUES ('caf_beneficiaire_aah' , 'Bénéficiaire AAH réduite');
INSERT INTO public.rsa_suspension_reason VALUES ('caf_allocataire_absent' , 'Allocataire absent du foyer');
INSERT INTO public.rsa_suspension_reason VALUES ('caf_attente_decision_PCG' , 'Attente décision PCG (le droit reste théorique jusqu''au retour)');
INSERT INTO public.rsa_suspension_reason VALUES ('caf_activite_anterieur_insuffisante' , 'Activité antérieure insuffisante');
INSERT INTO public.rsa_suspension_reason VALUES ('caf_activite_anterieure_absente' , 'Activité antérieure absente');
INSERT INTO public.rsa_suspension_reason VALUES ('caf_etudiant_remuneration_insuffisante' , 'Etudiant rémunération insuff.');
INSERT INTO public.rsa_suspension_reason VALUES ('caf_activite_anterieure_non_conforme' , 'Activité antérieure non conforme');

alter table "public"."beneficiary" add column "is_homeless" boolean null;

alter table "public"."beneficiary" add column "subject_to_right_and_duty" boolean null;

alter table "public"."beneficiary" add column "rsa_suspension_reason" text null;

alter table "public"."beneficiary"
  add constraint "beneficiary_rsa_suspension_reason_fkey"
  foreign key ("rsa_suspension_reason")
  references "public"."rsa_suspension_reason"
  ("code") on update restrict on delete restrict;

alter table "public"."beneficiary" add column "rsa_closure_reason" text null;

alter table "public"."beneficiary"
  add constraint "beneficiary_rsa_closure_reason_fkey"
  foreign key ("rsa_closure_reason")
  references "public"."rsa_closure_reason"
  ("code") on update restrict on delete restrict;

alter table "public"."beneficiary" add column "rsa_closure_date" date null;


CREATE OR REPLACE FUNCTION public.get_beneficiaries_from_nir(search_nir text)
RETURNS SETOF beneficiary
LANGUAGE sql
STABLE
AS $function$
  SELECT *
  FROM beneficiary
  WHERE  substr(search_nir, 1, 13) =  substr(nir, 1, 13)
$function$
