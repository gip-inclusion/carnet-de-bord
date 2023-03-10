alter table "public"."professional_project" drop constraint "professional_project_notebook_id_rome_code_id_key";

drop index if exists "public"."professional_project_notebook_id_rome_code_id_key";

create unique index notebook_id_rome_code_id_null_idx on professional_project (notebook_id, COALESCE(rome_code_id, '00000000-0000-0000-0000-000000000000'));
