UPDATE "public"."ref_action" SET  theme= 'mobilite' where description='Constitution d’une demande d''aide financière pour l’achat d’un véhicule';
UPDATE "public"."ref_action" SET (description,theme)= ('Réalisation d''une demande de mesure de protection administrative ou juridique','sante') where description='Réalisation d''une demande de mesure de protection administrative ou juridique"';
UPDATE "public"."ref_target" SET description = 'Accéder à des services en ligne' WHERE theme='numerique' AND description='Accéder a des service en ligne';
