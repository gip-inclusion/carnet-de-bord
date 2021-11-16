alter table "public"."structure" drop constraint "structure_name_key";
alter table "public"."structure" add constraint "structure_name_deployment_id_key" unique ("name", "deployment_id");
