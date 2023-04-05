
alter table "public"."notebook_info" add column "orientation_reason" text
 null;

comment on column "public"."notebook_info"."orientation_reason" is E'motif de l\'orientation, saisi par le chargé d\'orientation';
