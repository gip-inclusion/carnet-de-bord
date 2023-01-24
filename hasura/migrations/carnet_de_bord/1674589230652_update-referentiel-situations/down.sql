-- down.sql

--
-- update json migrations
--
UPDATE public.notebook_focus set situations = situations - 'Autres contraintes familiales à prendre en compte' || '["Autres contraintes"]'::jsonb  WHERE situations ? 'Autres contraintes familiales à prendre en compte';
UPDATE public.notebook_focus set situations = situations - 'Aidant familial (s’occuper d’un proche)' || '["Aidant familial ( s’occuper d’un proche )"]'::jsonb  WHERE situations ? 'Aidant familial (s’occuper d’un proche)';
UPDATE public.notebook_focus set situations = situations - 'Couverture sociale / mutuelle à mettre à jour' || '["Pas de mutuelle à jour"]'::jsonb  WHERE situations ? 'Couverture sociale / mutuelle à mettre à jour';
UPDATE public.notebook_focus set situations = situations - 'Difficultés à effectuer une démarche administrative' || '["Difficulté à effectuer une démarche administrative"]'::jsonb  WHERE situations ? 'Difficultés à effectuer une démarche administrative';
UPDATE public.notebook_focus set situations = situations - 'Couverture sociale / mutuelle à mettre à jour' || '["Sécurité sociale à mettre à jour"]'::jsonb  WHERE situations ? 'Couverture sociale / mutuelle à mettre à jour';
UPDATE public.notebook_focus set situations = situations - 'Ressources précaires (inférieures au seuil de pauvreté)' || '["Ressources précaires"]'::jsonb  WHERE situations ? 'Ressources précaires (inférieures au seuil de pauvreté)';
UPDATE public.notebook_focus set situations = situations - 'Sans hébergement / rupture effective de logement' || '["Sans hébergement"]'::jsonb  WHERE situations ? 'Sans hébergement / rupture effective de logement';
UPDATE public.notebook_focus set situations = situations - 'Locataire du parc social' || '["Locataire parc social"]'::jsonb  WHERE situations ? 'Locataire du parc social';
UPDATE public.notebook_focus set situations = situations - 'Locataire du parc privé' || '["Locataire parc privé"]'::jsonb  WHERE situations ? 'Locataire du parc privé';
UPDATE public.notebook_focus set situations = situations - 'Autre type de logement (hôtel, …)' || '["Autre type de logement ( hôtel… )"]'::jsonb  WHERE situations ? 'Autre type de logement (hôtel, …)';
UPDATE public.notebook_focus set situations = situations - 'Hébergement collectif de type CHRS, CHU, CPH, CADA, …' || '["Hébergement collectif de type ( CHRS, CHU, CPH, CADA… )"]'::jsonb  WHERE situations ? 'Hébergement collectif de type CHRS, CHU, CPH, CADA, …';
UPDATE public.notebook_focus set situations = situations - 'Non maitrise de l’écrit en français (écrit)' || '["Non maitrise de la langue française"]'::jsonb  WHERE situations ? 'Non maitrise de l’écrit en français (écrit)';
UPDATE public.notebook_focus set situations = situations - 'Non maitrise de la compréhension du français (parlé)' || '["Interprétariat nécessaire"]'::jsonb  WHERE situations ? 'Non maitrise de la compréhension du français (parlé)';
UPDATE public.notebook_focus set situations = situations - 'Non maitrise de la lecture en français (lu)' || '["Difficulté dans la lecture"]'::jsonb  WHERE situations ? 'Non maitrise de la lecture en français (lu)';
UPDATE public.notebook_focus set situations = situations - 'Autres permis (poids lourd, bus, …)' || '["Autres permis ( poids lourds, bus… )"]'::jsonb  WHERE situations ? 'Autres permis (poids lourd, bus, …)';
UPDATE public.notebook_focus set situations = situations - 'Permis et/ou code en cours' || '["Permis ou/et code en cours"]'::jsonb  WHERE situations ? 'Permis et/ou code en cours';
UPDATE public.notebook_focus set situations = situations - 'Véhicule (voiture, moto, scooter)' || '["Véhicule ( voiture, moto, scooter )"]'::jsonb  WHERE situations ? 'Véhicule (voiture, moto, scooter)';
UPDATE public.notebook_focus set situations = situations - 'Permis non valide / suspension de permis' || '["Permis non valide / Suspension permis"]'::jsonb  WHERE situations ? 'Permis non valide / suspension de permis';
UPDATE public.notebook_focus set situations = situations - 'Absence de connexion' || '["Absence d''équipement ou de connexion"]'::jsonb  WHERE situations ? 'Absence de connexion';
UPDATE public.notebook_focus set situations = situations - 'Absence d’adresse ou d’utilisation de la messagerie' || '["Absence d''adresse de messagerie"]'::jsonb  WHERE situations ? 'Absence d’adresse ou d’utilisation de la messagerie';
UPDATE public.notebook_focus set situations = situations - 'Usage basique du numérique (-50%)' || '["Accès ou utilisation difficile des outils numériques"]'::jsonb  WHERE situations ? 'Usage basique du numérique (-50%)';
UPDATE public.notebook_focus set situations = situations - 'Couverture sociale / mutuelle à mettre à jour' || '["Couverture sociale à mettre à jour"]'::jsonb  WHERE situations ? 'Couverture sociale / mutuelle à mettre à jour';
UPDATE public.notebook_target SET target='Recherche de mode de garde' WHERE target= 'Trouver des solutions de garde d’enfant';
UPDATE public.notebook_target SET target='Devenir aidant familial salarié' WHERE target= 'Obtenir le statut d’aidant familial';
UPDATE public.notebook_target SET target='Travailler l’accès à une prestation' WHERE target= 'Bénéficier d’un appui aux démarches administratives';
UPDATE public.notebook_target SET target='Travailler l’accès à la citoyenneté' WHERE target= 'Bénéficier d''un accompagnement à l''accès à la citoyenneté';
UPDATE public.notebook_target SET target='Travailler l’accès aux droits' WHERE target= 'Bénéficier d’un accompagnement pour accéder aux droits';
UPDATE public.notebook_target SET target='Accompagnement dans les démarches numériques' WHERE target= 'Maitriser les fondamentaux du numérique';
UPDATE public.notebook_target SET target='Mise en place d''une mesure d''accompagnement adapté' WHERE target= 'Bénéficier d''une mesure d''accompagnement adapté';
UPDATE public.notebook_target SET target='Réduire / apurer les dettes' WHERE target= 'Faire face à une situation d''endettement / surendettement';
UPDATE public.notebook_target SET target='Améliorer la gestion budgétaire' WHERE target= 'Améliorer sa gestion budgétaire';
UPDATE public.notebook_target SET target='Mettre en place une mesure de protection' WHERE target= 'Mettre en place une mesure de protection financières (tutelles, curatelles, …)';
UPDATE public.notebook_target SET target='Accèder au logement social' WHERE target= 'Accéder à un logement';
UPDATE public.notebook_target SET target='S''informer sur les démarches liées au logement ( budget, état des lieux… )' WHERE target= 'S''informer sur les démarches liées au logement (budget, état des lieux… )';
UPDATE public.notebook_target SET target='Réduire les impayés' WHERE target= 'Réduire les impayés de loyer';
UPDATE public.notebook_target SET target='Rechercher un hébergement' WHERE target= 'Rechercher une solution d’hébergement temporaire';
UPDATE public.notebook_target SET target='Se maintenir dans un hébergement' WHERE target= 'Se maintenir dans le logement';
UPDATE public.notebook_target SET target='Recherche d''un hébergement' WHERE target= 'Rechercher une solution d’hébergement temporaire';
UPDATE public.notebook_target SET target='Démarche de relogement suite à une problématique d''insalubrité ( DALO )' WHERE target= 'Changer de logement';
UPDATE public.notebook_target SET target='Améliorer la maitrise du français' WHERE target= 'Apprendre / Améliorer ses capacités en français';
UPDATE public.notebook_target SET target='Améliorer les savoirs : à l’écriture et la lecture' WHERE target= 'Apprendre / Améliorer ses capacités en français';
UPDATE public.notebook_target SET target='Bénéficier d''un accompagnement permettant d''accèder à la mobilité' WHERE target= 'Faire un point complet sur sa mobilité';
UPDATE public.notebook_target SET target='Avoir accès aux transports en commun' WHERE target= 'Trouver une solution de transport (hors acquisition ou entretien de véhicule)';
UPDATE public.notebook_target SET target='Obtenir le permis de conduire / code de la route' WHERE target= 'Obtenir le permis de conduire (code / conduite)';
UPDATE public.notebook_target SET target='Travailler la mobilité psychologique' WHERE target= 'Travailler la mobilité psychologique';
UPDATE public.notebook_target SET target='Travailler l’accès à une prestation' WHERE target= 'Accéder a des service en ligne';
UPDATE public.notebook_target SET target='Accompagnement dans les démarches numériques' WHERE target= 'Maitriser les fondamentaux du numérique';
UPDATE public.notebook_target SET target='Mise en place d’une mesure d’accompagnement adapté' WHERE target= 'Mise en place d’une mesure d’accompagnement adapté';
UPDATE public.notebook_target SET target='Accéder aux droits' WHERE target= 'Bénéficier d’un accompagnement pour accéder aux droits et/ou aux soins';
UPDATE public.notebook_target SET target='Travailler sur les comportements de santé (dépendances, hygiène corporelle, dépistage… )' WHERE target= 'Travailler sur les comportements de santé (dépendances, hygiène corporelle, dépistage, …)';
UPDATE public.notebook_target SET target='Accéder aux soins' WHERE target= 'Bénéficier d’un accompagnement pour accéder aux droits et/ou aux soins';

--
-- insert migrations
--
INSERT INTO public.ref_situation (description, theme) VALUES('Pas de mutuelle à jour', 'difficulte_administrative');
INSERT INTO public.ref_situation (description, theme) VALUES('Rencontre des difficultés sociales', 'difficulte_administrative');
INSERT INTO public.ref_target (description, theme) VALUES('Accompagnement dans les démarches numériques', 'difficulte_administrative');
INSERT INTO public.ref_target (description, theme) VALUES('Rupture effective d''hébergemnt', 'logement');
INSERT INTO public.ref_target (description, theme) VALUES('Accèder au logement social', 'logement');
INSERT INTO public.ref_target (description, theme) VALUES('Se maintenir dans un hébergement', 'logement');
INSERT INTO public.ref_target (description, theme) VALUES('Recherche d''un hébergement', 'logement');
INSERT INTO public.ref_target (description, theme) VALUES('Démarche de relogement suite à une problématique d''insalubrité ( DALO )', 'logement');
INSERT INTO public.ref_target (description, theme) VALUES('Améliorer les savoirs : à l’écriture et la lecture', 'maitrise_langue');
INSERT INTO public.ref_target (description, theme) VALUES('Bénéficier d''une aide financière pour le passage du permis de conduire', 'mobilite');
INSERT INTO public.ref_target (description, theme) VALUES('Mise en place d’une mesure d’accompagnement adapté', 'numerique');
INSERT INTO public.ref_target (description, theme) VALUES('Accéder aux soins', 'sante');
INSERT INTO public.ref_target (description, theme) VALUES('Mettre en place une mesure de protection administrative ou juridique', 'sante');

--
-- update migrations
--
UPDATE public.ref_situation SET description = 'Autres contraintes' WHERE theme='contraintes_familiales' AND description='Autres contraintes familiales à prendre en compte';
UPDATE public.ref_situation SET description = 'Aidant familial ( s’occuper d’un proche )' WHERE theme='contraintes_familiales' AND description='Aidant familial (s’occuper d’un proche)';
UPDATE public.ref_situation SET description = 'Difficulté à effectuer une démarche administrative' WHERE theme='difficulte_administrative' AND description='Difficultés à effectuer une démarche administrative';
UPDATE public.ref_situation SET description = 'Ressources précaires' WHERE theme='difficulte_financiere' AND description='Ressources précaires (inférieures au seuil de pauvreté)';
UPDATE public.ref_situation SET description = 'Sans hébergement' WHERE theme='logement' AND description='Sans hébergement / rupture effective de logement';
UPDATE public.ref_situation SET description = 'Locataire parc social' WHERE theme='logement' AND description='Locataire du parc social';
UPDATE public.ref_situation SET description = 'Locataire parc privé' WHERE theme='logement' AND description='Locataire du parc privé';
UPDATE public.ref_situation SET description = 'Autre type de logement ( hôtel… )' WHERE theme='logement' AND description='Autre type de logement (hôtel, …)';
UPDATE public.ref_situation SET description = 'Hébergement collectif de type ( CHRS, CHU, CPH, CADA… )' WHERE theme='logement' AND description='Hébergement collectif de type CHRS, CHU, CPH, CADA, …';
UPDATE public.ref_situation SET description = 'Non maitrise de la langue française' WHERE theme='maitrise_langue' AND description='Non maitrise de l’écrit en français (écrit)';
UPDATE public.ref_situation SET description = 'Interprétariat nécessaire' WHERE theme='maitrise_langue' AND description='Non maitrise de la compréhension du français (parlé)';
UPDATE public.ref_situation SET description = 'Difficulté dans la lecture' WHERE theme='maitrise_langue' AND description='Non maitrise de la lecture en français (lu)';
UPDATE public.ref_situation SET description = 'Autres permis ( poids lourds, bus… )' WHERE theme='mobilite' AND description='Autres permis (poids lourd, bus, …)';
UPDATE public.ref_situation SET description = 'Permis ou/et code en cours' WHERE theme='mobilite' AND description='Permis et/ou code en cours';
UPDATE public.ref_situation SET description = 'Véhicule ( voiture, moto, scooter )' WHERE theme='mobilite' AND description='Véhicule (voiture, moto, scooter)';
UPDATE public.ref_situation SET description = 'Permis non valide / Suspension permis' WHERE theme='mobilite' AND description='Permis non valide / suspension de permis';
UPDATE public.ref_situation SET description = 'Absence d''équipement ou de connexion' WHERE theme='numerique' AND description='Absence de connexion';
UPDATE public.ref_situation SET description = 'Absence d''adresse de messagerie' WHERE theme='numerique' AND description='Absence d’adresse ou d’utilisation de la messagerie';
UPDATE public.ref_situation SET description = 'Accès ou utilisation difficile des outils numériques' WHERE theme='numerique' AND description='Usage basique du numérique (-50%)';
UPDATE public.ref_situation SET description = 'Couverture sociale à mettre à jour' WHERE theme='sante' AND description='Couverture sociale / mutuelle à mettre à jour';
UPDATE public.ref_target SET description = 'Recherche de mode de garde' WHERE theme='contraintes_familiales' AND description='Trouver des solutions de garde d’enfant';
UPDATE public.ref_target SET description = 'Devenir aidant familial salarié' WHERE theme='contraintes_familiales' AND description='Obtenir le statut d’aidant familial';
UPDATE public.ref_target SET description = 'Travailler l’accès à une prestation' WHERE theme='difficulte_administrative' AND description='Bénéficier d’un appui aux démarches administratives';
UPDATE public.ref_target SET description = 'Travailler l’accès à la citoyenneté' WHERE theme='difficulte_administrative' AND description='Bénéficier d''un accompagnement à l''accès à la citoyenneté';
UPDATE public.ref_target SET description = 'Travailler l’accès aux droits' WHERE theme='difficulte_administrative' AND description='Bénéficier d’un accompagnement pour accéder aux droits';
UPDATE public.ref_target SET description = 'Mise en place d''une mesure d''accompagnement adapté' WHERE theme='difficulte_administrative' AND description='Bénéficier d''une mesure d''accompagnement adapté';
UPDATE public.ref_target SET description = 'Réduire / apurer les dettes' WHERE theme='difficulte_financiere' AND description='Faire face à une situation d''endettement / surendettement';
UPDATE public.ref_target SET description = 'Améliorer la gestion budgétaire' WHERE theme='difficulte_financiere' AND description='Améliorer sa gestion budgétaire';
UPDATE public.ref_target SET description = 'Mettre en place une mesure de protection' WHERE theme='difficulte_financiere' AND description='Mettre en place une mesure de protection financières (tutelles, curatelles, …)';
UPDATE public.ref_target SET description = 'S''informer sur les démarches liées au logement ( budget, état des lieux… )' WHERE theme='logement' AND description='S''informer sur les démarches liées au logement (budget, état des lieux… )';
UPDATE public.ref_target SET description = 'Réduire les impayés' WHERE theme='logement' AND description='Réduire les impayés de loyer';
UPDATE public.ref_target SET description = 'Rechercher un hébergement' WHERE theme='logement' AND description='Rechercher une solution d’hébergement temporaire';
UPDATE public.ref_target SET description = 'Améliorer la maitrise du français' WHERE theme='maitrise_langue' AND description='Apprendre / Améliorer ses capacités en français';
UPDATE public.ref_target SET description = 'Bénéficier d''un accompagnement permettant d''accèder à la mobilité' WHERE theme='mobilite' AND description='Faire un point complet sur sa mobilité';
UPDATE public.ref_target SET description = 'Avoir accès aux transports en commun' WHERE theme='mobilite' AND description='Trouver une solution de transport (hors acquisition ou entretien de véhicule)';
UPDATE public.ref_target SET description = 'Obtenir le permis de conduire / code de la route' WHERE theme='mobilite' AND description='Obtenir le permis de conduire (code / conduite)';
UPDATE public.ref_target SET description = 'Travailler la mobilité psychologique' WHERE theme='mobilite' AND description='Travailler la mobilité psychologique';
UPDATE public.ref_target SET description = 'Travailler l’accès à une prestation' WHERE theme='numerique' AND description='Accéder a des service en ligne';
UPDATE public.ref_target SET description = 'Accompagnement dans les démarches numériques' WHERE theme='numerique' AND description='Maitriser les fondamentaux du numérique';
UPDATE public.ref_target SET description = 'Accéder aux droits' WHERE theme='sante' AND description='Bénéficier d’un accompagnement pour accéder aux droits et/ou aux soins';
UPDATE public.ref_target SET description = 'Travailler sur les comportements de santé (dépendances, hygiène corporelle, dépistage… )' WHERE theme='sante' AND description='Travailler sur les comportements de santé (dépendances, hygiène corporelle, dépistage, …)';

--
-- delete migrations
--
DELETE FROM public.ref_situation WHERE theme='logement' AND description='Besoin d''adapter le logement';
DELETE FROM public.ref_situation WHERE theme='maitrise_langue' AND description='Difficultés en calcul';
DELETE FROM public.ref_situation WHERE theme='mobilite' AND description='État de santé incompatible avec la conduite';
DELETE FROM public.ref_situation WHERE theme='mobilite' AND description='Permis étranger (hors EEE)';
DELETE FROM public.ref_situation WHERE theme='numerique' AND description='Absence d’équipement';
DELETE FROM public.ref_situation WHERE theme='numerique' AND description='Non maitrise du numérique (0%)';
DELETE FROM public.ref_situation WHERE theme='numerique' AND description='Usage avancé du numérique (50%-80%)';
DELETE FROM public.ref_situation WHERE theme='numerique' AND description='Usage expert du numérique (+80%)';
DELETE FROM public.ref_target WHERE theme='contraintes_familiales' AND description='Faire face à la prise en charge d’une personne dépendante';
DELETE FROM public.ref_target WHERE theme='contraintes_familiales' AND description='Surmonter des difficultés éducatives ou de parentalité';
DELETE FROM public.ref_target WHERE theme='contraintes_familiales' AND description='Faire face à un conflit familial et/ou une séparation';
DELETE FROM public.ref_target WHERE theme='difficulte_administrative' AND description='Prendre en compte une problématique judiciaire';
DELETE FROM public.ref_target WHERE theme='difficulte_administrative' AND description='Connaître les voies de recours face à une discrimination';
DELETE FROM public.ref_target WHERE theme='maitrise_langue' AND description='Apprendre / Améliorer ses capacités en calcul';
DELETE FROM public.ref_target WHERE theme='numerique' AND description='Accéder à une connexion internet';
DELETE FROM public.ref_target WHERE theme='numerique' AND description='Accéder à un ordinateur, une tablette ou un smartphone';
DELETE FROM public.ref_action WHERE theme='difficulte_financiere' AND description='Faire une demande de droits sociaux (RSA, ASS, Prime d''activité, …)';
DELETE FROM public.ref_action WHERE theme='undefined' AND description='Réalisation d''une demande de mesure de protection administrative ou juridique"';
DELETE FROM public.ref_action WHERE theme='undefined' AND description='Constitution d’une demande d''aide financière pour l’achat d’un véhicule';
