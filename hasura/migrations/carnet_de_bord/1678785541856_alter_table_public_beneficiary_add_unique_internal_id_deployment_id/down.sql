alter table "public"."beneficiary" drop constraint "beneficiary_internal_id_deployment_id_key";
alter table "public"."beneficiary" add constraint "beneficiary_internal_id_key" unique ("internal_id");
