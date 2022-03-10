

alter table "public"."notebook" alter column "job" drop not null;
alter table "public"."notebook" add column "job" varchar;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- INSERT INTO wanted_job (notebook_id, rome_code_id)
-- SELECT nb.id nbid, rc.id rcid
-- FROM notebook nb
-- LEFT JOIN rome_code rc ON nb.job = rc.label;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- INSERT INTO wanted_job (notebook_id, rome_code_id)
-- SELECT nb.id nbid, rc.id rcid
-- FROM notebook nb
-- LEFT JOIN rome_code rc ON nb.job = rc.label;

DROP TABLE "public"."wanted_job";

DROP FUNCTION IF EXISTS public.search_rome_codes; 

alter table "public"."rome_code" drop constraint "rome_code_label_key";

DROP TABLE "public"."rome_code";
