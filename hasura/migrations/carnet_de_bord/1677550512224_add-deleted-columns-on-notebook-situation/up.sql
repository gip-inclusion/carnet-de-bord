alter table "public"."notebook_situation" add column "deleted_at" timestamptz
 null;

alter table "public"."notebook_situation" add column "deleted_by" uuid
 null;

alter table "public"."notebook_situation" drop constraint "notebook_situation_notebook_id_situation_id_key";
alter table "public"."notebook_situation" add constraint "notebook_situation_notebook_id_situation_id_deleted_at_key" unique ("notebook_id", "situation_id", "deleted_at");
