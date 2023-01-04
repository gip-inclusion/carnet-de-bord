CREATE OR REPLACE FUNCTION public.nb_beneficiary_for_structure(structure_row structure)
 RETURNS bigint
 LANGUAGE sql
 STABLE
AS $function$
    SELECT  count(DISTINCT N.id)
    FROM notebook N
    LEFT JOIN notebook_member NM on NM.notebook_id = N.id
    LEFT JOIN account A on A.id = NM.account_id
    LEFT JOIN professional P on P.id = A.professional_id
    LEFT JOIN beneficiary B on B.id = N.beneficiary_id
    LEFT JOIN beneficiary_structure BS on BS.beneficiary_id = B.id
    WHERE
        ( BS.structure_id = structure_row.id AND BS.status <> 'outdated')
    OR
        ( NM.active = true AND P.structure_id = structure_row.id )
$function$;
