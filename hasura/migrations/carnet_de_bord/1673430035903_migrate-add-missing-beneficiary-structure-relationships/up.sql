insert into beneficiary_structure (beneficiary_id, structure_id, status)
    select n.beneficiary_id as b_id, pro.structure_id as str_id, 'current'
    from notebook as n
    inner join notebook_member as nm on n.id = nm.notebook_id
    inner join account as acc on nm.account_id = acc.id
    inner join professional as pro on pro.id = acc.professional_id
    where nm.active = true
    and nm.member_type = 'referent'
    and acc.type = 'professional'
    EXCEPT
    select beneficiary_id, structure_id, status from beneficiary_structure;
