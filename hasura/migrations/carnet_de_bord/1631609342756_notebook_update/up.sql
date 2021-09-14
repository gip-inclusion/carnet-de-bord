alter table "public"."notebook" drop column "rights" cascade;

alter table "public"."notebook" add column "right_rsa" varchar
 null;

alter table "public"."notebook" add column "right_rqth" boolean
 not null default 'false';

alter table "public"."notebook" add column "right_are" boolean
 not null default 'false';

alter table "public"."notebook" add column "right_ass" boolean
 null default 'false';

alter table "public"."notebook" add column "right_bonus" boolean
 not null default 'false';

alter table "public"."notebook" add column "geographical_area" varchar
 null;

alter table "public"."notebook" add column "education_level" varchar
 null;

alter table "public"."notebook" add column "job" varchar
 null;

alter table "public"."notebook" add column "work_situation_date" date
 null;

alter table "public"."notebook" drop column "cer_objects" cascade;

alter table "public"."notebook" add column "contract_type" varchar
 null;

alter table "public"."notebook" add column "contract_sign_date" date
 null;

alter table "public"."notebook_focus" add column "linked_to" varchar null;
