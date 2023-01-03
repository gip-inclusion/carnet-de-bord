def assert_member(
    members, person, member_type: str | None = None, active: bool | None = None
):
    assert (
        len(
            [
                member
                for member in members
                if (member_type is None or member.member_type == member_type)
                and member.account_id == person.account_id
                and (active is None or member.active == active)
            ]
        )
        == 1
    )


def assert_structure(structures, structure_name=None, beneficiary_status=None):
    assert (
        len(
            [
                structure
                for structure in structures
                if (
                    structure_name is None or structure.structure_name == structure_name
                )
                and (
                    beneficiary_status is None
                    or structure.beneficiary_status == beneficiary_status
                )
            ]
        )
        == 1
    )
