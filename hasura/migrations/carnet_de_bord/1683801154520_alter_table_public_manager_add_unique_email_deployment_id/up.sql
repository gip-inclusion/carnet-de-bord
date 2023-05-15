alter table "public"."manager" drop constraint "manager_email_key";
alter table "public"."manager" add constraint "manager_email_deployment_id_key" unique ("email", "deployment_id");
