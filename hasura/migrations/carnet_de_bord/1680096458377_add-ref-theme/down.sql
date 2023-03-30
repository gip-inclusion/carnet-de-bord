alter table "public"."ref_target" drop constraint "ref_target_theme_fkey";
alter table "public"."ref_action" drop constraint "ref_action_theme_fkey";
alter table "public"."ref_situation" drop constraint "ref_situation_theme_fkey";

DROP TABLE "public"."ref_theme";

ALTER TABLE "public"."ref_target" ALTER COLUMN "theme" TYPE character varying;
ALTER TABLE "public"."ref_action" ALTER COLUMN "theme" TYPE character varying;
ALTER TABLE "public"."ref_situation" ALTER COLUMN "theme" TYPE character varying;


-- Choisir un métier
UPDATE "public"."notebook_target" SET target='Bénéficier d''un suivi global' WHERE target='Identifier ses points forts et ses compétences';
UPDATE "public"."notebook_target" SET target='Accéder à un 1er emploi' WHERE target='Connaître les opportunités d''emploi';
UPDATE "public"."notebook_target" SET target='Découvrir un métier' WHERE target='Découvrir un métier ou un secteur d''activité';
UPDATE "public"."notebook_target" SET target='Définir ou confirmer un projet professionnel' WHERE target='Confirmer son choix de métier';

UPDATE "public"."ref_target" SET (description, theme)=('Bénéficier d''un suivi global', 'emploi') where description='Identifier ses points forts et ses compétences' and theme='choisir_un_metier';
UPDATE "public"."ref_target" SET (description, theme)=('Accéder à un 1er emploi', 'emploi') where description='Connaître les opportunités d''emploi' and theme='choisir_un_metier';
UPDATE "public"."ref_target" SET (description, theme)=('Découvrir un métier', 'emploi') where description='Découvrir un métier ou un secteur d''activité' and theme='choisir_un_metier';
UPDATE "public"."ref_target" SET (description, theme)=('Définir ou confirmer un projet professionnel', 'emploi') where description='Confirmer son choix de métier' and theme='choisir_un_metier';

-- se former
-- cannot revert that change
-- UPDATE "public"."notebook_target" SET target='Trouver sa formation' WHERE target IN('Se former', 'Acquérir les compétences de bases', 'Se remobiliser', 'Accéder au parcours d’accompagnement');
UPDATE "public"."ref_target" SET (description, theme)=('Se former', 'formation') where description='Trouver sa formation' and theme='se_former';
UPDATE "public"."ref_target" SET (description, theme)=('Définir un parcours de formation personnalisé', 'formation') where description='Monter son dossier de formation' and theme='se_former';
INSERT INTO "public"."ref_target" (description, theme) VALUES('Acquérir les compétences de bases', 'formation');
INSERT INTO "public"."ref_target" (description, theme) VALUES('Se remobiliser', 'formation');
INSERT INTO "public"."ref_target" (description, theme) VALUES('Accéder au parcours d’accompagnement', 'formation');

-- Préparer sa candidature
UPDATE "public"."notebook_target" SET target='Travailler les techniques de recherches d''emplois' WHERE target='Réaliser un CV et/ou une lettre de motivation';
UPDATE "public"."ref_target" SET (description, theme)=('Travailler les techniques de recherches d''emplois', 'emploi') where description='Réaliser un CV et/ou une lettre de motivation' and theme='preparer_sa_candidature';
DELETE from "public"."ref_target" WHERE theme = 'preparer_sa_candidature';

-- Trouver un emploi
UPDATE "public"."notebook_target" SET target='Accéder à l’emploi' WHERE target='Répondre à des offres d''emploi';
UPDATE "public"."ref_target" SET (description, theme)=('Accéder à l’emploi', 'emploi') where description='Répondre à des offres d''emploi' and theme='trouver_un_emploi';
DELETE from "public"."ref_target" WHERE theme = 'trouver_un_emploi';

-- Créer une entreprise
UPDATE "public"."notebook_target" SET target='Développer son projet entreprenarial' WHERE target='Développer son entreprise';
UPDATE "public"."ref_target" SET (description, theme)=('Développer son projet entreprenarial', 'emploi') where description='Développer son entreprise' and theme='creer_une_entreprise';
DELETE from "public"."ref_target" WHERE theme = 'creer_une_entreprise';

-- S'ouvrir à l'internationnal
DELETE from "public"."ref_target" WHERE theme = 's_ouvrir_a_l_international';
