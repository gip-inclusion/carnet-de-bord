-- Inserts
DELETE FROM "public"."ref_situation" WHERE "id" = '1fb43e0b-ae4c-447b-beff-d98ffe246998';
DELETE FROM "public"."ref_situation" WHERE "id" = '12308116-5042-4fa0-82e6-3b66d6dbc9e4';
DELETE FROM "public"."ref_situation" WHERE "id" = '70480749-bbdf-4bd7-bc10-ceb9aa3cf7d1';
DELETE FROM "public"."ref_situation" WHERE "id" = '77d1866b-63e5-4bdc-b046-17452e494975';
DELETE FROM "public"."ref_situation" WHERE "id" = '67e3d51c-88a0-4767-b604-9bc0c738cdc5';
DELETE FROM "public"."ref_situation" WHERE "id" = '94fd5e72-6e5a-4fe1-a75a-8055958a0de7';
DELETE FROM "public"."ref_situation" WHERE "id" = '5e5533e2-8c69-4ada-bd87-c391e48440f1';
DELETE FROM "public"."ref_situation" WHERE "id" = '765fa578-69ab-41c6-bc08-4a5fb163dbd7';
DELETE FROM "public"."ref_situation" WHERE "id" = '6b2b932d-8906-4de6-919a-4f9dc8c979d5';
DELETE FROM "public"."ref_situation" WHERE "id" = 'a194ae20-be40-43ed-bec1-05b6e4e2395f';

-- Deletes
INSERT INTO "public"."ref_situation" (id, description, theme)
VALUES ('a1642fbe-4921-4b0e-8ffc-a3e29cd4c123', 'Usage avancé du numérique (50%-80%)', 'numerique');
INSERT INTO "public"."ref_situation" (id, description, theme)
VALUES ('992e2799-bbdd-4224-a878-86506e341a81', 'Usage expert du numérique (+80%)', 'numerique');

-- Renames
UPDATE "public"."ref_situation"
SET description = 'Rencontre des difficultés juridiques'
WHERE description = 'Difficulté d’ordre juridique';
UPDATE "public"."ref_situation"
SET description = 'Difficultés à effectuer une démarche administrative'
WHERE description = 'Difficulté liée à une démarche administrative';
UPDATE "public"."ref_situation"
SET description = 'Difficulté à accéder à un justificatif d''identité'
WHERE description = 'Difficulté liée à un justificatif d''identité / titre de séjour';
UPDATE "public"."ref_situation"
SET description = 'Difficulté à accéder à son avis d’imposition'
WHERE description = 'Difficulté liée à son avis d’imposition';
UPDATE "public"."ref_situation"
SET description = 'Problème déclaré entravant l’exercice de certains métiers'
WHERE description = 'Difficulté déclarée entravant l’exercice de certains métiers';
UPDATE "public"."ref_situation"
SET description = 'Problème déclaré n’entravant pas la reprise d’une activité professionnelle'
WHERE description = 'Difficulté déclarée n’entravant pas la reprise d’une activité professionnelle';
UPDATE "public"."ref_situation"
SET description = 'Problème déclaré entrainant des absences régulières'
WHERE description = 'Difficulté déclarée entrainant des absences régulières';
UPDATE "public"."ref_situation"
SET description = 'Problème déclaré ne permettant plus d’exercer une activité professionnelle'
WHERE description = 'Difficulté déclarée ne permettant plus d’exercer une activité professionnelle';
UPDATE "public"."ref_situation"
SET description = 'Problème déclaré ne permettant pas de reprendre une activité professionnelle immédiate'
WHERE description = 'Difficulté déclarée ne permettant pas de reprendre une activité professionnelle immédiate';
UPDATE "public"."ref_situation"
SET description = 'Doit quitter le logement'
WHERE description = 'Doit quitter le logement (procédure d''expulsion, ...)';
UPDATE "public"."ref_situation"
SET description = 'État de santé incompatible avec la conduite'
WHERE description = 'État de santé déclaré rendant incompatible la conduite';
UPDATE "public"."ref_situation"
SET description = 'Non maitrise de l’écrit en français (écrit)'
WHERE description = 'Difficulté en français à l’écrit';
UPDATE "public"."ref_situation"
SET description = 'Non maitrise de la compréhension du français (parlé)'
WHERE description = 'Difficulté en français à l’oral';
UPDATE "public"."ref_situation"
SET description = 'Non maitrise de la lecture en français (lu)'
WHERE description = 'Difficulté en français en lecture';
UPDATE "public"."ref_situation"
SET description = 'Absence de connexion'
WHERE description = 'Absence de connexion (autre motif)';
UPDATE "public"."ref_situation"
SET description = 'Absence d’adresse ou d’utilisation de la messagerie'
WHERE description = 'Absence d''adresse ou d''utilisation de messagerie électronique';

-- Unmerge
-- Add old ones
INSERT INTO "public"."ref_situation" (id, description, theme)
VALUES ('4f3a3251-5ed1-4fca-8bbf-9fe44920eeae', 'Non maitrise du numérique (0%)', 'numerique');
INSERT INTO "public"."ref_situation" (id, description, theme)
VALUES ('747e1c4b-3ba6-482b-be78-f70fe34cf247', 'Usage basique du numérique (-50%)', 'numerique');

-- Update notebook_situation
UPDATE "public"."notebook_situation"
SET situation_id = '747e1c4b-3ba6-482b-be78-f70fe34cf247'
WHERE situation_id = 'dd897ad7-52a2-4812-aa6c-d0999ef0416f';

-- Delete new
DELETE
FROM "public"."ref_situation"
WHERE id = 'dd897ad7-52a2-4812-aa6c-d0999ef0416f';
