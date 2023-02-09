alter table "public"."beneficiary" add column "right_rsa" varchar;
alter table "public"."beneficiary" add column "right_are" boolean not null default false;
alter table "public"."beneficiary" add column "right_ass" boolean not null default false;
alter table "public"."beneficiary" add column "right_bonus" boolean not null default false;

UPDATE beneficiary b set right_rsa=n.right_rsa, right_are=n.right_are, right_ass=COALESCE(n.right_ass, false), right_bonus=n.right_bonus
	FROM notebook as n
	WHERE b.id = n.beneficiary_id;

alter table "public"."notebook" drop column "right_rsa";
alter table "public"."notebook" drop column "right_are";
alter table "public"."notebook" drop column "right_ass";
alter table "public"."notebook" drop column "right_bonus";
