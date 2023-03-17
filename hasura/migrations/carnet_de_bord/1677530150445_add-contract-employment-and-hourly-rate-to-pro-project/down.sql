alter table "public"."professional_project" drop constraint "professional_project_employment_type_id_fkey";
alter table "public"."professional_project" drop constraint "professional_project_contract_type_id_fkey";

alter table "public"."professional_project" drop column "hourly_rate";
alter table "public"."professional_project" drop column "employment_type_id";
alter table "public"."professional_project" drop column "contract_type_id";

DROP TABLE "public"."employment_type";
DROP TABLE "public"."contract_type";
