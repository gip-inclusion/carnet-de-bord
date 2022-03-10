

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
DROP FUNCTION IF EXISTS public.search_rome_codes;

ALTER TABLE rome_code RENAME TO rome_codes;

CREATE OR REPLACE FUNCTION public.search_rome_codes(search text)
 RETURNS SETOF rome_codes
 LANGUAGE sql
 STABLE
AS $function$
  SELECT *
  FROM rome_codes
  WHERE
    unaccent(search) <% label
  ORDER BY unaccent(search) <<-> label ASC
$function$;
