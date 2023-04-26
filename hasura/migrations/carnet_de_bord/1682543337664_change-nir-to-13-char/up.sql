update beneficiary set nir=(select left(nir, 13));

alter table beneficiary alter column nir type varchar(13);
