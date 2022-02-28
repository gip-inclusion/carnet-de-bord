
alter table "public"."beneficiary_structure" drop constraint "beneficiary_structure_beneficiary_id_structure_id_status_key";
alter table "public"."beneficiary_structure" add constraint "beneficiary_structure_structure_id_beneficiary_id_key" unique ("structure_id", "beneficiary_id");
