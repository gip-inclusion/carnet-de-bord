ALTER TABLE rome_codes RENAME TO rome_code;

CREATE TABLE "public"."wanted_job" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "notebook_id" UUID NOT NULL, "rome_code_id" UUID NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("notebook_id") REFERENCES "public"."notebook"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("rome_code_id") REFERENCES "public"."rome_code"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"), UNIQUE ("notebook_id", "rome_code_id"));COMMENT ON TABLE "public"."wanted_job" IS E'Stores the jobs wanted for a notebook beneficiary';
 
CREATE OR REPLACE FUNCTION public.search_rome_codes(search text)
 RETURNS SETOF rome_code
 LANGUAGE sql
 STABLE
AS $function$
  SELECT *
  FROM rome_code
  WHERE
    unaccent(search) <% label
  ORDER BY unaccent(search) <<-> label ASC
$function$;

INSERT INTO wanted_job (notebook_id, rome_code_id)
SELECT nb.id nbid, rc.id rcid
FROM notebook nb
LEFT JOIN rome_code rc ON nb.job = rc.label;

alter table "public"."notebook" drop column "job" cascade;
