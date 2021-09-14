
-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notebook" add column "contract_sign_date" date
--  null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notebook" add column "contract_type" varchar
--  null;

alter table "public"."notebook" alter column "cer_objects" drop not null;
alter table "public"."notebook" add column "cer_objects" jsonb;


-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notebook" add column "work_situation_date" date
--  null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notebook" add column "job" varchar
--  null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notebook" add column "education_level" varchar
--  null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notebook" add column "geographical_area" varchar
--  null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notebook" add column "right_bonus" boolean
--  not null default 'false';

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notebook" add column "right_ass" boolean
--  null default 'false';

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notebook" add column "right_are" boolean
--  not null default 'false';

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notebook" add column "right_rqth" boolean
--  not null default 'false';

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notebook" add column "right_rsa" varchar
--  null;

alter table "public"."notebook" alter column "rsa_right" drop not null;
alter table "public"."notebook" add column "rsa_right" varchar;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notebook" add column "rsa_right" varchar
--  null;

alter table "public"."notebook" alter column "rights" drop not null;
alter table "public"."notebook" add column "rights" jsonb;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notebook_target" add column "linked_to" varchar
--  null;
