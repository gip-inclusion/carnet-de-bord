alter table "public"."wanted_job" rename constraint "wanted_job_notebook_id_fkey" TO "professional_project_notebook_id_fkey";
alter table "public"."wanted_job" rename constraint "wanted_job_rome_code_id_fkey" TO "professional_project_rome_code_id_fkey";
alter table "public"."wanted_job" rename constraint "wanted_job_notebook_id_rome_code_id_key" TO "professional_project_notebook_id_rome_code_id_key";
alter table "public"."wanted_job" rename constraint "wanted_job_pkey" TO "professional_project_pkey";
alter trigger "set_public_wanted_job_updated_at" ON "public"."wanted_job" rename TO "set_public_professional_project_updated_at";
alter table "public"."wanted_job" rename to "professional_project";
