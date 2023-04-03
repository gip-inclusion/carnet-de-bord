ALTER TABLE "public"."notebook_action" DISABLE TRIGGER USER;
ALTER TABLE "public"."notebook_target" DISABLE TRIGGER USER;


CREATE TABLE "public"."ref_theme" (
	"name" text NOT NULL,
	"label" text NOT NULL,
	PRIMARY KEY ("name")
);
COMMENT ON TABLE "public"."ref_theme" IS E'contains the availables themes for focus, sitations, targets, actions';

INSERT INTO "public"."ref_theme" (name, label) VALUES('logement', 'Logement');
INSERT INTO "public"."ref_theme" (name, label) VALUES('emploi', 'Emploi');
INSERT INTO "public"."ref_theme" (name, label) VALUES('formation', 'Formation');
INSERT INTO "public"."ref_theme" (name, label) VALUES('difficulte_administrative', 'Difficultés administratives');
INSERT INTO "public"."ref_theme" (name, label) VALUES('difficulte_financiere', 'Difficultés financières');
INSERT INTO "public"."ref_theme" (name, label) VALUES('mobilite', 'Mobilité');
INSERT INTO "public"."ref_theme" (name, label) VALUES('sante', 'Santé');
INSERT INTO "public"."ref_theme" (name, label) VALUES('contraintes_familiales', 'Contraintes familiales');
INSERT INTO "public"."ref_theme" (name, label) VALUES('maitrise_langue', 'Maîtrise de la langue française');
INSERT INTO "public"."ref_theme" (name, label) VALUES('numerique', 'Numérique');
INSERT INTO "public"."ref_theme" (name, label) VALUES('choisir_un_metier', 'Choisir un métier');
INSERT INTO "public"."ref_theme" (name, label) VALUES('se_former', 'Se former');
INSERT INTO "public"."ref_theme" (name, label) VALUES('preparer_sa_candidature', 'Préparer sa candidature');
INSERT INTO "public"."ref_theme" (name, label) VALUES('trouver_un_emploi', 'Trouver un emploi');
INSERT INTO "public"."ref_theme" (name, label) VALUES('creer_une_entreprise', 'Créer une entreprise');
INSERT INTO "public"."ref_theme" (name, label) VALUES('s_ouvrir_a_l_international', 'S''ouvrir à l''international');

-- Choisir un métier
UPDATE "public"."notebook_target" SET target='Identifier ses points forts et ses compétences' WHERE target='Bénéficier d''un suivi global';
UPDATE "public"."notebook_target" SET target='Connaître les opportunités d''emploi' WHERE target='Accéder à un 1er emploi';
UPDATE "public"."notebook_target" SET target='Découvrir un métier ou un secteur d''activité' WHERE target='Découvrir un métier';
UPDATE "public"."notebook_target" SET target='Confirmer son choix de métier' WHERE target='Définir ou confirmer un projet professionnel';

UPDATE "public"."ref_target" SET (description, theme)=('Identifier ses points forts et ses compétences', 'choisir_un_metier') where description='Bénéficier d''un suivi global' and theme='emploi';
UPDATE "public"."ref_target" SET (description, theme)=('Connaître les opportunités d''emploi', 'choisir_un_metier') where description='Accéder à un 1er emploi' and theme='emploi';
UPDATE "public"."ref_target" SET (description, theme)=('Découvrir un métier ou un secteur d''activité', 'choisir_un_metier') where description='Découvrir un métier' and theme='emploi';
UPDATE "public"."ref_target" SET (description, theme)=('Confirmer son choix de métier', 'choisir_un_metier') where description='Définir ou confirmer un projet professionnel' and theme='emploi';

-- se former
UPDATE notebook_action
SET target_id = (
    SELECT id FROM notebook_target WHERE focus_id in (
            SELECT notebook_focus.id as focus_id
            FROM notebook_focus, notebook_target
            WHERE notebook_focus.id = notebook_target.focus_id
            AND (notebook_target.target = 'Se former' OR notebook_target.target = 'Acquérir les compétences de bases')
            GROUP BY notebook_focus.id
            HAVING count(focus_id) > 1
        )
        AND notebook_target.target = 'Se former'
        AND notebook_target.focus_id = oldtarget.focus_id
)
FROM (
    SELECT * FROM notebook_target WHERE focus_id in (
        SELECT notebook_focus.id as focus_id
        FROM notebook_focus, notebook_target
        WHERE notebook_focus.id = notebook_target.focus_id
        AND (notebook_target.target = 'Se former' OR notebook_target.target = 'Acquérir les compétences de bases')
        GROUP BY notebook_focus.id
        HAVING count(focus_id) > 1
    )
    AND notebook_target.target = 'Acquérir les compétences de bases'
  )
  AS oldTarget
WHERE target_id = oldTarget.id;

UPDATE notebook_action
SET target_id = (
    SELECT id FROM notebook_target WHERE focus_id in (
            SELECT notebook_focus.id as focus_id
            FROM notebook_focus, notebook_target
            WHERE notebook_focus.id = notebook_target.focus_id
            AND (notebook_target.target = 'Se former' OR notebook_target.target = 'Se remobiliser')
            GROUP BY notebook_focus.id
            HAVING count(focus_id) > 1
        )
        AND notebook_target.target = 'Se former'
        AND notebook_target.focus_id = oldtarget.focus_id
)
FROM (
    SELECT * FROM notebook_target WHERE focus_id in (
        SELECT notebook_focus.id as focus_id
        FROM notebook_focus, notebook_target
        WHERE notebook_focus.id = notebook_target.focus_id
        AND (notebook_target.target = 'Se former' OR notebook_target.target = 'Se remobiliser')
        GROUP BY notebook_focus.id
        HAVING count(focus_id) > 1
    )
    AND notebook_target.target = 'Se remobiliser'
  )
  AS oldTarget
WHERE target_id = oldTarget.id;

UPDATE notebook_action
SET target_id = (
    SELECT id FROM notebook_target WHERE focus_id in (
            SELECT notebook_focus.id as focus_id
            FROM notebook_focus, notebook_target
            WHERE notebook_focus.id = notebook_target.focus_id
            AND (notebook_target.target = 'Se former' OR notebook_target.target = 'Accéder au parcours d’accompagnement')
            GROUP BY notebook_focus.id
            HAVING count(focus_id) > 1
        )
        AND notebook_target.target = 'Se former'
        AND notebook_target.focus_id = oldtarget.focus_id
)
FROM (
    SELECT * FROM notebook_target WHERE focus_id in (
        SELECT notebook_focus.id as focus_id
        FROM notebook_focus, notebook_target
        WHERE notebook_focus.id = notebook_target.focus_id
        AND (notebook_target.target = 'Se former' OR notebook_target.target = 'Accéder au parcours d’accompagnement')
        GROUP BY notebook_focus.id
        HAVING count(focus_id) > 1
    )
    AND notebook_target.target = 'Accéder au parcours d’accompagnement'
  )
  AS oldTarget
WHERE target_id = oldTarget.id;

DELETE FROM notebook_target WHERE id in (
    SELECT id FROM notebook_target WHERE focus_id in  (
        SELECT notebook_focus.id as focus_id
        FROM notebook_focus, notebook_target
        WHERE notebook_focus.id = notebook_target.focus_id
        AND (notebook_target.target = 'Se former' OR notebook_target.target = 'Acquérir les compétences de bases' OR notebook_target.target = 'Se remobiliser' OR notebook_target.target = 'Accéder au parcours d’accompagnement')
        GROUP BY notebook_focus.id
        HAVING count(focus_id) > 1
    )
    AND (notebook_target.target = 'Acquérir les compétences de bases' OR notebook_target.target = 'Se remobiliser' OR notebook_target.target = 'Accéder au parcours d’accompagnement')
);

UPDATE "public"."notebook_target" SET target='Trouver sa formation' WHERE target IN('Se former', 'Acquérir les compétences de bases', 'Se remobiliser', 'Accéder au parcours d’accompagnement');
UPDATE "public"."ref_target" SET (description, theme)=('Trouver sa formation', 'se_former') where description='Se former' and theme='formation';
UPDATE "public"."ref_target" SET (description, theme)=('Monter son dossier de formation', 'se_former') where description='Définir un parcours de formation personnalisé' and theme='formation';
DELETE FROM "public"."ref_target" WHERE theme='formation' and description IN ('Acquérir les compétences de bases', 'Se remobiliser', 'Accéder au parcours d’accompagnement');


-- Préparer sa candidature
UPDATE "public"."notebook_target" SET target='Réaliser un CV et/ou une lettre de motivation' WHERE target='Travailler les techniques de recherches d''emplois';
UPDATE "public"."ref_target" SET (description, theme)=('Réaliser un CV et/ou une lettre de motivation', 'preparer_sa_candidature') where description='Travailler les techniques de recherches d''emplois' and theme='emploi';
INSERT INTO public.ref_target (description, theme) VALUES('Valoriser ses compétences', 'preparer_sa_candidature');
INSERT INTO public.ref_target (description, theme) VALUES('Développer son réseeau', 'preparer_sa_candidature');
INSERT INTO public.ref_target (description, theme) VALUES('Organiser ses démarches de recherche d''emploi', 'preparer_sa_candidature');

-- Trouver un emploi
UPDATE "public"."notebook_target" SET target='Répondre à des offres d''emploi' WHERE target='Accéder à l’emploi';
UPDATE "public"."ref_target" SET (description, theme)=('Répondre à des offres d''emploi', 'trouver_un_emploi') where description='Accéder à l’emploi' and theme='emploi';
INSERT INTO public.ref_target (description, theme) VALUES('Faire des candidatures spontanées', 'trouver_un_emploi');
INSERT INTO public.ref_target (description, theme) VALUES('Suivre ses candidatures et relancer les recruteurs', 'trouver_un_emploi');
INSERT INTO public.ref_target (description, theme) VALUES('Convaincre et recruter en entretien', 'trouver_un_emploi');

-- Créer une entreprise
UPDATE "public"."notebook_target" SET target='Développer son entreprise' WHERE target='Développer son projet entreprenarial';
UPDATE "public"."ref_target" SET (description, theme)=('Développer son entreprise', 'creer_une_entreprise') where description='Développer son projet entreprenarial' and theme='emploi';
INSERT INTO public.ref_target (description, theme) VALUES('Définir son projet de création d''entreprise', 'creer_une_entreprise');
INSERT INTO public.ref_target (description, theme) VALUES('Structurer son projet de création d''entreprise', 'creer_une_entreprise');

-- S'ouvrir à l'internationnal
INSERT INTO public.ref_target (description, theme) VALUES('Connaître les opportunités d''emploi à l''étranger', 's_ouvrir_a_l_international');
INSERT INTO public.ref_target (description, theme) VALUES('S''informer sur les aides pour travailler à l''étranger', 's_ouvrir_a_l_international');
INSERT INTO public.ref_target (description, theme) VALUES('S''organiser suite à son retour en France', 's_ouvrir_a_l_international');


ALTER TABLE "public"."ref_target" ALTER COLUMN "theme" TYPE text;

alter table "public"."ref_target"
  add constraint "ref_target_theme_fkey"
  foreign key ("theme")
  references "public"."ref_theme"
  ("name") on update restrict on delete restrict;


ALTER TABLE "public"."ref_action" ALTER COLUMN "theme" TYPE text;

alter table "public"."ref_action"
  add constraint "ref_action_theme_fkey"
  foreign key ("theme")
  references "public"."ref_theme"
  ("name") on update restrict on delete restrict;

ALTER TABLE "public"."ref_situation" ALTER COLUMN "theme" TYPE text;

alter table "public"."ref_situation"
  add constraint "ref_situation_theme_fkey"
  foreign key ("theme")
  references "public"."ref_theme"
  ("name") on update restrict on delete restrict;

ALTER TABLE "public"."notebook_action" ENABLE TRIGGER USER;
ALTER TABLE "public"."notebook_target" ENABLE TRIGGER USER;
