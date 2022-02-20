
alter table "public"."beneficiary_structure" add constraint "beneficiary_structure_beneficiary_id_structure_id_status_key" unique ("beneficiary_id", "structure_id", "status");
