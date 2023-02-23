alter table "public"."professional_project" rename constraint "professional_project_notebook_id_fkey" TO "wanted_job_notebook_id_fkey";
alter table "public"."professional_project" rename constraint "professional_project_rome_code_id_fkey" TO "wanted_job_rome_code_id_fkey";
alter table "public"."professional_project" rename constraint "professional_project_notebook_id_rome_code_id_key" TO "wanted_job_notebook_id_rome_code_id_key";
alter table "public"."professional_project" rename constraint "professional_project_pkey" TO "wanted_job_pkey";
alter trigger "set_public_professional_project_updated_at" ON "public"."professional_project" rename TO "set_public_wanted_job_updated_at";
alter table "public"."professional_project" rename to "wanted_job";
