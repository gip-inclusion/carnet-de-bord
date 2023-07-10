-- Inserts
INSERT INTO "public"."ref_situation"("description", "theme", "id") VALUES (E'Problématique de santé d\'un enfant', E'contraintes_familiales', E'1fb43e0b-ae4c-447b-beff-d98ffe246998');
INSERT INTO "public"."ref_situation"("description", "theme", "id") VALUES (E'Difficulté déclarée concernant l\'accès à un professionnel de santé', E'sante', E'12308116-5042-4fa0-82e6-3b66d6dbc9e4');
INSERT INTO "public"."ref_situation"("description", "theme", "id") VALUES (E'Français Langue Étrangère (FLE) : non maitrise ou en cours d\'apprentissage', E'maitrise_langue', E'70480749-bbdf-4bd7-bc10-ceb9aa3cf7d1');
INSERT INTO "public"."ref_situation"("description", "theme", "id") VALUES (E'Dispose d\'un ordinateur', E'numerique', E'77d1866b-63e5-4bdc-b046-17452e494975');
INSERT INTO "public"."ref_situation"("description", "theme", "id") VALUES (E'Dispose d\'un smartphone', E'numerique', E'67e3d51c-88a0-4767-b604-9bc0c738cdc5');
INSERT INTO "public"."ref_situation"("description", "theme", "id") VALUES (E'Dispose d\'une tablette', E'numerique', E'94fd5e72-6e5a-4fe1-a75a-8055958a0de7');
INSERT INTO "public"."ref_situation"("description", "theme", "id") VALUES (E'Absence de connexion (zone blanche)', E'numerique', E'5e5533e2-8c69-4ada-bd87-c391e48440f1');
INSERT INTO "public"."ref_situation"("description", "theme", "id") VALUES (E'Absence de connexion (refus)', E'numerique', E'765fa578-69ab-41c6-bc08-4a5fb163dbd7');
INSERT INTO "public"."ref_situation"("description", "theme", "id") VALUES (E'Absence de mobilité pour accéder à un espace numérique', E'numerique', E'6b2b932d-8906-4de6-919a-4f9dc8c979d5');
INSERT INTO "public"."ref_situation"("description", "theme", "id") VALUES (E'Difficulté a réaliser des démarches administratives en ligne', E'numerique', E'a194ae20-be40-43ed-bec1-05b6e4e2395f');


-- Deletes

DELETE FROM notebook_situation
WHERE situation_id in (
	SELECT id
	FROM ref_situation
	WHERE description in ('Usage avancé du numérique (50%-80%)', 'Usage expert du numérique (+80%)')
);

DELETE
FROM ref_situation
WHERE description in ('Usage avancé du numérique (50%-80%)', 'Usage expert du numérique (+80%)');

-- Renames
UPDATE ref_situation
SET description = 'Difficulté d’ordre juridique'
WHERE description = 'Rencontre des difficultés juridiques';
UPDATE ref_situation
SET description = 'Difficulté liée à une démarche administrative'
WHERE description = 'Difficultés à effectuer une démarche administrative';
UPDATE ref_situation
SET description = 'Difficulté liée à un justificatif d''identité / titre de séjour'
WHERE description = 'Difficulté à accéder à un justificatif d''identité';
UPDATE ref_situation
SET description = 'Difficulté liée à son avis d’imposition'
WHERE description = 'Difficulté à accéder à son avis d’imposition';
UPDATE ref_situation
SET description = 'Difficulté déclarée entravant l’exercice de certains métiers'
WHERE description = 'Problème déclaré entravant l’exercice de certains métiers';
UPDATE ref_situation
SET description = 'Difficulté déclarée n’entravant pas la reprise d’une activité professionnelle'
WHERE description = 'Problème déclaré n’entravant pas la reprise d’une activité professionnelle';
UPDATE ref_situation
SET description = 'Difficulté déclarée entrainant des absences régulières'
WHERE description = 'Problème déclaré entrainant des absences régulières';
UPDATE ref_situation
SET description = 'Difficulté déclarée ne permettant plus d’exercer une activité professionnelle'
WHERE description = 'Problème déclaré ne permettant plus d’exercer une activité professionnelle';
UPDATE ref_situation
SET description = 'Difficulté déclarée ne permettant pas de reprendre une activité professionnelle immédiate'
WHERE description = 'Problème déclaré ne permettant pas de reprendre une activité professionnelle immédiate';
UPDATE ref_situation
SET description = 'Doit quitter le logement (procédure d''expulsion, ...)'
WHERE description = 'Doit quitter le logement';
UPDATE ref_situation
SET description = 'État de santé déclaré rendant incompatible la conduite'
WHERE description = 'État de santé incompatible avec la conduite';
UPDATE ref_situation
SET description = 'Difficulté en français à l’écrit'
WHERE description = 'Non maitrise de l’écrit en français (écrit)';
UPDATE ref_situation
SET description = 'Difficulté en français à l’oral'
WHERE description = 'Non maitrise de la compréhension du français (parlé)';
UPDATE ref_situation
SET description = 'Difficulté en français en lecture'
WHERE description = 'Non maitrise de la lecture en français (lu)';
UPDATE ref_situation
SET description = 'Absence de connexion (autre motif)'
WHERE description = 'Absence de connexion';
UPDATE ref_situation
SET description = 'Absence d''adresse ou d''utilisation de messagerie électronique'
WHERE description = 'Absence d’adresse ou d’utilisation de la messagerie';

-- Merge
-- Insert new
INSERT INTO ref_situation (id, description, theme)
VALUES ('dd897ad7-52a2-4812-aa6c-d0999ef0416f', 'En difficulté sur le numérique (résultat Pix emploi <50%)',
        'numerique');

-- Update notebook_situation
UPDATE notebook_situation
SET situation_id = 'dd897ad7-52a2-4812-aa6c-d0999ef0416f'
WHERE situation_id in (SELECT id
                       FROM ref_situation
                       WHERE description in ('Non maitrise du numérique (0%)', 'Usage basique du numérique (-50%)'));
-- Delete old ones
DELETE
FROM ref_situation
WHERE description in ('Non maitrise du numérique (0%)', 'Usage basique du numérique (-50%)');
