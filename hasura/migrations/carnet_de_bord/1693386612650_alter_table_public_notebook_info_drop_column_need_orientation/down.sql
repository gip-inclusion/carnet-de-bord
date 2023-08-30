comment on column "public"."notebook_info"."need_orientation" is E'notebook orientation infos';
alter table "public"."notebook_info" alter column "need_orientation" set default false;
alter table "public"."notebook_info" alter column "need_orientation" drop not null;
alter table "public"."notebook_info" add column "need_orientation" bool;
