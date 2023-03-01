alter table "public"."notebook_situation" drop constraint "notebook_situation_notebook_id_situation_id_deleted_at_key";
alter table "public"."notebook_situation" add constraint "notebook_situation_notebook_id_situation_id_key" unique ("notebook_id", "situation_id");

alter table "public"."notebook_situation" drop constraint "notebook_situation_deleted_by_fkey";
alter table "public"."notebook_situation" drop column "deleted_by";
alter table "public"."notebook_situation" drop column "deleted_at";
