alter table "public"."beneficiary" rename column "external_id" to "internal_id";
alter index beneficiary_deployment_id_external_id_key rename to beneficiary_deployment_id_internal_id_key;
