alter table "public"."beneficiary" drop constraint "beneficiary_internal_id_deployment_id_key";
alter table "public"."beneficiary" add constraint "beneficiary_deployment_id_internal_id_key" unique ("deployment_id", "internal_id");
