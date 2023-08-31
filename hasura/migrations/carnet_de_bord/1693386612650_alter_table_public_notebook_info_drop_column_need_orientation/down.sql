alter table "public"."notebook_info" add column "need_orientation" bool default false;
comment on column "public"."notebook_info"."need_orientation" is E'notebook orientation infos';
