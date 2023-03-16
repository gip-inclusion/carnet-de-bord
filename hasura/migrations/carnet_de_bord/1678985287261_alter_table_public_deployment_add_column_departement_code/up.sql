alter table "public"."deployment" add column "department_code" character varying null;
update deployment set department_code =  (regexp_match(label,'([0-9]+)'))[1];
