DO language plpgsql $$
BEGIN
	RAISE NOTICE 'SEED %', now();
END
$$;

TRUNCATE public.admin_structure_structure CASCADE;
TRUNCATE public.beneficiary_structure CASCADE;
TRUNCATE public.structure CASCADE;

TRUNCATE public.notebook_focus CASCADE;
TRUNCATE public.notebook_target CASCADE;
TRUNCATE public.notebook_action CASCADE;
TRUNCATE public.notebook_event CASCADE;
TRUNCATE public.notebook_member CASCADE;

TRUNCATE public.admin_cdb CASCADE;
TRUNCATE public.manager CASCADE;
TRUNCATE public.admin_structure CASCADE;
TRUNCATE public.professional CASCADE;
TRUNCATE public.beneficiary CASCADE;
TRUNCATE public.notebook CASCADE;

TRUNCATE public.deployment CASCADE;
TRUNCATE public.ref_target CASCADE;
TRUNCATE public.ref_situation CASCADE;
TRUNCATE public.ref_action CASCADE;

TRUNCATE public.account CASCADE;

SET check_function_bodies = false;
INSERT INTO public.admin_cdb (id, email, firstname, lastname) VALUES ('a81bc81a-dead-4e5d-abff-90865d1e13b7', 'support.carnet-de-bord@fabrique.social.gouv.fr', 'Carnet de Bord', 'Administrateur');
INSERT INTO public.account (id, username, type, access_key, access_key_date, last_login, beneficiary_id, professional_id, admin_id, confirmed, onboarding_done) VALUES ('9eee9fea-bf3e-4eb8-8f43-d9b7fd6fae76', 'admin', 'admin_cdb', NULL, NULL, '2021-09-21 12:25:55.822+00', NULL, NULL, 'a81bc81a-dead-4e5d-abff-90865d1e13b7', true, false);
INSERT INTO public.deployment (id, label) VALUES ('4dab8036-a86e-4d5f-9bd4-6ce88c1940d0', 'expérimentation 93');
INSERT INTO public.deployment (id, label, config) VALUES ('c5c3a933-6f4a-4b2b-aa49-7a816eaef16b', 'expérimentation 51', '{"url": "http://localhost:3000/api/test", "headers": {"token":"azerty"}, "callback": "/api/marne" }');

INSERT INTO public.manager (id, email, firstname, lastname, deployment_id) VALUES ('01a3d906-70d9-42e6-9b61-2ccf030e5d8f', 'support.carnet-de-bord@fabrique.social.gouv.fr', 'Agathe', 'DeBlouze', '4dab8036-a86e-4d5f-9bd4-6ce88c1940d0');
INSERT INTO public.account (id, username, type, manager_id, confirmed, onboarding_done) VALUES ('96cb6e09-81fa-44e9-9b3f-75c93ad96f94', 'manager.cd93', 'manager', '01a3d906-70d9-42e6-9b61-2ccf030e5d8f', true, false);
INSERT INTO public.manager (id, email, firstname, lastname, deployment_id) VALUES ('cc32124d-f810-4193-a855-db76915ae7e4', 'contact.carnet-de-bord@fabrique.social.gouv.fr', 'Gérard', 'Manvol', 'c5c3a933-6f4a-4b2b-aa49-7a816eaef16b');
INSERT INTO public.account (id, username, type, manager_id, confirmed, onboarding_done) VALUES ('3f4c5d95-b25c-4e18-a2c6-b394b8221c8f', 'manager.cd51', 'manager', 'cc32124d-f810-4193-a855-db76915ae7e4', true, false);
INSERT INTO public.beneficiary (id, email, lastname, firstname, caf_number, pe_number, postal_code, city, address1, address2, mobile_number, date_of_birth, deployment_id) VALUES ('c6e84ed6-eb31-47f0-bd71-9e4d7843cf0b', 'stifour93@yahoo.fr', 'Tifour', 'Sophie', '2055990', '300000L', '93190', 'Livry-Gargan', '7 chemin du soleil', NULL, '0606060606', '1982-02-01', '4dab8036-a86e-4d5f-9bd4-6ce88c1940d0');
INSERT INTO public.structure (id, siret, name, short_desc, phone, email, postal_code, city, address1, address2, website, deployment_id) VALUES ('a81bc81b-dead-4e5d-abff-90865d1e13b2', NULL, 'Pole Emploi Agence Livry-Gargnan', 'Pole Emploi Agence Livry-Gargnan', '09 72 72 39 49', 'contact@pole-emploi.fr', '93190', 'Die', '33 Bd Robert Schuman', NULL, NULL, '4dab8036-a86e-4d5f-9bd4-6ce88c1940d0');
INSERT INTO public.structure (id, siret, name, short_desc, phone, email, postal_code, city, address1, address2, website, deployment_id) VALUES ('1c52e5ad-e0b9-48b9-a490-105a4effaaea', NULL, 'Centre Communal d''action social Livry-Gargan', '', '01 41 70 88 00', '', NULL, 'Saint Denis', ' 3 Pl. François Mitterrand', NULL, NULL, '4dab8036-a86e-4d5f-9bd4-6ce88c1940d0');
INSERT INTO public.structure (id, siret, name, short_desc, phone, email, postal_code, city, address1, address2, website, deployment_id) VALUES ('e578237f-6167-4012-b457-7c4f36fb079d', NULL, 'Service Social Départemental', NULL, '01 71 29 43 80', NULL, '93800', 'Épinay-sur-Seine', ' 38 Av. Salvador Allende', NULL, NULL, '4dab8036-a86e-4d5f-9bd4-6ce88c1940d0');
INSERT INTO public.structure (id, siret, name, short_desc, phone, email, postal_code, city, address1, address2, website, deployment_id) VALUES ('8b71184c-6479-4440-aa89-15da704cc792', NULL, 'Groupe NS', NULL, '01 87 97 36 45', NULL, '91300', 'Montreuil', '28 rue de Lorraine', NULL, NULL, '4dab8036-a86e-4d5f-9bd4-6ce88c1940d0');
INSERT INTO public.structure (id, siret, name, short_desc, phone, email, postal_code, city, address1, address2, website, deployment_id) VALUES ('58d09cad-ed8c-4278-b449-e6673ae0fad4', NULL, 'Amélie', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '4dab8036-a86e-4d5f-9bd4-6ce88c1940d0');
INSERT INTO public.structure (id, siret, name, short_desc, phone, email, postal_code, city, address1, address2, website, deployment_id) VALUES ('e8d09cad-ed8c-4278-b449-e6673ae0fad4', NULL, 'Sécurité sociale', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '4dab8036-a86e-4d5f-9bd4-6ce88c1940d0');
INSERT INTO public.structure (id, siret, name, short_desc, phone, email, postal_code, city, address1, address2, website, deployment_id) VALUES ('3b299bcb-445c-48db-bc61-e30cd52d65b6', NULL, 'AFPA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '4dab8036-a86e-4d5f-9bd4-6ce88c1940d0');
INSERT INTO public.structure (id, siret, name, short_desc, phone, email, postal_code, city, address1, address2, website, deployment_id) VALUES ('dfaaa6e1-4c5a-4079-a191-e8611d573acf', NULL, 'Plateforme - Ma demande de logement social', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '4dab8036-a86e-4d5f-9bd4-6ce88c1940d0');
INSERT INTO public.structure (id, siret, name, short_desc, phone, email, postal_code, city, address1, address2, website, deployment_id) VALUES ('dfaaa6e3-4c5a-4079-a191-e8611d573acf', NULL, 'Interlogement 93', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '4dab8036-a86e-4d5f-9bd4-6ce88c1940d0');
INSERT INTO public.structure (id, siret, name, short_desc, phone, email, postal_code, city, address1, address2, website, deployment_id) VALUES ('c0b8aee3-c061-4023-b57e-92880627d589', NULL, 'Interlogement 51', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'c5c3a933-6f4a-4b2b-aa49-7a816eaef16b');
INSERT INTO public.professional (id, structure_id, email, lastname, firstname, "position", mobile_number) VALUES ('1a5b817b-6b81-4a4d-9953-26707a54e0e9', '1c52e5ad-e0b9-48b9-a490-105a4effaaea', 'pierre.chevalier@livry-gargan.fr', 'Pierre', 'Chevalier', 'Conseiller en insertion', '01 41 70 88 00');
INSERT INTO public.account (id, username, type, access_key, access_key_date, last_login, beneficiary_id, professional_id, admin_id, confirmed, onboarding_done) VALUES ('17434464-5f69-40cc-8172-40160958a33d', 'pierre.chevalier', 'professional', NULL, NULL, '2021-09-27 14:08:02.222+00', NULL, '1a5b817b-6b81-4a4d-9953-26707a54e0e9', NULL, true, true);
INSERT INTO public.professional (id, structure_id, email, lastname, firstname, "position", mobile_number) VALUES ('e1fdb7a8-7d0e-4b2e-b28c-89a662d090a3', 'e578237f-6167-4012-b457-7c4f36fb079d', 'pcamara@seinesaintdenis.fr', 'Paul', 'Camara', 'Assistant de service social', '01 71 29 43 80');
INSERT INTO public.account (id, username, type, access_key, access_key_date, last_login, beneficiary_id, professional_id, admin_id, confirmed, onboarding_done) VALUES ('d0b8f314-5e83-4535-9360-60f29dcfb5c8', 'pcamara', 'professional', NULL, NULL, NULL, NULL, 'e1fdb7a8-7d0e-4b2e-b28c-89a662d090a3', NULL, true, true);
INSERT INTO public.professional (id, structure_id, email, lastname, firstname, "position", mobile_number) VALUES ('74323049-eae6-4ccd-b596-e95514a32781', '8b71184c-6479-4440-aa89-15da704cc792', 'sanka@groupe-ns.fr', 'Anka', 'Simon', 'Conseiller en Insertion Professionnel', NULL);
INSERT INTO public.account (id, username, type, access_key, access_key_date, last_login, beneficiary_id, professional_id, admin_id, confirmed, onboarding_done) VALUES ('a501db53-1b79-4a60-860b-5972bd184f98', 'sanka', 'professional', NULL, NULL, NULL, NULL, '74323049-eae6-4ccd-b596-e95514a32781', NULL, true, true);
INSERT INTO public.professional (id, structure_id, email, lastname, firstname, "position", mobile_number) VALUES ('a81bc81b-dead-4e5d-abff-90865d1e13b3', 'a81bc81b-dead-4e5d-abff-90865d1e13b2', 'dunord@pole-emploi.fr', 'Dunord', 'Thierry', 'Conseiller pôle emploi', '');
INSERT INTO public.account (id, username, type, access_key, access_key_date, last_login, beneficiary_id, professional_id, admin_id, confirmed, onboarding_done) VALUES ('17434464-5f69-40cc-8173-40160958a33d', 'thierry.dunord', 'professional', NULL, NULL, '2021-08-23 07:59:48.689+00', NULL, 'a81bc81b-dead-4e5d-abff-90865d1e13b3', NULL, true, true);
INSERT INTO public.professional (id, structure_id, email, lastname, firstname, "position", mobile_number) VALUES ('9b5f4863-dd2e-4680-af40-46258c457654', 'c0b8aee3-c061-4023-b57e-92880627d589', 'jeanpoiret@mission-locale.fr', 'Poiret', 'Jean', 'Conseiller Logement', '');
INSERT INTO public.account (id, username, type, professional_id, confirmed, onboarding_done) VALUES ('db78bfd9-aedb-4220-bf0a-f62b0528e5bf', 'jean.poiret', 'professional', '9b5f4863-dd2e-4680-af40-46258c457654', true, false);
INSERT INTO public.notebook (id, beneficiary_id, created_at, right_rsa, right_rqth, right_are, right_ass, right_bonus, geographical_area, education_level, work_situation_date, contract_type, contract_sign_date, work_situation) VALUES ('9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d', 'c6e84ed6-eb31-47f0-bd71-9e4d7843cf0b', '2021-09-21 11:51:37.295647+00', 'rsa_droit_ouvert_et_suspendu', false, false, false, false, 'between_10_20', 'level_3', '2021-09-22', 'cer', '2020-01-05', 'iae');
INSERT INTO public.wanted_job (rome_code_id, notebook_id) VALUES ((SELECT public.rome_code.id FROM public.rome_code WHERE label = 'Aide à domicile (K1304)'), '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d');
INSERT INTO public.notebook_focus (id, theme, situations, creator_id, notebook_id, created_at, linked_to) VALUES ('a55d1dd2-2b09-4456-bcc5-1412695f684f', 'logement', '["Chez un tiers"]', '1a5b817b-6b81-4a4d-9953-26707a54e0e9', '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d', '2021-09-21 13:15:54.752334+00', 'cer');
INSERT INTO public.notebook_focus (id, theme, situations, creator_id, notebook_id, created_at, linked_to) VALUES ('19911b5c-e614-450d-bbeb-eba0d8ae1e18', 'difficulte_administrative', '["Accès au droit"]', '1a5b817b-6b81-4a4d-9953-26707a54e0e9', '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d', '2021-09-21 13:26:42.939011+00', 'cer');
INSERT INTO public.notebook_focus (id, theme, situations, creator_id, notebook_id, created_at, linked_to) VALUES ('d4bf4811-bbce-4f99-8b57-358187653b59', 'emploi', '["En construction de projet"]', '1a5b817b-6b81-4a4d-9953-26707a54e0e9', '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d', '2021-09-21 13:33:16.96523+00', 'cer');
INSERT INTO public.notebook_target (id, focus_id, target, creator_id, created_at) VALUES ('7bfa2130-fe72-418e-8486-000c171cb853', 'a55d1dd2-2b09-4456-bcc5-1412695f684f', 'Recherche d''un logement', '1a5b817b-6b81-4a4d-9953-26707a54e0e9', '2021-09-21 13:17:53.594417+00');
INSERT INTO public.notebook_target (id, focus_id, target, creator_id, created_at) VALUES ('0dac08fa-c103-438d-bf98-6b725a892e2d', 'd4bf4811-bbce-4f99-8b57-358187653b59', 'Définition d''un parcours de formation personnalisé', '1a5b817b-6b81-4a4d-9953-26707a54e0e9', '2021-09-21 13:34:17.493745+00');
INSERT INTO public.notebook_target (id, focus_id, target, creator_id, created_at) VALUES ('8445b9bc-e523-4ff3-91dd-fd11bb413ae5', 'd4bf4811-bbce-4f99-8b57-358187653b59', 'Acceder à l''emploi', '1a5b817b-6b81-4a4d-9953-26707a54e0e9', '2021-09-21 13:35:11.636378+00');
INSERT INTO public.notebook_target (id, focus_id, target, creator_id, created_at) VALUES ('2ce91415-b3bb-404f-adec-bbc6ea5af464', '19911b5c-e614-450d-bbeb-eba0d8ae1e18', 'Être accompagné dans les démarches d''accès au soin', '1a5b817b-6b81-4a4d-9953-26707a54e0e9', '2021-09-21 14:55:12.797276+00');
INSERT INTO public.notebook_action (id, action, target_id, status, creator_id, created_at) VALUES ('3d0dc2b5-3dc8-4f5d-9e82-661299b3d522', 'Avoir un pass IAE validé', '8445b9bc-e523-4ff3-91dd-fd11bb413ae5', 'in_progress', '1a5b817b-6b81-4a4d-9953-26707a54e0e9', '2021-06-08 13:42:53.239372+00');
INSERT INTO public.notebook_action (id, action, target_id, status, creator_id, created_at) VALUES ('3d0dc2b5-3dc8-4f5d-9e82-661299b3d533', 'Formation certifiante', '8445b9bc-e523-4ff3-91dd-fd11bb413ae5', 'in_progress', '74323049-eae6-4ccd-b596-e95514a32781', '2021-07-01 15:34:53.239372+00');
INSERT INTO public.notebook_action (id, action, target_id, status, creator_id, created_at) VALUES ('54c982ce-36f8-4124-a6eb-689f8f25a2e7', 'Demande SIAO', '7bfa2130-fe72-418e-8486-000c171cb853', 'in_progress', 'e1fdb7a8-7d0e-4b2e-b28c-89a662d090a3', '2020-01-05 13:55:43.100609+00');
INSERT INTO public.notebook_action (id, action, target_id, status, creator_id, created_at) VALUES ('64c982ce-36f8-4124-a6eb-689f8f25a2f7', 'Demande SIAO', '7bfa2130-fe72-418e-8486-000c171cb853', 'in_progress', 'e1fdb7a8-7d0e-4b2e-b28c-89a662d090a3', '2020-03-01 13:55:43.100609+00');
INSERT INTO public.notebook_action (id, action, target_id, status, creator_id, created_at) VALUES ('59c7f3b7-ca19-4408-bcb8-9b4fa8a07282', 'Demande de logement social', '7bfa2130-fe72-418e-8486-000c171cb853', 'in_progress', '1a5b817b-6b81-4a4d-9953-26707a54e0e9', '2020-07-01 15:13:59.820331+00');
INSERT INTO public.notebook_action (id, action, target_id, status, creator_id, created_at) VALUES ('9f7289e2-8abd-4ef8-bc3c-6b90be77ca63', 'Demande de CSS', '2ce91415-b3bb-404f-adec-bbc6ea5af464', 'in_progress', '1a5b817b-6b81-4a4d-9953-26707a54e0e9', '2020-01-05 15:08:20.139704+00');
INSERT INTO public.notebook_action (id, action, target_id, status, creator_id, created_at) VALUES ('9dec37fe-a454-4184-a8ee-ddd905d3f794', 'Prépa-Compétences', '0dac08fa-c103-438d-bf98-6b725a892e2d', 'in_progress', '1a5b817b-6b81-4a4d-9953-26707a54e0e9', '2020-09-01 15:11:37.55336+00');
INSERT INTO public.notebook_action (id, action, target_id, status, creator_id, created_at) VALUES ('67063818-486f-4f95-9beb-53a5a916e74b', 'Orientation vers une SIAE', '8445b9bc-e523-4ff3-91dd-fd11bb413ae5', 'in_progress', '1a5b817b-6b81-4a4d-9953-26707a54e0e9', '2020-11-01 13:40:07.137635+00');
INSERT INTO public.notebook_event (id, notebook_id, creation_date, event_date, professional_id, event, structure) VALUES ('5a20092b-06bb-4c2a-98cf-038c764184f8', '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d', '2021-09-21 19:02:17.79037+00', '2018-01-01', '1a5b817b-6b81-4a4d-9953-26707a54e0e9', 'Signature du PPAE', 'Pôle emploi');
INSERT INTO public.notebook_event (id, notebook_id, creation_date, event_date, professional_id, event, structure) VALUES ('cccc09e0-fe0d-40a3-a1cf-9c38c0f284e3', '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d', '2021-09-21 19:02:17.79037+00', '2018-01-15', '1a5b817b-6b81-4a4d-9953-26707a54e0e9', 'Ouverture des droits ARE', 'Pôle emploi');
INSERT INTO public.notebook_event (id, notebook_id, creation_date, event_date, professional_id, event, structure) VALUES ('28d757da-4530-450f-af32-03963ed65c78', '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d', '2021-09-21 19:02:17.79037+00', '2018-04-01', '1a5b817b-6b81-4a4d-9953-26707a54e0e9', 'Atelier - CV et Lettre de motivation', 'Pôle emploi');
INSERT INTO public.notebook_event (id, notebook_id, creation_date, event_date, professional_id, event, structure) VALUES ('d7ce47a0-8b2d-4c92-9c7b-367e4886d58c', '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d', '2021-09-21 19:02:17.79037+00', '2018-09-01', '1a5b817b-6b81-4a4d-9953-26707a54e0e9', 'Atelier - Découvrir son métier - SAP', 'Pôle emploi');
INSERT INTO public.notebook_event (id, notebook_id, creation_date, event_date, professional_id, event, structure) VALUES ('7f5fb8d7-6b0d-4799-a6d5-fc9139260111', '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d', '2021-09-21 19:02:17.79037+00', '2018-09-20', '1a5b817b-6b81-4a4d-9953-26707a54e0e9', 'Fin de droit ARE', 'Pôle emploi');
INSERT INTO public.notebook_event (id, notebook_id, creation_date, event_date, professional_id, event, structure) VALUES ('cde8ce81-9c9c-4618-bb35-f4b987bb5a0a', '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d', '2021-09-21 19:02:17.79037+00', '2018-10-20', '1a5b817b-6b81-4a4d-9953-26707a54e0e9', 'Fin de droit ASS', 'Pôle emploi');
INSERT INTO public.notebook_event (id, notebook_id, creation_date, event_date, professional_id, event, structure) VALUES ('4a51ff46-ac75-483e-87b3-d540b718c018', '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d', '2021-09-21 19:02:17.79037+00', '2019-11-15', '1a5b817b-6b81-4a4d-9953-26707a54e0e9', 'Ouverture des droits RSA', 'Caf');
INSERT INTO public.notebook_event (id, notebook_id, creation_date, event_date, professional_id, event, structure) VALUES ('e49c447a-1214-438c-bd19-46cf55cb1bba', '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d', '2021-09-21 19:02:17.79037+00', '2020-01-05', '1a5b817b-6b81-4a4d-9953-26707a54e0e9', 'Signature du CER 1', 'CCAS');
INSERT INTO public.notebook_event (id, notebook_id, creation_date, event_date, professional_id, event, structure) VALUES ('c1234b55-0b4c-4492-9ee2-da7f17bf6fda', '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d', '2021-09-21 19:02:17.79037+00', '2020-01-05', '1a5b817b-6b81-4a4d-9953-26707a54e0e9', 'Demande CSS', 'CCAS');
INSERT INTO public.notebook_event (id, notebook_id, creation_date, event_date, professional_id, event, structure) VALUES ('ba929ff6-30f3-450c-af89-1b8e7a437c1b', '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d', '2021-09-21 19:02:17.79037+00', '2020-04-05', '1a5b817b-6b81-4a4d-9953-26707a54e0e9', 'Enquète métier - Logistique', 'CCAS');
INSERT INTO public.notebook_event (id, notebook_id, creation_date, event_date, professional_id, event, structure) VALUES ('07132dae-006d-44f7-977b-c8b99fc4e5fb', '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d', '2021-09-21 19:02:17.79037+00', '2020-04-05', '1a5b817b-6b81-4a4d-9953-26707a54e0e9', 'Demande de logement social', 'CCAS');
INSERT INTO public.notebook_event (id, notebook_id, creation_date, event_date, professional_id, event, structure) VALUES ('f6e965b0-2c4c-4b35-9c9a-29c4005700bd', '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d', '2021-09-21 19:02:17.79037+00', '2020-07-01', '1a5b817b-6b81-4a4d-9953-26707a54e0e9', 'Signature du CER 2', 'CCAS');
INSERT INTO public.notebook_event (id, notebook_id, creation_date, event_date, professional_id, event, structure) VALUES ('77fb7aa9-292d-429e-a696-a8f61fd899e6', '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d', '2021-09-21 19:02:17.79037+00', '2020-07-01', '1a5b817b-6b81-4a4d-9953-26707a54e0e9', 'Demande SIAO', 'Service Social Départemental');
INSERT INTO public.notebook_event (id, notebook_id, creation_date, event_date, professional_id, event, structure) VALUES ('450a1a7d-c269-4749-a0c0-4189c0785ddb', '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d', '2021-09-21 19:02:17.79037+00', '2020-07-01', '1a5b817b-6b81-4a4d-9953-26707a54e0e9', 'Prépa-Compétence', 'Afpa');
INSERT INTO public.notebook_event (id, notebook_id, creation_date, event_date, professional_id, event, structure) VALUES ('678c1dd6-8dc3-42bf-aaca-a87e8a40c5b9', '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d', '2021-09-21 19:02:17.79037+00', '2020-11-01', '1a5b817b-6b81-4a4d-9953-26707a54e0e9', 'Candidature SIAE', 'ITOU');
INSERT INTO public.notebook_event (id, notebook_id, creation_date, event_date, professional_id, event, structure) VALUES ('6953e298-aa54-4e7d-8a01-b106530599a2', '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d', '2021-09-21 19:02:17.79037+00', '2021-05-01', '1a5b817b-6b81-4a4d-9953-26707a54e0e9', 'Pass IAE', 'Groupe NS');
INSERT INTO public.notebook_event (id, notebook_id, creation_date, event_date, professional_id, event, structure) VALUES ('c7f99bc3-a4a5-40b8-a666-a5044892f634', '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d', '2021-09-21 19:02:17.79037+00', '2021-07-01', '1a5b817b-6b81-4a4d-9953-26707a54e0e9', 'Entrée en formation', 'Groupe NS');
INSERT INTO public.notebook_event (id, notebook_id, creation_date, event_date, professional_id, event, structure) VALUES ('5782634c-eb5c-43ca-906c-a848a325864c', '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d', '2021-09-21 19:02:17.79037+00', '2021-09-15', '1a5b817b-6b81-4a4d-9953-26707a54e0e9', 'Bilan 3 mois IAE', 'Groupe NS');
INSERT INTO public.notebook_event (id, notebook_id, creation_date, event_date, professional_id, event, structure) VALUES ('13a8cf8b-9d9c-4821-9d9c-d2a24ed357e0', '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d', '2021-09-21 19:02:17.79037+00', '2021-09-20', '1a5b817b-6b81-4a4d-9953-26707a54e0e9', 'Accord SIAO - CHRS', 'Adoma');
INSERT INTO public.notebook_event (id, notebook_id, creation_date, event_date, professional_id, event, structure) VALUES ('de66b98d-cf1c-4427-8a98-80244a4edee3', '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d', '2021-09-21 19:02:17.79037+00', '2021-11-15', '1a5b817b-6b81-4a4d-9953-26707a54e0e9', 'Entrée en CHRS', 'Adoma');
INSERT INTO public.notebook_member (id, notebook_id, professional_id, last_visited_at, member_type, created_at, creator_id, invitation_sent_at) VALUES ('91dba199-109c-4312-93cb-bd99f579532b', '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d', '74323049-eae6-4ccd-b596-e95514a32781', NULL, '', '2021-09-21 12:32:59.911757+00', NULL, NULL);
INSERT INTO public.notebook_member (id, notebook_id, professional_id, last_visited_at, member_type, created_at, creator_id, invitation_sent_at) VALUES ('ea55bf8a-c0da-4c5f-b38c-66d57e3e18ba', '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d', 'a81bc81b-dead-4e5d-abff-90865d1e13b3', NULL, '', '2021-09-21 12:33:10.281341+00', NULL, NULL);
INSERT INTO public.notebook_member (id, notebook_id, professional_id, last_visited_at, member_type, created_at, creator_id, invitation_sent_at) VALUES ('14c147d0-f94b-4708-be90-0227efc70db7', '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d', '1a5b817b-6b81-4a4d-9953-26707a54e0e9', '2021-09-21 13:06:45.076+00', 'referent', '2021-09-21 11:51:37.295647+00', NULL, NULL);

INSERT INTO public.beneficiary (id, email, lastname, firstname, mobile_number, date_of_birth, deployment_id) VALUES ('f3e4dd0f-7746-44f6-a5f1-29059a88aa5a', 'marc@yahoo.fr', 'Marc', 'Saintpa', '0600000000', '1982-02-01', 'c5c3a933-6f4a-4b2b-aa49-7a816eaef16b');
INSERT INTO public.notebook (id, beneficiary_id, geographical_area, education_level, work_situation_date, contract_type, contract_sign_date, work_situation) VALUES ('b7e43c7c-7c3e-464b-80de-f4926d4bb1e0', 'f3e4dd0f-7746-44f6-a5f1-29059a88aa5a', 'between_10_20', 'level_3', '2021-09-22', 'cer', '2020-01-05', 'iae');
INSERT INTO public.wanted_job (rome_code_id, notebook_id) VALUES ((SELECT public.rome_code.id FROM public.rome_code WHERE label = 'Aide à domicile (K1304)'), 'b7e43c7c-7c3e-464b-80de-f4926d4bb1e0');
INSERT INTO public.notebook_member (id, notebook_id, professional_id, last_visited_at, member_type) VALUES ('cd17a20c-403c-4dba-9e5a-bc691dcd3735', 'b7e43c7c-7c3e-464b-80de-f4926d4bb1e0', '9b5f4863-dd2e-4680-af40-46258c457654', '2021-09-21 13:06:45.076+00', 'referent');

--
-- Situations (diagnostics)
--
INSERT INTO public.ref_situation (id, description, theme) VALUES ('dc5b03e6-14f4-4ded-9313-dcbbd6c7d88c', 'Sans hébergement', 'logement');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('1b770b5e-aa1a-4393-9a2e-d30dc4db4b80', 'CHRS', 'logement');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('4cd5ef49-8d0d-4a46-b6f1-21971ca5550f', 'Hôtel social', 'logement');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('eaadaacc-c255-4dfb-85aa-f242640e6489', 'Foyer d''urgence', 'logement');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('60bde280-f89f-470a-9f32-a9b1efb4f8ce', 'Appartement relais', 'logement');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('650450a8-3a65-4c70-84b2-ee173a29a57c', 'Bail glissant', 'logement');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('985b2296-ffa2-4f1a-8c87-3f0984a7456c', 'Chez un tiers', 'logement');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('ae29a2c3-6f7b-45bd-a2b6-884ec3724c18', 'Hébergé au domicile parental', 'logement');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('5505bbc9-924c-4169-b670-cf063d0f5a7b', 'Logement insalubre', 'logement');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('aae6e671-5f5f-4de4-92b4-1333e410c3b4', 'Expulsion en cours', 'logement');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('dffc61ff-46bf-424c-b86a-0b26bac5c7ec', 'Difficulté à payer le loyer', 'logement');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('383cf8a8-af59-4722-9516-69aa1a5a5dd1', 'Logement autonome', 'logement');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('86dcea99-3b79-4aa9-9ed0-5db31a4e0697', 'Foyer Jeune Travailleur', 'logement');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('d24fa6b4-370d-4a12-a8c5-2731c777980e', 'Hotel', 'logement');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('e6e44ec2-9d66-4a21-90fe-96e1b2dbe7fd', 'Structure d''hébergement d''urgence', 'logement');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('fd026d77-4a5e-442f-a537-9f8f97b4044d', 'ALTHO, HAPECH', 'logement');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('9d352758-5ccf-4448-8446-b2b363ec2100', 'Locataire parc social', 'logement');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('f476c407-c8f7-435f-ba3b-4b456eef22e2', 'Locataire bailleur privé', 'logement');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('65f60451-b26a-4af5-b5ae-1fcfe231c8a0', 'Logement de fortune', 'logement');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('4c605390-7056-4f22-bff0-1a9152b95bf1', 'Propriétaire', 'logement');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('d8970680-543a-42a2-bcb4-5a11805cd093', 'Locataire', 'logement');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('9ca549da-7f08-4b5e-a56e-b77dd4303b4f', 'Logement adapté', 'logement');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('0a148e18-8975-4532-8cda-783a7dbdfe23', 'Logement inadapté', 'logement');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('a3e4cbac-d564-4c8f-95fe-479a738007eb', 'Hébergement provisoire convenable', 'logement');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('8dba8e0e-dd00-4262-8553-e9fca5bfe5bd', 'Doit quitter le logement', 'logement');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('cc61a7b7-3540-4650-85ce-f026facda414', 'Éloigné de tout', 'logement');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('5efba991-9d43-4f8b-91c8-79d1f0b0ccdf', 'Autre', 'logement');

INSERT INTO public.ref_situation (id, description, theme) VALUES ('a6d95918-d6ef-4073-b466-8b7c39088e61', 'Difficultés financières', 'difficulte_financiere');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('25c0072c-dfcb-42a8-a83b-f85b19d7c680', 'Inadequation charge s/ ressources', 'difficulte_financiere');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('114203b8-3fc8-4ef5-9037-e8cb3d040863', 'Problème financiers ponctuels', 'difficulte_financiere');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('bd5bb087-08e6-4124-9a97-f5b28091b42e', 'Problème de gestion budgétaire', 'difficulte_financiere');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('c51e79bf-7967-4020-92e5-9212c74221e9', 'Baisse de ressources', 'difficulte_financiere');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('f16d5f29-5a6e-47df-8980-b685f45990ee', 'Resources précaires ou ponctuelle', 'difficulte_financiere');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('f41a2f7a-7562-4fa9-b896-a59493d660ed', 'Aucune ressource', 'difficulte_financiere');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('1a2445b1-3283-48b6-868d-6df97aedb1f1', 'Surrendettement', 'difficulte_financiere');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('52ea2b0d-2ad6-44de-9ab9-56f2611b0dd4', 'Rupture alimentaire', 'difficulte_financiere');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('87b21c91-3a4e-4904-bacb-c8d5f4f07cc6', 'Difficulté dans la gestion d''un budget', 'difficulte_financiere');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('6139a0c1-9e6e-44ce-b83b-964867761126', 'Manque d''autonomie et rencontrer de grandes difficultés sociales', 'difficulte_financiere');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('e544186a-2f01-40d7-b163-65b0a58afd1a', 'Difficultés budgétaires ne permettant pas de rétablir l''équilibre financier', 'difficulte_financiere');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('6e3073e5-011f-47c0-a99a-a31c2bdddec5', 'Difficulté budgétaire ne permettant pas l''accès à l''achat de denrées alimentaires', 'difficulte_financiere');

INSERT INTO public.ref_situation (id, description, theme) VALUES ('11d9ad29-8af7-4be1-88cd-ca8eae46f588', 'Pas de contrainte particulière', 'contraintes_familiales');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('a25a56c8-13f9-4e09-9227-d86d24f0dddd', 'Homme / Femme au foyer', 'contraintes_familiales');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('68527b66-d95f-4d9b-a7a4-dee08bdd2f47', 'Contraintes horaires', 'contraintes_familiales');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('73b2c7ad-842f-4055-ba11-b6687504004d', 'S''occuper d''un proche à temps plein', 'contraintes_familiales');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('19ec36b6-373d-4797-a905-3bdc20358ce2', 'Autres contraintes', 'contraintes_familiales');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('d54725e7-d3ca-4ee3-a263-8fbf0bff7786', 'Soutien familial', 'contraintes_familiales');

INSERT INTO public.ref_situation (id, description, theme) VALUES ('c3305ba0-3bf6-4c40-9b07-84fe6823806e', 'Absence de mode de garde entravant l''accès à l''emploi ou à un dispositif d''insertion sociale ou professionnelle', 'contraintes_familiales');

INSERT INTO public.ref_situation (id, description, theme) VALUES ('d91cd26a-0f24-46fa-bac8-9a1da170162f', 'Pas d''accès aux transports en commun', 'mobilite');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('044686d9-e0f0-48ed-afda-16e25d474ec0', 'Pas de permis valide', 'mobilite');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('cd80428e-3eb7-4025-acbc-c4c619c88841', 'Permis B mais sans véhicule', 'mobilite');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('38e14456-637e-4193-8ab2-68c3b27fd749', 'Mobile à vélo', 'mobilite');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('6e4acc44-3f5e-4b78-9af4-408bc2b7db64', 'Aucun moyen de transport à disposition', 'mobilite');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('4dc74421-9075-4ee1-b81b-2dd20225c292', 'Permis B', 'mobilite');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('82b0f66a-ab45-4278-94bc-53411e86f90b', 'Code', 'mobilite');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('d12e5dd5-66c6-46d3-a86f-43350065270f', 'Permis en cours', 'mobilite');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('973f40c2-6720-47d2-b9c9-8997eae72521', 'Autre Permis', 'mobilite');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('5a9d7636-80bf-418d-af47-ab8052fe8683', 'Pas de permis', 'mobilite');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('4d5c4bb6-d379-4672-af26-a1b75d266a41', 'Vélo', 'mobilite');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('482ca9b9-4f26-4dc8-ae2a-449e4e4ba40d', 'Transport en commun', 'mobilite');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('db07bffa-ff01-4518-b697-04d13400d46a', 'Voiture', 'mobilite');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('0d57ecf5-12a6-4762-b8ba-be4efd02db4b', 'Moto', 'mobilite');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('800be521-f2e4-4e47-8452-6c946b70c3a2', 'Autre', 'mobilite');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('652bbee9-f47b-44bf-ad4e-3762457c6157', 'Permis et voiture', 'mobilite');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('afd3e4b1-57c5-42ce-bbc0-264cc35f5ba5', 'Mobile à PLUS de 25 km', 'mobilite');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('91c1bb42-f9c7-47b9-a44e-6e187339ea5b', 'Mobile à MOINS de 25 km', 'mobilite');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('0e0177e1-510e-483e-b25e-5b35faeb309f', 'Permis mais pas de voiture', 'mobilite');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('2f77a4ed-ed19-486e-b846-caee9c054a61', 'moyen de transport', 'mobilite');

INSERT INTO public.ref_situation (id, description, theme) VALUES ('e4a5e5f4-d881-446f-8806-8b49fde9b022', 'Couverture sociale', 'sante');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('ac1d4ddd-6f16-4728-8d94-0bf9db088540', 'Prestation liée à la MDPH', 'sante');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('dfb67d09-a138-488e-8e34-ee9795819cdb', 'Pas de problème particulier', 'sante');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('562a13b0-b27d-44b4-a3bf-4019442d2dde', 'Juste quelques soucis de santé', 'sante');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('e291eb03-565d-4c59-bac5-91c1c4e70d2d', 'Ne peux plus exercer certains métiers', 'sante');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('61a829f9-36fe-49d5-86fd-61310c787328', 'Oui mais une activité adaptée', 'sante');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('ab79937a-297f-44f2-934d-dcfeb2261ba4', 'Oui mais doit souvent s''absenter', 'sante');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('5516000b-80b9-4be5-9869-7ad8f4f9dd04', 'Non ne peux pas reprendre une activité', 'sante');

INSERT INTO public.ref_situation (id, description, theme) VALUES ('cb9db2ff-4058-4fbe-b05d-e995719a1262', 'Pas de carte d''identifié', 'difficulte_administrative');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('1ad7d1cb-6021-4acd-8a8b-1cfb185604f3', 'Pas d''avis d''impot', 'difficulte_administrative');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('507c4642-a921-4372-a761-8eebffe19bf8', 'Pas de titre de séjour à jour', 'difficulte_administrative');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('5dc1c7ba-0e40-4442-ac7f-6d243c6d6c9c', 'Pas de sécurité sociale à jour', 'difficulte_administrative');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('58a677d0-26c6-4d36-8b3a-365eb0b55bab', 'Pas de CSS', 'difficulte_administrative');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('60883f02-8e1b-4942-8094-4433faac3172', 'Difficultés juridiques', 'difficulte_administrative');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('7ca798b9-6d29-435d-8113-541e5a42baa9', 'Accès au droit', 'difficulte_administrative');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('3517133e-71a9-4e21-a62c-9bf3eed9b342', 'Manque d''autonomie et rencontrer de grandes difficultés sociales', 'difficulte_administrative');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('47ad132e-8cfb-43bc-97f8-0aff163a7db3', 'Difficulté à effectuer une démarche administrative', 'difficulte_administrative');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('23bb6e7d-6d9c-475b-a531-80922000da30', 'Autonome mais nécessitant d''être guidé dans le cadre d''un accès aux droits', 'difficulte_administrative');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('35c8d4f3-8ef4-4d50-9be0-93a00788ce46', 'Difficulté à effectuer une démarche administrative dématérialisée', 'difficulte_administrative');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('3053d5a6-668c-4611-8aeb-cdf1e2afff14', 'Incapacité', 'difficulte_administrative');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('1c22ac4c-abec-4da4-8757-15691057a660', 'Indisponibilité liée à l''accompagnement d''une tierce personne', 'difficulte_administrative');

INSERT INTO public.ref_situation (id, description, theme) VALUES ('57741399-1f99-4bba-b56b-8cbf6a3c37f6', 'Difficultés liées à la pratique du français', 'maitrise_langue');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('956b2977-61d7-4594-b228-5a77474df09b', 'Interprétariat nécessaire', 'maitrise_langue');

INSERT INTO public.ref_situation (id, description, theme) VALUES ('50c826cd-76bc-488e-b9ab-5420ebc7af27', 'En construction de projet', 'emploi');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('24d2996d-f51d-4050-913e-f528c58bad1f', 'Inscrit à pôle emploi', 'emploi');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('586e8e25-322c-43b2-b523-89302a8255e8', 'Dernier emploi : moins de 3 mois', 'emploi');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('eb208350-ba7d-41de-8f86-3d3f001ed7bb', 'Dernier emploi : plus de 3 mois', 'emploi');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('b2529a0b-d31d-4c76-ab2b-94010d7ea15a', 'Dernier emploi : plus de 6 mois', 'emploi');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('9858f308-1cd4-4f37-862f-44b0b0c6f96f', 'Dernier emploi : plus d''un an', 'emploi');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('d7dea0f2-c5da-4a2b-8b18-4ef73967df4b', 'Dernier emploi : plus de 2 ans', 'emploi');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('642bbf71-c88b-4c07-baf3-db34cab86a68', 'Dernier emploi : plus de 5 ans', 'emploi');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('34cfb80f-60d6-46cc-af64-6af15d2882e8', 'Dernier emploi : jamais travaillé', 'emploi');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('fbf34e7e-a861-4d93-8095-60d791b222d9', 'Prêt à l''emploi : immédiatement', 'emploi');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('b9520607-af7d-43e3-a7dc-c74f7018b8e1', 'Prêt à l''emploi : a temps partiel', 'emploi');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('b031ae9b-e58c-42b8-b8e8-6e0b6fdffd22', 'Prêt à l''emploi : avec formations / accompagnement', 'emploi');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('d190c844-1d0d-4094-a1ec-8b0fe278cc37', 'Prêt à l''emploi : pas n''importe quel emploi', 'emploi');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('00a60709-ab4b-47ec-a964-a65958cb97b8', 'Prêt à l''emploi : pas pour l''instant', 'emploi');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('723c2908-859b-4070-b3a4-65b9d205a192', 'Prêt à l''emploi : ne sais pas', 'emploi');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('8b4ab582-421c-40ba-8f1f-206576184bd5', 'Prêt à suivre une formation', 'emploi');

INSERT INTO public.ref_situation (id, description, theme) VALUES ('75deb722-866b-4d7d-81c9-060f4fe3dcdd', 'Situation d''échec à l''issue d''un dispositif à vocation professionnelle', 'formation');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('8e217f12-4b94-46fa-9b03-67c4a9207d16', 'Manque de formation / qualification', 'formation');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('51e400a1-cfd4-447e-81c0-fb4b4f125084', 'Public de moins de 30 ans ayant un manque de formation/ de compétences ou d''expérience professionnelle', 'formation');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('e55791d7-48b8-45cc-9a9b-8d30a2a7da0d', 'Absence de maîtrise de la langue française', 'formation');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('427ea97b-829f-45b1-b92b-1e891f0abe84', 'Eloignement du service public pour l''emploi', 'formation');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('2ef74a52-296d-48be-bb24-7ecd8e875155', 'Manque d''intégration sociale lié à un mode de vie', 'formation');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('3e522a87-bbb1-457f-ae53-f107f2450338', 'Absence d''autonomie face aux démarches numériques', 'formation');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('a78862e3-0c5a-4912-8f82-100b1c4c82b6', 'Moins de 30 ans n''ayant accompli que le premier cycle de l''enseignement secondaire (3ème)', 'formation');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('a9b84a75-ff5c-4552-aeda-44eaa416fc61', 'Difficulté face à l''intégration du marché du travail du fait de difficultés sociales', 'formation');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('62a6ad83-5242-449b-ae49-89ed2d3b7536', 'Difficulté relative à la maîtrise du français, du numérique, ou à acquérir ou développer de nouvelles compétences', 'formation');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('8bcdae49-c9c4-40f6-8944-cbd8199f0ba3', 'Jeune de moins de 26 ans ayant des difficultés à intégrer des dispositifs de droit commun ou à travailler leur insertion', 'formation');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('fd46b393-5ef5-4703-9d2e-c4c04ab2cc16', 'Moins de 26 ans ayant un manque d''expérience professionnelle et/ou de confiance en soi', 'formation');
INSERT INTO public.ref_situation (id, description, theme) VALUES ('3c022046-4086-4ca7-8e6f-0c4a42c50bfd', 'Nécessité d''accèder à la formation comme préalable pour accèder à l''emploi durable', 'formation');

--
-- Objectifs
--
INSERT INTO public.ref_target (id, description, theme) VALUES ('ef8d2df3-9b04-435e-a26a-c532e17ae233', 'Recherche d''un logement', 'logement');
INSERT INTO public.ref_target (id, description, theme) VALUES ('fac56ab0-55b1-4829-af14-d3fcc0e44939', 'Se maintenir dans le logement suite à des impayés de loyers', 'logement');
INSERT INTO public.ref_target (id, description, theme) VALUES ('220d95af-5727-4476-b3d2-ecce2dabbd6a', 'Recherche de logement', 'logement');
INSERT INTO public.ref_target (id, description, theme) VALUES ('970a4ace-f987-40e6-909a-031023ffb549', 'Maintien dans le logement', 'logement');
INSERT INTO public.ref_target (id, description, theme) VALUES ('a2466e73-20fe-43d9-93b8-a67610f6bbc0', 'Accès au logement', 'logement');
INSERT INTO public.ref_target (id, description, theme) VALUES ('8f12b482-a14c-4e97-a8a0-6f82bf6132aa', 'Rupture ou risque de rupture Energie et fluides', 'logement');
INSERT INTO public.ref_target (id, description, theme) VALUES ('5ee87b0f-598e-4b27-98a8-544655b2184b', 'Rupture effective de logement', 'logement');
INSERT INTO public.ref_target (id, description, theme) VALUES ('514a6543-796d-4a73-9eb4-87630e837224', 'Habitat insalubre ou indécent (au sens du DALO)', 'logement');
INSERT INTO public.ref_target (id, description, theme) VALUES ('f67b2e71-7af5-470a-8092-db4ce0482419', 'Litige autour du bail (autre que dettes)', 'logement');
INSERT INTO public.ref_target (id, description, theme) VALUES ('3e731bed-31db-486c-9e08-d78de5b74b22', 'Hébergement', 'logement');
INSERT INTO public.ref_target (id, description, theme) VALUES ('1d88e08c-f142-4a88-8d7f-09abcc2ce7ff', 'Recherche d''hébergement', 'logement');
INSERT INTO public.ref_target (id, description, theme) VALUES ('a349a260-f397-41a8-bf8f-02a082d6f2fa', 'Maintient dans l''hébergement', 'logement');
INSERT INTO public.ref_target (id, description, theme) VALUES ('23f5446d-582e-43cd-98c6-74c22add9939', 'Rupture effective d''hébergement', 'logement');
INSERT INTO public.ref_target (id, description, theme) VALUES ('6005f48b-a1e0-4474-85c2-25738f54de3a', 'Hébergement insablubre ou indécent (au sens du DALO)', 'logement');
INSERT INTO public.ref_target (id, description, theme) VALUES ('cd13f5da-881f-4ddd-8b17-93d73a09d8aa', 'Accéder ou se maintenir dans un logement', 'logement');
INSERT INTO public.ref_target (id, description, theme) VALUES ('c2c52c80-45c0-40f8-8c29-7d6f47eba386', 'S''informer sur les démarches liées au logement (budget, état des lieux …)', 'logement');
INSERT INTO public.ref_target (id, description, theme) VALUES ('18b16189-d02b-44c8-8de5-ed590d2169c2', 'Trouver une solution d''hébergement', 'logement');
INSERT INTO public.ref_target (id, description, theme) VALUES ('699c1469-1bad-446b-893c-938f26a16f2f', 'Accèder au logement social', 'logement');
INSERT INTO public.ref_target (id, description, theme) VALUES ('412f52cb-ede3-42f4-83bf-78aef4381a25', 'Mise en œuvre des préconisations du chargé de mission logement ou travailleur social', 'logement');
INSERT INTO public.ref_target (id, description, theme) VALUES ('a7df14a3-8892-4ab9-a3c9-aeff04560b27', 'Favoriser l''accès au logement ou la résorption d''un impayé', 'logement');

INSERT INTO public.ref_target (id, description, theme) VALUES ('5560c147-af34-49d0-a8cb-a7027a341897', 'Résoudre les difficultés financières', 'difficulte_financiere');
INSERT INTO public.ref_target (id, description, theme) VALUES ('44f050d8-6bc9-4b1b-aac4-4c00565ce291', 'Acquérir des compétences techniques et administratives dans le but d''éviter l''aggravation de la situation financière', 'difficulte_financiere');
INSERT INTO public.ref_target (id, description, theme) VALUES ('88a99a80-b15f-4bb9-8d9e-bb8fe204fabd', 'Acquérir une autonomie sociale et budgétaire ou une mesure de protection', 'difficulte_financiere');

INSERT INTO public.ref_target (id, description, theme) VALUES ('43374be0-79a9-491d-a36c-96e811ee11cd', 'Recherche de mode de garde', 'contraintes_familiales');

INSERT INTO public.ref_target (id, description, theme) VALUES ('8ee41ac0-98ca-49df-b46e-abdc14e5f72e', 'Avoir accès aux transport en commun', 'mobilite');
INSERT INTO public.ref_target (id, description, theme) VALUES ('6bbb115f-cf97-4edb-b933-51ca85502ea6', 'Passer le permis B', 'mobilite');
INSERT INTO public.ref_target (id, description, theme) VALUES ('31f693f2-f09e-49f8-891e-8caba59a065e', 'Réparer sa voiture', 'mobilite');
INSERT INTO public.ref_target (id, description, theme) VALUES ('3802e199-e182-4b9c-84be-439ad7d52881', 'Accéder à une voiture', 'mobilite');
INSERT INTO public.ref_target (id, description, theme) VALUES ('66f8e403-92f8-4603-8c03-1b00d170da90', 'Accès à l''emploi - demande d''aide financière', 'mobilite');
INSERT INTO public.ref_target (id, description, theme) VALUES ('db140feb-f428-4334-a14d-21ce11c92a1c', 'Identification et appui dans la réalisation des démarches/Relais avec les partenaires/Mise en œuvre d''aides financières', 'mobilite');
INSERT INTO public.ref_target (id, description, theme) VALUES ('02d51e1f-6b96-4596-84ca-e00ee93d1cb6', 'Favoriser l''accès aux dispositifs d''insertion sociale ou professionnel', 'mobilite');
INSERT INTO public.ref_target (id, description, theme) VALUES ('cdf07cf9-3c04-401e-8340-bad8c2d76867', 'Bénéficier d''une aide financière pour le passage du permis de conduire ou achant de véhicule', 'mobilite');
INSERT INTO public.ref_target (id, description, theme) VALUES ('6da907b1-0099-4510-a331-2dbd1b45d982', 'Bénéficier d''un accompagnement permettant d''accèder à la mobilité', 'mobilite');
INSERT INTO public.ref_target (id, description, theme) VALUES ('fecf499e-43cb-441b-accf-5e70271aafd1', 'Bénéficier d''une aide financière pour le passage du permis de conduire', 'mobilite');
INSERT INTO public.ref_target (id, description, theme) VALUES ('196e99bf-e89e-4913-9320-0be34bac0c3a', 'Bénéficier d''un accompagnement pour le passage du code de la route', 'mobilite');
INSERT INTO public.ref_target (id, description, theme) VALUES ('ff5fd2b5-13b0-4052-9708-020db4b1cb9b', 'Favoriser l''accès aux dispositifs d''insertion sociale ou professionnelle', 'mobilite');
INSERT INTO public.ref_target (id, description, theme) VALUES ('4ce26c08-b18b-4665-9c9c-00be4341ac33', 'Acquérir les compétences garantissant la réussite au code et à l''examen de conduite', 'mobilite');

INSERT INTO public.ref_target (id, description, theme) VALUES ('0dad1367-09a6-45dd-8532-3519f262761c', 'Dossier MDPH', 'sante');
INSERT INTO public.ref_target (id, description, theme) VALUES ('3b79d39f-c91e-4574-94c8-732c11ac99fa', 'Accès à l''emploi ou à une formation', 'sante');
INSERT INTO public.ref_target (id, description, theme) VALUES ('212bbe63-13c2-4342-9608-3755db75db74', 'Obtention du statut d''Aidant Familial', 'sante');

INSERT INTO public.ref_target (id, description, theme) VALUES ('62c4ca9b-f71e-4bd5-9150-b4be820adf0d', 'Obtenir une domiciliation', 'difficulte_administrative');
INSERT INTO public.ref_target (id, description, theme) VALUES ('c452a1d4-04a8-45f0-b9a1-03a61429e760', 'Accés à une allocation de retour à l''emploi', 'difficulte_administrative');
INSERT INTO public.ref_target (id, description, theme) VALUES ('4203c74b-474f-4726-9fe3-cbbf0bb7ce0c', 'Démarches retraites', 'difficulte_administrative');
INSERT INTO public.ref_target (id, description, theme) VALUES ('a4253baf-5dbd-4ee6-a642-b4f9942d396e', 'Démarches pour percevoir une pension alimentaire', 'difficulte_administrative');
INSERT INTO public.ref_target (id, description, theme) VALUES ('b0d72a4f-b750-4df8-a6ea-1ea9c37bebaa', 'Aide juridictionnelle', 'difficulte_administrative');
INSERT INTO public.ref_target (id, description, theme) VALUES ('ea6f9928-b3fc-4b06-819d-e55491539d7e', 'Accés à la mobilité', 'difficulte_administrative');
INSERT INTO public.ref_target (id, description, theme) VALUES ('87cea1d8-44f3-4eb1-be05-4c64c4182605', 'Aide à l''obtention des justificatifs', 'difficulte_administrative');
INSERT INTO public.ref_target (id, description, theme) VALUES ('cffacf18-aef5-41aa-aca3-a55d9a800e42', 'Être accompagné dans les démarches d''accès au soin', 'difficulte_administrative');
INSERT INTO public.ref_target (id, description, theme) VALUES ('bb21edf2-b4c4-40f3-ba5d-1871eb6462ea', 'Prestation liées à la CAF', 'difficulte_administrative');
INSERT INTO public.ref_target (id, description, theme) VALUES ('eb4334d4-195f-4f71-a49d-0d3887071fa7', 'Titre de séjour et pièces d''identité, Etat civil', 'difficulte_administrative');
INSERT INTO public.ref_target (id, description, theme) VALUES ('ab9917c3-7206-4f02-a6dc-a599d9068b7d', 'Prestation liées à la Sécurité sociale', 'difficulte_administrative');
INSERT INTO public.ref_target (id, description, theme) VALUES ('25a861f6-9b88-41d8-86ec-7b99aad426fd', 'Prestations liées au RSA', 'difficulte_administrative');
INSERT INTO public.ref_target (id, description, theme) VALUES ('8351b86d-5b67-47b2-8a9d-fde57b3f23f2', 'Domicialiation', 'difficulte_administrative');
INSERT INTO public.ref_target (id, description, theme) VALUES ('0f7ec846-e947-463e-9b20-2aef71a38d69', 'Inscription scolaire et périscolaire, cantine', 'difficulte_administrative');
INSERT INTO public.ref_target (id, description, theme) VALUES ('a1e15c01-66f8-4567-9ec3-a377360d6313', 'Prestations liées aux ciasses de retraite, y compris complémentaires', 'difficulte_administrative');
INSERT INTO public.ref_target (id, description, theme) VALUES ('a47e5527-a44b-4703-ba91-956951a866de', 'Prestations liées à l''indemnisation du chômage (Pôle Emploi)', 'difficulte_administrative');
INSERT INTO public.ref_target (id, description, theme) VALUES ('bcc193b4-7827-4428-8bab-80dd73ffb0a0', 'Prestation liéées à l''ADPA', 'difficulte_administrative');
INSERT INTO public.ref_target (id, description, theme) VALUES ('7ffc854d-06df-42c1-9bfb-4c957b7bc995', 'Acquérir une autonomie sociale et budgétaire ou une mesure de protection', 'difficulte_administrative');
INSERT INTO public.ref_target (id, description, theme) VALUES ('34d54f69-7885-4285-a142-6270ceaa4e58', 'Accéder à un droit', 'difficulte_administrative');
INSERT INTO public.ref_target (id, description, theme) VALUES ('bac24c1e-7c36-43cd-b943-0689793f6b21', 'Mise en œuvre des préconisations du travailleur social', 'difficulte_administrative');
INSERT INTO public.ref_target (id, description, theme) VALUES ('12a24956-3fef-4ff3-bc30-17cee2961bf2', 'Accompagnement dans les démarches numériques', 'difficulte_administrative');
INSERT INTO public.ref_target (id, description, theme) VALUES ('8a4f5572-1eb4-408a-9988-7453e333ba4d', 'Rétablir la situation financière', 'difficulte_administrative');
INSERT INTO public.ref_target (id, description, theme) VALUES ('3dd305b1-3691-406b-b805-d0b7eba14884', 'Accéder à une aide alimentaire et un accompagnement', 'difficulte_administrative');
INSERT INTO public.ref_target (id, description, theme) VALUES ('2061bd40-a565-4465-a750-74e1a78b0523', 'Mise en place d''une mesure d''accompagnement adapté', 'difficulte_administrative');

INSERT INTO public.ref_target (id, description, theme) VALUES ('4384e35e-67b8-4e95-97e4-b787471ffc61', 'Acquérir les compétences langagières de base à une insertion', 'maitrise_langue');

INSERT INTO public.ref_target (id, description, theme) VALUES ('c29def79-c93f-4e0b-a980-5643e34d69b5', 'Définition d''un parcours de formation personnalisé', 'emploi');
INSERT INTO public.ref_target (id, description, theme) VALUES ('33cd9160-dd35-44c9-9f35-5b101c2a4fb2','Accéder à un emploi aidé', 'emploi');
INSERT INTO public.ref_target (id, description, theme) VALUES ('b4c2cbd8-5b72-4475-b48c-bf6162fe5863','Inscription à Pôle Emploi', 'emploi');
INSERT INTO public.ref_target (id, description, theme) VALUES ('36018796-1336-4c05-a8e7-57c08b0bb89f','Inscription et/ou CAP Emploi', 'emploi');
INSERT INTO public.ref_target (id, description, theme) VALUES ('1a6d6a1f-42c9-4bca-8ff2-00efd7e2d63d','Inscription sur actif51', 'emploi');
INSERT INTO public.ref_target (id, description, theme) VALUES ('32d53e4c-df03-4558-befd-c676e6d0cfb7','Inscription en agence d''intérim', 'emploi');
INSERT INTO public.ref_target (id, description, theme) VALUES ('184df103-bdf4-4332-a471-7ecbc50d5134','Inscription à l''agence Triangle', 'emploi');
INSERT INTO public.ref_target (id, description, theme) VALUES ('08a15f8d-10d6-4df7-997a-b78cd483b44a','Faciliter le développement et la viabilité économique de l''activité', 'emploi');
INSERT INTO public.ref_target (id, description, theme) VALUES ('ec0cfb4f-0261-4394-be7b-598b3eb334d0','Mise en œuvre des préconisations d''une structure d''accompagnement spécialisée de type ADIE, CCI..', 'emploi');
INSERT INTO public.ref_target (id, description, theme) VALUES ('79587006-03cc-4f48-8e25-79dbf7658572','Identifier ses freins liés à l''accès à l''emploi dans le domaine du sport et des loisirs. Définir et mettre en œuvre un plan d''action permettant de lever ces freins', 'emploi');
INSERT INTO public.ref_target (id, description, theme) VALUES ('bb9b5603-8cde-4b99-a8bc-477c53adee4a','Identifier ses atouts et ses freins dans la recherche d''emploi et définir une stratégie de recherche d''emploi en adéquation avec le marché du travail', 'emploi');
INSERT INTO public.ref_target (id, description, theme) VALUES ('8b65d7db-44d8-4ef6-8f55-d87cb10925de','Accèder rapidement à un emploi grâce à la mise en œuvre d''une stratégie de recherches d''emploi en adéquation avec le projet professionnel', 'emploi');
INSERT INTO public.ref_target (id, description, theme) VALUES ('5f65190b-f041-4fed-a367-6105283eec18','Acquérir les compétences langagières nécessaires à la reprise d''un emploi', 'emploi');
INSERT INTO public.ref_target (id, description, theme) VALUES ('71f9258d-ff58-44f2-adae-0dd29b79630d','Favoriser la mise en relation entre un candidat et un employeur en aidant les bénéficiaires à mieux cibler les emplois de proximité', 'emploi');
INSERT INTO public.ref_target (id, description, theme) VALUES ('390a2669-d088-4461-acfe-10d7d1acbf6f','Faciliter l''accès à l''emploi agricole', 'emploi');
INSERT INTO public.ref_target (id, description, theme) VALUES ('43e2e0cf-dbe7-4f8f-905b-b45c50e158ab','Incription HUMANDO / SUEZ Insertion/Partage Travail', 'emploi');
INSERT INTO public.ref_target (id, description, theme) VALUES ('006ddf26-6297-4f5f-a7a9-d1a6f4b0db4e','Faciliter l''accès aux vendanges', 'emploi');
INSERT INTO public.ref_target (id, description, theme) VALUES ('3603b764-bc68-4246-83cf-2f7e458d57be','Proposer un accompagnement conjoint par le conseiller de Pôle emploi et le chargé de mission RSA du Département, permettant de lever l''ensemble des freins et d''accèder à l''emploi', 'emploi');
INSERT INTO public.ref_target (id, description, theme) VALUES ('d74e85c2-8eae-45e6-9e99-36f9ab48e429','Accèder à une qualification en lien avec les métiers en tension (BTP, propreté, logistique, industrie,...)', 'emploi');
INSERT INTO public.ref_target (id, description, theme) VALUES ('fc958583-0c5c-493c-b9af-1f5ae1cc4e15','Etre accompagné pour redéfinir un projet professionnel / être accompagné pour développer et améliorer l''activité', 'emploi');
INSERT INTO public.ref_target (id, description, theme) VALUES ('c7b37d6f-570c-4429-a032-221a11cc16e9','Evaluer ses capacités de retour à l''emploi / évaluer une orientation ESAT sur demande de la MDPH ou en amont d''une demande MDPH / bénéficier d''un accompagnement adapté à la RQTH', 'emploi');
INSERT INTO public.ref_target (id, description, theme) VALUES ('0f4e35c5-9ebd-47f4-995d-fbe3b64dd9ea','Acquérir les compétences langagières de base à une insertion', 'emploi');
INSERT INTO public.ref_target (id, description, theme) VALUES ('baf90a4d-befa-4c7f-86c9-44ea77f0c5bd','Accompagnement pour un placement direct à l''emploi', 'emploi');
INSERT INTO public.ref_target (id, description, theme) VALUES ('28fb6022-a90d-45a9-9bcf-7763ec6f8213', 'Acceder à un CDDI', 'emploi');

INSERT INTO public.ref_target (id, description, theme) VALUES ('f929447e-53c7-4e57-88d1-9675aa0655f3', 'Mobiliser l''ensemble des partenaires du SPIE et de nouveaux dispositifs concourant au rebond de l''usager', 'formation');
INSERT INTO public.ref_target (id, description, theme) VALUES ('267fe2a8-90d5-44ca-b593-ca70fbb69c3d', 'Accéder à la formation', 'formation');
INSERT INTO public.ref_target (id, description, theme) VALUES ('7b1e1cca-9545-44f0-bd6c-0fb260d2155e', 'Acquérir des compétences en entreprise favorisant l''employabilité', 'formation');
INSERT INTO public.ref_target (id, description, theme) VALUES ('91b565e1-136b-4d35-a78f-07212d2600d6', 'Acquérir les compétences langagières de base à une insertion', 'formation');
INSERT INTO public.ref_target (id, description, theme) VALUES ('9b1dd154-4247-4bf0-a03c-96a7c4b0134b', 'Acquérir les fondamentaux permettant la construction d''un parcours d''insertion', 'formation');
INSERT INTO public.ref_target (id, description, theme) VALUES ('542614f6-99b3-43bb-a405-5049441d16a2', 'Accéder à la citoyenneté par une meilleure intégration sociale et culturelle', 'formation');
INSERT INTO public.ref_target (id, description, theme) VALUES ('c4dbf809-d95c-41c8-94f0-e068949e4c25', 'Acquérir les compétences de base numériques permettant l''accès aux droits et favorisant l''insertion', 'formation');
INSERT INTO public.ref_target (id, description, theme) VALUES ('393ca2c5-ea1e-4851-a9f9-1fd0868b4dcb', 'Elaborer un parcours pédagogique favorisant l''insertion professionnelle', 'formation');
INSERT INTO public.ref_target (id, description, theme) VALUES ('eee45521-ae7f-4532-93fa-eca40cc28c3a', 'Remobiliser les bénéficiaires du RSA dans un parcours d''insertion socio-professionnel', 'formation');
INSERT INTO public.ref_target (id, description, theme) VALUES ('9bd4081c-e705-49e5-aff8-1366f9c89cfb', 'Améliorer la connaissance des savoirs de base ou du potentiel de bénéficiaires du RSA', 'formation');
INSERT INTO public.ref_target (id, description, theme) VALUES ('2c8d79f1-e90e-419f-82d5-a55dbef56543', 'Accéder au parcours d''accompagnement proposé dans le cadre de la Garantie Jeunes', 'formation');
INSERT INTO public.ref_target (id, description, theme) VALUES ('1eb77933-bfc0-49bb-87b2-c87c863b30db', 'Accéder à un accompagnement', 'formation');
INSERT INTO public.ref_target (id, description, theme) VALUES ('6dd45ae0-e4d5-4253-a7c8-d4d98e41d895', 'Acquérir et/ou développer des compétences et de l''expérience au travers d''une intégration au sein d''un collectif et d''une mission spécifique confiée aux jeunes', 'formation');
INSERT INTO public.ref_target (id, description, theme) VALUES ('a6f61400-03e8-4bf0-aef8-b7e0b37eded2', 'Définition d''un parcours de formation personnalisé', 'formation');

--
-- Actions
--
INSERT INTO public.ref_action (id, description, theme) VALUES ('ada5be15-c4e5-4e71-889b-de4f1e22b838', 'Demande SIAO', 'logement');
INSERT INTO public.ref_action (id, description, theme) VALUES ('d49bb66f-370d-4635-8001-cff8b5eaf78d', 'Demande de logement social', 'logement');
INSERT INTO public.ref_action (id, description, theme) VALUES ('6b4f47f8-04aa-493d-accd-9ebdf2dbaa10', 'Demande DALO - Démarche de relogement suite à une problématique d''insalubrité', 'logement');
INSERT INTO public.ref_action (id, description, theme) VALUES ('97485869-a061-4462-80da-d41fd4fcc655', 'Demande Fonds Solidarité Energie', 'logement');
INSERT INTO public.ref_action (id, description, theme) VALUES ('7542b8eb-d5b9-4fc0-802e-f7e46ed53e5e', 'Demande Fonds Solidarité Logement', 'logement');

INSERT INTO public.ref_action (id, description, theme) VALUES ('f4b468b8-b3c1-4460-9063-31b5868aeea4', 'Aide à la constitution du dossier de surendettement', 'difficulte_financiere');
INSERT INTO public.ref_action (id, description, theme) VALUES ('bd46e79b-04da-4d7a-8f9c-6bee881846fb', 'Médiation avec les institutions', 'difficulte_financiere');
INSERT INTO public.ref_action (id, description, theme) VALUES ('5309db9c-0aaa-414f-8109-21c5ae24fca6', 'Aide à la négociation ou renégociation de prêt', 'difficulte_financiere');
INSERT INTO public.ref_action (id, description, theme) VALUES ('7168af78-90cf-4d85-a707-99f29c1227e0', 'Aide et accompagnement à la résolution des dettes diverses', 'difficulte_financiere');
INSERT INTO public.ref_action (id, description, theme) VALUES ('66c343fa-18aa-4065-aa42-5cfe20737582', 'Aide éducative budgétaire', 'difficulte_financiere');
INSERT INTO public.ref_action (id, description, theme) VALUES ('008e93da-2184-4579-907f-2301bff6b36f', 'Aide difficultés financières', 'difficulte_financiere');
INSERT INTO public.ref_action (id, description, theme) VALUES ('2d91d89d-c59b-418c-ae6f-dbb8c50170ac', 'Dossier surendettement', 'difficulte_financiere');
INSERT INTO public.ref_action (id, description, theme) VALUES ('b2687b73-1e99-4233-bb75-c5fcf2bc38e5', 'Dossier de retraite', 'difficulte_financiere');
INSERT INTO public.ref_action (id, description, theme) VALUES ('90e3ac4e-4d38-4a20-b6ae-321a9cd7a42f', 'Fiche contact CNAV', 'difficulte_financiere');
INSERT INTO public.ref_action (id, description, theme) VALUES ('83178c29-9633-419a-9c69-548da8eba24f', 'FAG', 'difficulte_financiere');
INSERT INTO public.ref_action (id, description, theme) VALUES ('d6065cbb-5977-4d50-a29b-0848ac83548a', 'FAJ', 'difficulte_financiere');
INSERT INTO public.ref_action (id, description, theme) VALUES ('ceb56606-d342-4206-b433-6dafbc35eed8', 'APA', 'difficulte_financiere');
INSERT INTO public.ref_action (id, description, theme) VALUES ('c373cc7f-125a-4a30-be55-28b53af29816', 'CCAS', 'difficulte_financiere');
INSERT INTO public.ref_action (id, description, theme) VALUES ('8a6d0fb3-47ff-4825-8a92-25804a7c1347', 'Démarches mobilisant le Fond de Solidarité Energie', 'difficulte_financiere');
INSERT INTO public.ref_action (id, description, theme) VALUES ('5ebb8c09-2801-4ab9-b06d-70878af6ce7c', 'Aide et accompagnement à la résolution des dettes diverses(FSL, dettes d''accés à la propriété etc..)', 'difficulte_financiere');
INSERT INTO public.ref_action (id, description, theme) VALUES ('13c7ca06-e2be-4eb0-81c0-ae895cde747c', 'L''accompagnement budgétaire', 'difficulte_financiere');
INSERT INTO public.ref_action (id, description, theme) VALUES ('80db42bc-a66f-4e33-a48d-5a4266fb9923', 'L''accompagnement social personnalisé', 'difficulte_financiere');

INSERT INTO public.ref_action (id, description, theme) VALUES ('24cd1b52-6c7f-408e-b33d-9626094229e8', 'Accès à un mode de garde', 'contraintes_familiales');

INSERT INTO public.ref_action (id, description, theme) VALUES ('1ef3dacd-6d4e-4f44-827e-02d5934b688a', 'Demander l''Aide à la mobilité', 'mobilite');
INSERT INTO public.ref_action (id, description, theme) VALUES ('dc3e774a-54f8-4167-97de-0121ee1d44ee', 'Demander des Chèques mobilité', 'mobilite');
INSERT INTO public.ref_action (id, description, theme) VALUES ('b6d9ca30-698c-44c2-98c0-b5d51ae9aeda', 'Inscrire en auto-école', 'mobilite');
INSERT INTO public.ref_action (id, description, theme) VALUES ('dddf2eca-dd6f-41f3-87b9-c63b0b9a9080', 'Demander l''Aide à la mobilité', 'mobilite');
INSERT INTO public.ref_action (id, description, theme) VALUES ('3280109d-37dc-40c8-af2d-51505264adea', 'Mise à disposition de voiture', 'mobilite');
INSERT INTO public.ref_action (id, description, theme) VALUES ('d7fba25c-d7b1-4c6a-b0ae-600bbca1d3ad', 'Co-voiturage', 'mobilite');
INSERT INTO public.ref_action (id, description, theme) VALUES ('da7fd68a-15c8-473b-8e2b-37319b77be64', 'Coordonnatrice de Levée des Freins Périphériques', 'mobilite');
INSERT INTO public.ref_action (id, description, theme) VALUES ('fe6d74a5-cab5-443f-ab8e-2dcda67f0bc1', 'La navette insertion', 'mobilite');
INSERT INTO public.ref_action (id, description, theme) VALUES ('17b0876e-695e-47f3-ab7c-f5133ba2ebbf', 'aide à la mobilité du CCAS', 'mobilite');
INSERT INTO public.ref_action (id, description, theme) VALUES ('c695d379-d2f4-436f-a811-aa38f757184b', 'Conseiller en mobilité inclusive', 'mobilite');
INSERT INTO public.ref_action (id, description, theme) VALUES ('cb6a43c6-6d70-40a3-aa8b-8897edf85fc3', 'Bourse au permis', 'mobilite');
INSERT INTO public.ref_action (id, description, theme) VALUES ('5e04f3bd-1ed1-4400-bf81-05619bd30db0', 'Préparation au code', 'mobilite');
INSERT INTO public.ref_action (id, description, theme) VALUES ('0dda74e1-f1f1-45da-aaaa-67753c7d9542', 'Location /Achat véhicule', 'mobilite');
INSERT INTO public.ref_action (id, description, theme) VALUES ('6339c966-d7e4-4338-a3b4-ceb496f25daf', 'Passage du permis B (code et conduite)', 'mobilite');
INSERT INTO public.ref_action (id, description, theme) VALUES ('43021bf4-61ac-4df6-a859-1f7681c665ee', 'DAF sur chéquier mobilité - IDF', 'mobilite');
INSERT INTO public.ref_action (id, description, theme) VALUES ('1fec8234-acec-4a4f-a4ab-7b6d2c182cf4', 'Accès à l''emploi - info et conseil sur les offres', 'mobilite');

INSERT INTO public.ref_action (id, description, theme) VALUES ('b7382170-09ae-498b-9cfe-4df8dfe7cb1c', 'Acc. à la reconnaissance du statut aidant familial', 'sante');
INSERT INTO public.ref_action (id, description, theme) VALUES ('e5032cef-2d1c-4039-b57e-21c074c52a6c', 'Accompagnement à l''emploi de la pers. handicapée', 'sante');

INSERT INTO public.ref_action (id, description, theme) VALUES ('875e91a6-d1b8-46af-aca8-25bb1521fda4', 'Cerfa - Demande de domiciliation', 'difficulte_administrative');
INSERT INTO public.ref_action (id, description, theme) VALUES ('82b782b2-3497-4e0d-9901-a1a3e46c2683', 'Déclaration trimestrielle des revenues', 'difficulte_administrative');
INSERT INTO public.ref_action (id, description, theme) VALUES ('fc4b1e82-73f8-49db-b97e-e81bae7dde1e', 'Déclaration de situation', 'difficulte_administrative');
INSERT INTO public.ref_action (id, description, theme) VALUES ('122a868c-4a63-4707-a176-ef4818d741fc', 'Demande de CSS', 'difficulte_administrative');

INSERT INTO public.ref_action (id, description, theme) VALUES ('a25eec0d-3576-4c42-863e-2b4392aff1e8', 'Protocole CAF - Suspension AL / APL', 'difficulte_administrative');
INSERT INTO public.ref_action (id, description, theme) VALUES ('1499f0e3-faa7-4e11-b96c-a861d5692366', 'Dossier Caf', 'difficulte_administrative');
INSERT INTO public.ref_action (id, description, theme) VALUES ('f641edd1-b221-477e-a23a-185645120555', 'Dossier préfecture', 'difficulte_administrative');
INSERT INTO public.ref_action (id, description, theme) VALUES ('3c6159c8-6983-43c1-8afe-9131fd245cbf', 'Sécurité sociale et mutuelle', 'difficulte_administrative');
INSERT INTO public.ref_action (id, description, theme) VALUES ('f50320b3-4a7b-49b1-a911-86316a4c727d', 'Caisse de retraite et complémentaires', 'difficulte_administrative');
INSERT INTO public.ref_action (id, description, theme) VALUES ('327777be-ac76-4bef-aaa9-260a6446b686', 'Dossier accès aux droits à la santé (Puma, MAE, ACS)', 'difficulte_administrative');
INSERT INTO public.ref_action (id, description, theme) VALUES ('9f78d122-f57e-4d26-aebe-1cb8fcbe22e6', 'Dossier ADPA', 'difficulte_administrative');
INSERT INTO public.ref_action (id, description, theme) VALUES ('25c581cc-066d-4496-a9d4-0fb42eef4c57', 'Dossier Pole emploi', 'difficulte_administrative');
INSERT INTO public.ref_action (id, description, theme) VALUES ('b30b20ee-e667-4767-bb9e-1989c29d523d', 'CAF', 'difficulte_administrative');
INSERT INTO public.ref_action (id, description, theme) VALUES ('394baa58-02f3-4079-bf57-d22c6702fa56', 'Aide au montage de dossiers administratifs', 'difficulte_administrative');
INSERT INTO public.ref_action (id, description, theme) VALUES ('3ffb6757-2b03-41a4-a9ed-05a10f8c8fdb', 'Dossier procédure judiciaire', 'difficulte_administrative');
INSERT INTO public.ref_action (id, description, theme) VALUES ('0617537e-9010-4674-bf2b-3d8a0abd1574', 'L''accompagnement social personnalisé', 'difficulte_administrative');
INSERT INTO public.ref_action (id, description, theme) VALUES ('3ab9d24d-11e8-4c69-a0f9-f1f0eabe145a', 'L''accompagnement par les travailleurs sociaux en matière d''accès au droit', 'difficulte_administrative');
INSERT INTO public.ref_action (id, description, theme) VALUES ('d4c1f401-3b27-4be3-84e5-846722f89b15', 'Réalisation autonome des démarches liées à l''accès aux droits', 'difficulte_administrative');
INSERT INTO public.ref_action (id, description, theme) VALUES ('bb970b85-81d1-4ec4-9e39-e47e6ae6c95d', 'Ecrivain Public Numérique', 'difficulte_administrative');
INSERT INTO public.ref_action (id, description, theme) VALUES ('7350cd30-29fa-4f81-a9b6-c512e4aefc03', 'Accompagnement à la constitution d''un dossier de surendettement', 'difficulte_administrative');
INSERT INTO public.ref_action (id, description, theme) VALUES ('2a60e96d-6a88-4ac1-bf55-2ec89bebbfdf', 'Les aides des épiceries sociales', 'difficulte_administrative');
INSERT INTO public.ref_action (id, description, theme) VALUES ('29b1dc38-c57f-4128-a16b-f9d7568faf40', 'Mesures de protection administratives ou judiciaires (MASP, tutelle, curatelle, sauvegarde de justice,...)', 'difficulte_administrative');
INSERT INTO public.ref_action (id, description, theme) VALUES ('e90bb402-26a7-4e09-b0b1-8ba620f43e30', 'APA, PCH,…', 'difficulte_administrative');
INSERT INTO public.ref_action (id, description, theme) VALUES ('0b4fa973-a6a6-4682-b51d-1fe807403851', 'Démarches retraites', 'difficulte_administrative');
INSERT INTO public.ref_action (id, description, theme) VALUES ('fb85e8ca-cc4c-4634-85b2-927e1f4603d1', 'Accés à une allocation de retour à l''emploi', 'difficulte_administrative');
INSERT INTO public.ref_action (id, description, theme) VALUES ('e5de394c-887b-4fee-8034-ef29ba7ce0d1', 'Démarches pour percevoir une pension alimentaire', 'difficulte_administrative');
INSERT INTO public.ref_action (id, description, theme) VALUES ('24973c04-0331-4016-b1dc-3b60f4020b25', 'Aide juridictionnelle', 'difficulte_administrative');
INSERT INTO public.ref_action (id, description, theme) VALUES ('3a02069e-7d8c-4840-a751-ea399901c3b2', 'Accés à la mobilité', 'difficulte_administrative');
INSERT INTO public.ref_action (id, description, theme) VALUES ('24853bb8-5db7-4ce5-a212-b83aea1fa691', 'Domiciliation', 'difficulte_administrative');

INSERT INTO public.ref_action (id, description, theme) VALUES ('46bf6357-ad37-48c3-8041-d679b494d855', 'Ateliers socio-linguistiques Maison de quartier', 'maitrise_langue');
INSERT INTO public.ref_action (id, description, theme) VALUES ('2617bb27-183c-4947-a33e-cdf6b9872d93', 'Parcours langue', 'maitrise_langue');
INSERT INTO public.ref_action (id, description, theme) VALUES ('f5381fe5-39fc-44bc-b9bb-3a9ab56cc9cc', 'FLE', 'maitrise_langue');
INSERT INTO public.ref_action (id, description, theme) VALUES ('e39d8cc9-05be-4500-8c01-4cc0e6d21190', 'Alphabétisation', 'maitrise_langue');

INSERT INTO public.ref_action (id, description, theme) VALUES ('4fe62d1b-3c11-4aaa-956f-d5cf578a46f3', 'Orientation vers une SIAE', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES ('a33ff64b-14dc-4126-9ae1-6f80784e8281', 'Avoir un pass IAE validé', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES ('cd673496-aa4c-4047-a752-9451e380d3e5', 'Prépa-Compétences', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES ('fe5cd003-44a8-4478-9e85-67f6fd2c4ef2', 'Orientation vers un Chantier d''insertion (ACI)', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES ('4cc204b5-c62e-4751-be39-d84b24a30da6', 'CEC/CIE', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES ('2eb6b98c-4a1c-424f-8735-5c34da513d99', 'Pôle Emploi', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES ('22481513-ad6f-46c5-b98a-aba0d5436851', 'CAP Emploi', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES ('3bfa946f-e599-4d03-87c2-af21cd1eb386', 'PAUPA', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES ('b803541f-f51f-4109-acb9-9b65fc52e638', 'Inscription Interim', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES ('8e1d60ca-a569-4767-857e-7a6059e493ce', 'Partenariat intérim', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES ('79d8aa47-df3f-4306-b93c-9af59e706146', 'Accompagnement des TNS', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES ('c95a1b9a-0a33-4c7d-a6bd-cd8c38de7982', 'Suites accompagnement spécialisé TNS', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES ('c3358e79-83d3-472d-ba8f-f331d6a96694', 'Coaching Sport et Loisirs', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES ('40d72ef2-5fd9-4d29-898f-7cd322a82f1c', 'Coaching', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES ('9541dc3b-7258-42e6-9501-2e8c4a869f48', 'Coaching dipômés', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES ('f6a7c652-1a77-4123-88d3-8e1fff4f5aa1', 'Coaching intensif', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES ('b4d4a2f7-949f-4bf9-ba09-718af0568b46', 'Espace Linguistique Pro (ELP)', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES ('e91186cd-62e9-49ed-8a90-22b96106b7eb', 'PLATEFORME actif51', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES ('104b34a6-c436-429b-8b69-2c9903e54350', 'Partenariat Chambre de l''agriculture', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES ('e031d475-4693-44ec-b2a1-0bf24e2c749a', 'Orientation vers AI/ETTI', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES ('3d5adb01-ea84-4714-9d8e-52edcf5c9912', 'RSA et Vendanges en Champagne', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES ('c1ad2aaa-e3d4-446f-a21b-28660b60ac1e', 'Accompagnement global', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES ('b8cec9e4-615e-4829-8dbd-d4ebb970ef61', 'Shaker', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES ('a2247a3b-8418-4ba2-9290-2ffc9ae5ef9d', 'REAGIR', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES ('b0128eb8-b260-449b-904a-e29deb950bc1', 'Permanence du Jard', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES ('121bf573-875e-4d86-9882-6f95a8f1e07d', 'Prestation Pole emploi', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES ('576a3e43-05f2-4cc8-81ec-18aee1ab9521', 'Projet de ville', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES ('103a608c-a97b-4ff9-b9ce-ee49bbb28a68', 'Appuie à la création d''entreprise', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES ('cc01790e-5afc-4af4-880f-e5ee11ba186c', 'Autre', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES ('7245ae33-f3b2-4dc3-8875-d4b3aefe28e9', 'PLIE', 'emploi');

INSERT INTO public.ref_action (id, description, theme) VALUES ('208bccb9-161c-411e-804b-9c364d617127', 'Comité Rebond', 'formation');
INSERT INTO public.ref_action (id, description, theme) VALUES ('1f73183c-f4a6-44b7-a006-2519c84e7d63', 'Recherche de formation', 'formation');
INSERT INTO public.ref_action (id, description, theme) VALUES ('febaa01d-cca2-4c84-88b2-581661e5de4f', 'Parcours d''Acquisition des Compétences en Entreprise (PACE)', 'formation');
INSERT INTO public.ref_action (id, description, theme) VALUES ('4c330b00-01d3-4e00-b29c-770b4a98b78f', 'Parcours langue', 'formation');
INSERT INTO public.ref_action (id, description, theme) VALUES ('16a3441d-ab40-4bf0-9458-669b4a65c82c', 'Activ''compétences', 'formation');
INSERT INTO public.ref_action (id, description, theme) VALUES ('42a8bf24-bee5-4f8b-835f-218adc5caeac', 'Itinéraire Bis', 'formation');
INSERT INTO public.ref_action (id, description, theme) VALUES ('1bba0fcf-86c7-4922-9823-32cca73ae2f4', 'Atelier d''initiation aux savoirs de base numériques', 'formation');
INSERT INTO public.ref_action (id, description, theme) VALUES ('c6cd152c-6660-40a8-9082-35947871e432', 'Ecole de la 2ème chance', 'formation');
INSERT INTO public.ref_action (id, description, theme) VALUES ('3b862ae6-fe2d-40d4-8fab-b9d3e33ba3e9', 'Ateliers d''intégration à visée professionnelle', 'formation');
INSERT INTO public.ref_action (id, description, theme) VALUES ('326bb1ad-0a9e-432d-a7b1-61e7569fcf9a', 'Diagnostics individuels approfondis (DIA)', 'formation');
INSERT INTO public.ref_action (id, description, theme) VALUES ('51497cc8-6346-4092-9e93-bb1352c44999', 'Le Partenariat Garantie Jeunes (expérimental)', 'formation');
INSERT INTO public.ref_action (id, description, theme) VALUES ('0bb33313-1bbb-46be-b46d-c0cff1d6fbed', 'Service Militaire Volontaire', 'formation');
INSERT INTO public.ref_action (id, description, theme) VALUES ('9ed1c14a-4169-4f27-afdc-af7323f6619b', 'Accompagnement MILO', 'formation');
INSERT INTO public.ref_action (id, description, theme) VALUES ('9bf4caf7-cac3-46e3-a458-3f0f1eaf2dcd', 'Le Service civique', 'formation');
INSERT INTO public.ref_action (id, description, theme) VALUES ('2da56406-c863-4151-8bf5-1ba142930a12', 'Ateliers socio-linguistiques Maison de quartier', 'formation');
INSERT INTO public.ref_action (id, description, theme) VALUES ('5d5acc90-7197-42d5-8d21-bea34c43f98b', 'Prépa compétences', 'formation');
INSERT INTO public.ref_action (id, description, theme) VALUES ('ba55bd26-c6f4-4046-bec0-b71855c68bfd', 'Appui social individualisé', 'formation');
INSERT INTO public.ref_action (id, description, theme) VALUES ('aa582537-20ee-4806-aad8-da54e7e3d774', 'Action de redynamisation', 'formation');
INSERT INTO public.ref_action (id, description, theme) VALUES ('5085ac09-f5c0-4a06-ba10-d2dfc536dc81', 'Formation diplômante', 'formation');
INSERT INTO public.ref_action (id, description, theme) VALUES ('0565f980-18cc-49e1-ac88-837c190e2f4b', 'Formation qualifiante', 'formation');
INSERT INTO public.ref_action (id, description, theme) VALUES ('ab83da69-8f97-41d4-ab43-4446c09c08a5', 'Formation pré qualifiante', 'formation');
INSERT INTO public.ref_action (id, description, theme) VALUES ('28bd809d-8982-4d83-9d43-99b7d92f8826', 'Linguistique : FLE', 'formation');
INSERT INTO public.ref_action (id, description, theme) VALUES ('f074c50b-d5f5-4e4c-8c3d-02e70e7c3dad', 'Linguistique : Alphabétisation', 'formation');
