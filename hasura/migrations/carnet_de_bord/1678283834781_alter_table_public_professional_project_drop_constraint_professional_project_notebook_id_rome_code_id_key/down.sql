drop index if exists notebook_id_rome_code_id_null_idx;

create index "professional_project_notebook_id_rome_code_id_key" on
  "public"."professional_project" using btree ("notebook_id", "rome_code_id");

alter table "public"."professional_project" add constraint "professional_project_notebook_id_rome_code_id_key" unique ("notebook_id", "rome_code_id");
