-- up.sql

--
-- update json migrations
--
UPDATE public.notebook_focus set situations = situations - 'Autres contraintes' || '["Autres contraintes familiales à prendre en compte"]'::jsonb  WHERE situations ? 'Autres contraintes';
UPDATE public.notebook_focus set situations = situations - 'Aidant familial ( s’occuper d’un proche )' || '["Aidant familial (s’occuper d’un proche)"]'::jsonb  WHERE situations ? 'Aidant familial ( s’occuper d’un proche )';
UPDATE public.notebook_focus set situations = situations - 'Pas de mutuelle à jour' || '["Couverture sociale / mutuelle à mettre à jour"]'::jsonb  WHERE situations ? 'Pas de mutuelle à jour';
UPDATE public.notebook_focus set situations = situations - 'Difficulté à effectuer une démarche administrative' || '["Difficultés à effectuer une démarche administrative"]'::jsonb  WHERE situations ? 'Difficulté à effectuer une démarche administrative';
UPDATE public.notebook_focus set situations = situations - 'Sécurité sociale à mettre à jour' || '["Couverture sociale / mutuelle à mettre à jour"]'::jsonb  WHERE situations ? 'Sécurité sociale à mettre à jour';
UPDATE public.notebook_focus set situations = situations - 'Ressources précaires' || '["Ressources précaires (inférieures au seuil de pauvreté)"]'::jsonb  WHERE situations ? 'Ressources précaires';
UPDATE public.notebook_focus set situations = situations - 'Sans hébergement' || '["Sans hébergement / rupture effective de logement"]'::jsonb  WHERE situations ? 'Sans hébergement';
UPDATE public.notebook_focus set situations = situations - 'Locataire parc social' || '["Locataire du parc social"]'::jsonb  WHERE situations ? 'Locataire parc social';
UPDATE public.notebook_focus set situations = situations - 'Locataire parc privé' || '["Locataire du parc privé"]'::jsonb  WHERE situations ? 'Locataire parc privé';
UPDATE public.notebook_focus set situations = situations - 'Autre type de logement ( hôtel… )' || '["Autre type de logement (hôtel, …)"]'::jsonb  WHERE situations ? 'Autre type de logement ( hôtel… )';
UPDATE public.notebook_focus set situations = situations - 'Hébergement collectif de type ( CHRS, CHU, CPH, CADA… )' || '["Hébergement collectif de type CHRS, CHU, CPH, CADA, …"]'::jsonb  WHERE situations ? 'Hébergement collectif de type ( CHRS, CHU, CPH, CADA… )';
UPDATE public.notebook_focus set situations = situations - 'Non maitrise de la langue française' || '["Non maitrise de l’écrit en français (écrit)"]'::jsonb  WHERE situations ? 'Non maitrise de la langue française';
UPDATE public.notebook_focus set situations = situations - 'Interprétariat nécessaire' || '["Non maitrise de la compréhension du français (parlé)"]'::jsonb  WHERE situations ? 'Interprétariat nécessaire';
UPDATE public.notebook_focus set situations = situations - 'Difficulté dans la lecture' || '["Non maitrise de la lecture en français (lu)"]'::jsonb  WHERE situations ? 'Difficulté dans la lecture';
UPDATE public.notebook_focus set situations = situations - 'Autres permis ( poids lourds, bus… )' || '["Autres permis (poids lourd, bus, …)"]'::jsonb  WHERE situations ? 'Autres permis ( poids lourds, bus… )';
UPDATE public.notebook_focus set situations = situations - 'Permis ou/et code en cours' || '["Permis et/ou code en cours"]'::jsonb  WHERE situations ? 'Permis ou/et code en cours';
UPDATE public.notebook_focus set situations = situations - 'Véhicule ( voiture, moto, scooter )' || '["Véhicule (voiture, moto, scooter)"]'::jsonb  WHERE situations ? 'Véhicule ( voiture, moto, scooter )';
UPDATE public.notebook_focus set situations = situations - 'Permis non valide / Suspension permis' || '["Permis non valide / suspension de permis"]'::jsonb  WHERE situations ? 'Permis non valide / Suspension permis';
UPDATE public.notebook_focus set situations = situations - 'Absence d''équipement ou de connexion' || '["Absence de connexion"]'::jsonb  WHERE situations ? 'Absence d''équipement ou de connexion';
UPDATE public.notebook_focus set situations = situations - 'Absence d''adresse de messagerie' || '["Absence d’adresse ou d’utilisation de la messagerie"]'::jsonb  WHERE situations ? 'Absence d''adresse de messagerie';
UPDATE public.notebook_focus set situations = situations - 'Accès ou utilisation difficile des outils numériques' || '["Usage basique du numérique (-50%)"]'::jsonb  WHERE situations ? 'Accès ou utilisation difficile des outils numériques';
UPDATE public.notebook_focus set situations = situations - 'Couverture sociale à mettre à jour' || '["Couverture sociale / mutuelle à mettre à jour"]'::jsonb  WHERE situations ? 'Couverture sociale à mettre à jour';
UPDATE public.notebook_target SET target='Trouver des solutions de garde d’enfant' WHERE target= 'Recherche de mode de garde';
UPDATE public.notebook_target SET target='Obtenir le statut d’aidant familial' WHERE target= 'Devenir aidant familial salarié';
UPDATE public.notebook_target SET target='Bénéficier d’un appui aux démarches administratives' WHERE target= 'Travailler l’accès à une prestation';
UPDATE public.notebook_target SET target='Bénéficier d''un accompagnement à l''accès à la citoyenneté' WHERE target= 'Travailler l’accès à la citoyenneté';
UPDATE public.notebook_target SET target='Bénéficier d’un accompagnement pour accéder aux droits' WHERE target= 'Travailler l’accès aux droits';
UPDATE public.notebook_target SET target='Maitriser les fondamentaux du numérique' WHERE target= 'Accompagnement dans les démarches numériques';
UPDATE public.notebook_target SET target='Bénéficier d''une mesure d''accompagnement adapté' WHERE target= 'Mise en place d''une mesure d''accompagnement adapté';
UPDATE public.notebook_target SET target='Faire face à une situation d''endettement / surendettement' WHERE target= 'Réduire / apurer les dettes';
UPDATE public.notebook_target SET target='Améliorer sa gestion budgétaire' WHERE target= 'Améliorer la gestion budgétaire';
UPDATE public.notebook_target SET target='Mettre en place une mesure de protection financières (tutelles, curatelles, …)' WHERE target= 'Mettre en place une mesure de protection';
UPDATE public.notebook_target SET target='Accéder à un logement' WHERE target= 'Accèder au logement social';
UPDATE public.notebook_target SET target='S''informer sur les démarches liées au logement (budget, état des lieux… )' WHERE target= 'S''informer sur les démarches liées au logement ( budget, état des lieux… )';
UPDATE public.notebook_target SET target='Réduire les impayés de loyer' WHERE target= 'Réduire les impayés';
UPDATE public.notebook_target SET target='Rechercher une solution d’hébergement temporaire' WHERE target= 'Rechercher un hébergement';
UPDATE public.notebook_target SET target='Se maintenir dans le logement' WHERE target= 'Se maintenir dans un hébergement';
UPDATE public.notebook_target SET target='Rechercher une solution d’hébergement temporaire' WHERE target= 'Recherche d''un hébergement';
UPDATE public.notebook_target SET target='Changer de logement' WHERE target= 'Démarche de relogement suite à une problématique d''insalubrité ( DALO )';
UPDATE public.notebook_target SET target='Apprendre / Améliorer ses capacités en français' WHERE target= 'Améliorer la maitrise du français';
UPDATE public.notebook_target SET target='Apprendre / Améliorer ses capacités en français' WHERE target= 'Améliorer les savoirs : à l’écriture et la lecture';
UPDATE public.notebook_target SET target='Faire un point complet sur sa mobilité' WHERE target= 'Bénéficier d''un accompagnement permettant d''accèder à la mobilité';
UPDATE public.notebook_target SET target='Trouver une solution de transport (hors acquisition ou entretien de véhicule)' WHERE target= 'Avoir accès aux transports en commun';
UPDATE public.notebook_target SET target='Obtenir le permis de conduire (code / conduite)' WHERE target= 'Obtenir le permis de conduire / code de la route';
UPDATE public.notebook_target SET target='Travailler la mobilité psychologique' WHERE target= 'Travailler la mobilité psychologique';
UPDATE public.notebook_target SET target='Accéder a des service en ligne' WHERE target= 'Travailler l’accès à une prestation';
UPDATE public.notebook_target SET target='Maitriser les fondamentaux du numérique' WHERE target= 'Accompagnement dans les démarches numériques';
UPDATE public.notebook_target SET target='Mise en place d’une mesure d’accompagnement adapté' WHERE target= 'Mise en place d’une mesure d’accompagnement adapté';
UPDATE public.notebook_target SET target='Bénéficier d’un accompagnement pour accéder aux droits et/ou aux soins' WHERE target= 'Accéder aux droits';
UPDATE public.notebook_target SET target='Travailler sur les comportements de santé (dépendances, hygiène corporelle, dépistage, …)' WHERE target= 'Travailler sur les comportements de santé (dépendances, hygiène corporelle, dépistage… )';
UPDATE public.notebook_target SET target='Bénéficier d’un accompagnement pour accéder aux droits et/ou aux soins' WHERE target= 'Accéder aux soins';

--
-- insert migrations
--
INSERT INTO public.ref_situation (description, theme) VALUES('Besoin d''adapter le logement', 'logement');
INSERT INTO public.ref_situation (description, theme) VALUES('Difficultés en calcul', 'maitrise_langue');
INSERT INTO public.ref_situation (description, theme) VALUES('État de santé incompatible avec la conduite', 'mobilite');
INSERT INTO public.ref_situation (description, theme) VALUES('Permis étranger (hors EEE)', 'mobilite');
INSERT INTO public.ref_situation (description, theme) VALUES('Absence d’équipement', 'numerique');
INSERT INTO public.ref_situation (description, theme) VALUES('Non maitrise du numérique (0%)', 'numerique');
INSERT INTO public.ref_situation (description, theme) VALUES('Usage avancé du numérique (50%-80%)', 'numerique');
INSERT INTO public.ref_situation (description, theme) VALUES('Usage expert du numérique (+80%)', 'numerique');
INSERT INTO public.ref_target (description, theme) VALUES('Faire face à la prise en charge d’une personne dépendante', 'contraintes_familiales');
INSERT INTO public.ref_target (description, theme) VALUES('Surmonter des difficultés éducatives ou de parentalité', 'contraintes_familiales');
INSERT INTO public.ref_target (description, theme) VALUES('Faire face à un conflit familial et/ou une séparation', 'contraintes_familiales');
INSERT INTO public.ref_target (description, theme) VALUES('Prendre en compte une problématique judiciaire', 'difficulte_administrative');
INSERT INTO public.ref_target (description, theme) VALUES('Connaître les voies de recours face à une discrimination', 'difficulte_administrative');
INSERT INTO public.ref_target (description, theme) VALUES('Apprendre / Améliorer ses capacités en calcul', 'maitrise_langue');
INSERT INTO public.ref_target (description, theme) VALUES('Accéder à une connexion internet', 'numerique');
INSERT INTO public.ref_target (description, theme) VALUES('Accéder à un ordinateur, une tablette ou un smartphone', 'numerique');
INSERT INTO public.ref_action (description, theme) VALUES('Faire une demande de droits sociaux (RSA, ASS, Prime d''activité, …)', 'difficulte_financiere');
INSERT INTO public.ref_action (description, theme) VALUES('Réalisation d''une demande de mesure de protection administrative ou juridique"', 'undefined');
INSERT INTO public.ref_action (description, theme) VALUES('Constitution d’une demande d''aide financière pour l’achat d’un véhicule', 'undefined');

--
-- update migrations
--
UPDATE public.ref_situation SET description = 'Autres contraintes familiales à prendre en compte' WHERE theme='contraintes_familiales' AND description='Autres contraintes';
UPDATE public.ref_situation SET description = 'Aidant familial (s’occuper d’un proche)' WHERE theme='contraintes_familiales' AND description='Aidant familial ( s’occuper d’un proche )';
UPDATE public.ref_situation SET description = 'Difficultés à effectuer une démarche administrative' WHERE theme='difficulte_administrative' AND description='Difficulté à effectuer une démarche administrative';
UPDATE public.ref_situation SET description = 'Ressources précaires (inférieures au seuil de pauvreté)' WHERE theme='difficulte_financiere' AND description='Ressources précaires';
UPDATE public.ref_situation SET description = 'Sans hébergement / rupture effective de logement' WHERE theme='logement' AND description='Sans hébergement';
UPDATE public.ref_situation SET description = 'Locataire du parc social' WHERE theme='logement' AND description='Locataire parc social';
UPDATE public.ref_situation SET description = 'Locataire du parc privé' WHERE theme='logement' AND description='Locataire parc privé';
UPDATE public.ref_situation SET description = 'Autre type de logement (hôtel, …)' WHERE theme='logement' AND description='Autre type de logement ( hôtel… )';
UPDATE public.ref_situation SET description = 'Hébergement collectif de type CHRS, CHU, CPH, CADA, …' WHERE theme='logement' AND description='Hébergement collectif de type ( CHRS, CHU, CPH, CADA… )';
UPDATE public.ref_situation SET description = 'Non maitrise de l’écrit en français (écrit)' WHERE theme='maitrise_langue' AND description='Non maitrise de la langue française';
UPDATE public.ref_situation SET description = 'Non maitrise de la compréhension du français (parlé)' WHERE theme='maitrise_langue' AND description='Interprétariat nécessaire';
UPDATE public.ref_situation SET description = 'Non maitrise de la lecture en français (lu)' WHERE theme='maitrise_langue' AND description='Difficulté dans la lecture';
UPDATE public.ref_situation SET description = 'Autres permis (poids lourd, bus, …)' WHERE theme='mobilite' AND description='Autres permis ( poids lourds, bus… )';
UPDATE public.ref_situation SET description = 'Permis et/ou code en cours' WHERE theme='mobilite' AND description='Permis ou/et code en cours';
UPDATE public.ref_situation SET description = 'Véhicule (voiture, moto, scooter)' WHERE theme='mobilite' AND description='Véhicule ( voiture, moto, scooter )';
UPDATE public.ref_situation SET description = 'Permis non valide / suspension de permis' WHERE theme='mobilite' AND description='Permis non valide / Suspension permis';
UPDATE public.ref_situation SET description = 'Absence de connexion' WHERE theme='numerique' AND description='Absence d''équipement ou de connexion';
UPDATE public.ref_situation SET description = 'Absence d’adresse ou d’utilisation de la messagerie' WHERE theme='numerique' AND description='Absence d''adresse de messagerie';
UPDATE public.ref_situation SET description = 'Usage basique du numérique (-50%)' WHERE theme='numerique' AND description='Accès ou utilisation difficile des outils numériques';
UPDATE public.ref_situation SET description = 'Couverture sociale / mutuelle à mettre à jour' WHERE theme='sante' AND description='Couverture sociale à mettre à jour';
UPDATE public.ref_target SET description = 'Trouver des solutions de garde d’enfant' WHERE theme='contraintes_familiales' AND description='Recherche de mode de garde';
UPDATE public.ref_target SET description = 'Obtenir le statut d’aidant familial' WHERE theme='contraintes_familiales' AND description='Devenir aidant familial salarié';
UPDATE public.ref_target SET description = 'Bénéficier d’un appui aux démarches administratives' WHERE theme='difficulte_administrative' AND description='Travailler l’accès à une prestation';
UPDATE public.ref_target SET description = 'Bénéficier d''un accompagnement à l''accès à la citoyenneté' WHERE theme='difficulte_administrative' AND description='Travailler l’accès à la citoyenneté';
UPDATE public.ref_target SET description = 'Bénéficier d’un accompagnement pour accéder aux droits' WHERE theme='difficulte_administrative' AND description='Travailler l’accès aux droits';
UPDATE public.ref_target SET description = 'Bénéficier d''une mesure d''accompagnement adapté' WHERE theme='difficulte_administrative' AND description='Mise en place d''une mesure d''accompagnement adapté';
UPDATE public.ref_target SET description = 'Faire face à une situation d''endettement / surendettement' WHERE theme='difficulte_financiere' AND description='Réduire / apurer les dettes';
UPDATE public.ref_target SET description = 'Améliorer sa gestion budgétaire' WHERE theme='difficulte_financiere' AND description='Améliorer la gestion budgétaire';
UPDATE public.ref_target SET description = 'Mettre en place une mesure de protection financières (tutelles, curatelles, …)' WHERE theme='difficulte_financiere' AND description='Mettre en place une mesure de protection';
UPDATE public.ref_target SET description = 'S''informer sur les démarches liées au logement (budget, état des lieux… )' WHERE theme='logement' AND description='S''informer sur les démarches liées au logement ( budget, état des lieux… )';
UPDATE public.ref_target SET description = 'Réduire les impayés de loyer' WHERE theme='logement' AND description='Réduire les impayés';
UPDATE public.ref_target SET description = 'Rechercher une solution d’hébergement temporaire' WHERE theme='logement' AND description='Rechercher un hébergement';
UPDATE public.ref_target SET description = 'Apprendre / Améliorer ses capacités en français' WHERE theme='maitrise_langue' AND description='Améliorer la maitrise du français';
UPDATE public.ref_target SET description = 'Faire un point complet sur sa mobilité' WHERE theme='mobilite' AND description='Bénéficier d''un accompagnement permettant d''accèder à la mobilité';
UPDATE public.ref_target SET description = 'Trouver une solution de transport (hors acquisition ou entretien de véhicule)' WHERE theme='mobilite' AND description='Avoir accès aux transports en commun';
UPDATE public.ref_target SET description = 'Obtenir le permis de conduire (code / conduite)' WHERE theme='mobilite' AND description='Obtenir le permis de conduire / code de la route';
UPDATE public.ref_target SET description = 'Travailler la mobilité psychologique' WHERE theme='mobilite' AND description='Travailler la mobilité psychologique';
UPDATE public.ref_target SET description = 'Accéder a des service en ligne' WHERE theme='numerique' AND description='Travailler l’accès à une prestation';
UPDATE public.ref_target SET description = 'Maitriser les fondamentaux du numérique' WHERE theme='numerique' AND description='Accompagnement dans les démarches numériques';
UPDATE public.ref_target SET description = 'Bénéficier d’un accompagnement pour accéder aux droits et/ou aux soins' WHERE theme='sante' AND description='Accéder aux droits';
UPDATE public.ref_target SET description = 'Travailler sur les comportements de santé (dépendances, hygiène corporelle, dépistage, …)' WHERE theme='sante' AND description='Travailler sur les comportements de santé (dépendances, hygiène corporelle, dépistage… )';

--
-- delete migrations
--
DELETE FROM public.ref_situation WHERE theme='difficulte_administrative' AND description='Pas de mutuelle à jour';
DELETE FROM public.ref_situation WHERE theme='difficulte_administrative' AND description='Rencontre des difficultés sociales';
DELETE FROM public.ref_situation WHERE theme='difficulte_administrative' AND description='Code d''accès et/ou mot de passe perdu';
DELETE FROM public.ref_situation WHERE theme='difficulte_administrative' AND description='Sécurité sociale à mettre à jour';
DELETE FROM public.ref_target WHERE theme='difficulte_administrative' AND description='Accompagnement dans les démarches numériques';
DELETE FROM public.ref_target WHERE theme='difficulte_financiere' AND description='Faire une demande de droits sociaux ( RSA, ASS… )';
DELETE FROM public.ref_target WHERE theme='logement' AND description='Rupture effective d''hébergemnt';
DELETE FROM public.ref_target WHERE theme='logement' AND description='Accèder au logement social';
DELETE FROM public.ref_target WHERE theme='logement' AND description='Se maintenir dans un hébergement';
DELETE FROM public.ref_target WHERE theme='logement' AND description='Recherche d''un hébergement';
DELETE FROM public.ref_target WHERE theme='logement' AND description='Démarche de relogement suite à une problématique d''insalubrité ( DALO )';
DELETE FROM public.ref_target WHERE theme='maitrise_langue' AND description='Améliorer les savoirs : à l’écriture et la lecture';
DELETE FROM public.ref_target WHERE theme='mobilite' AND description='Bénéficier d''une aide financière pour le passage du permis de conduire';
DELETE FROM public.ref_target WHERE theme='mobilite' AND description='Bénéficier d''une aide financière pour l''achat de véhicule';
DELETE FROM public.ref_target WHERE theme='numerique' AND description='Mise en place d’une mesure d’accompagnement adapté';
DELETE FROM public.ref_target WHERE theme='sante' AND description='Accéder aux soins';
DELETE FROM public.ref_target WHERE theme='sante' AND description='Mettre en place une mesure de protection administrative ou juridique';
