alter table "public"."external_data_info"
  add constraint "external_data_info_professional_id_fkey"
  foreign key ("professional_id")
  references "public"."professional"
  ("id") on update cascade on delete cascade;
