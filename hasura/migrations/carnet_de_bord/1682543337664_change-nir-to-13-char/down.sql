-- Warning, if this migration is set down,
-- 15 digits nir will be allowed
-- but current nirs will remain 13 digits long
alter table beneficiary alter column nir type varchar(15);
