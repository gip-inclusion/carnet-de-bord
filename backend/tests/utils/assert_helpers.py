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
