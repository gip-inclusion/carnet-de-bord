alter table "public"."professional_project" add column "hourly_rate" integer null;
comment on column "public"."professional_project"."hourly_rate" is E'in cents (divide by 100 for the EUR value)';

CREATE TABLE "public"."contract_type" (
  "id" text NOT NULL,
  "label" text not null,
  PRIMARY KEY ("id")
);

INSERT INTO "public"."contract_type"("id", "label") VALUES (E'cdi', E'CDI');
INSERT INTO "public"."contract_type"("id", "label") VALUES (E'cdd', E'CDD');
INSERT INTO "public"."contract_type"("id", "label") VALUES (E'interim', E'Interim');
INSERT INTO "public"."contract_type"("id", "label") VALUES (E'saisonnier', E'Saisonnier');
INSERT INTO "public"."contract_type"("id", "label") VALUES (E'liberal', E'Libéral');
INSERT INTO "public"."contract_type"("id", "label") VALUES (E'contrat_professionnalisation', E'Contrat de professionnalisation');
INSERT INTO "public"."contract_type"("id", "label") VALUES (E'apprentissage', E'Apprentissage');
INSERT INTO "public"."contract_type"("id", "label") VALUES (E'portage_salarial', E'Portage salarial');

CREATE TABLE "public"."employment_type" (
  "id" text NOT NULL,
  "label" text NOT NULL,
  PRIMARY KEY ("id")
);

INSERT INTO "public"."employment_type"("id", "label") VALUES (E'full_time', E'Temps plein');
INSERT INTO "public"."employment_type"("id", "label") VALUES (E'part_time', E'Temps partiel');

alter table "public"."professional_project" add column "contract_type_id" text null;
alter table "public"."professional_project" add column "employment_type_id" text null;

alter table "public"."professional_project"
  add constraint "professional_project_contract_type_id_fkey"
  foreign key ("contract_type_id")
  references "public"."contract_type"
  ("id") on update restrict on delete restrict;

alter table "public"."professional_project"
  add constraint "professional_project_employment_type_id_fkey"
  foreign key ("employment_type_id")
  references "public"."employment_type"
  ("id") on update restrict on delete restrict;
