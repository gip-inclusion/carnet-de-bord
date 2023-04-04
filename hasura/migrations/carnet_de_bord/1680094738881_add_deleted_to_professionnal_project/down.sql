
alter table "public"."professional_project" drop constraint "professional_project_created_by_fkey";
alter table "public"."professional_project" drop constraint "professional_project_updated_by_fkey";

alter table "public"."professional_project" drop column "created_by";
alter table "public"."professional_project" drop column "updated_by";
