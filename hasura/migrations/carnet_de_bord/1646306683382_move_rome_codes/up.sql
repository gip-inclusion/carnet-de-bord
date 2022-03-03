
INSERT INTO wanted_job (notebook_id, rome_code_id)
SELECT nb.id nbid, rc.id rcid
FROM notebook nb
LEFT JOIN rome_code rc ON nb.job = rc.label;

alter table "public"."notebook" drop column "job" cascade;
