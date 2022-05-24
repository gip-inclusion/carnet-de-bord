alter table "public"."beneficiary"
	add column "need_orientation" boolean not null default 'False';

-- alter table "public"."beneficiary"
-- 	alter column "need_orientation"
-- 	set default 'True';
