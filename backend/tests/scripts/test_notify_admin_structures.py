from datetime import date
from unittest import mock

from asyncpg.connection import Connection

from cdb.api.db.models.beneficiary import BeneficiaryWithAdminStructureEmail
from cdb.api.db.models.orientation_type import OrientationType
from cdb.scripts.notify_admin_structures.notify_admin_structures import (
    notify_admin_structures,
)


@mock.patch("cdb.api.core.emails.send_mail")
@mock.patch(
    "cdb.scripts.notify_admin_structures.notify_admin_structures.get_beneficiaries_without_referent"
)
class TestNotifyAdminStructure:
    async def test_notify_admin_structures_when_no_beneficiaries_without_referent(
        self,
        mock_get_beneficiaries_without_referent: mock.Mock,
        mock_send_email: mock.Mock,
        db_connection: Connection,
    ):
        mock_get_beneficiaries_without_referent.return_value = []

        await notify_admin_structures(db_connection)

        mock_send_email.assert_not_called()

    async def test_notify_admin_structures_when_one_beneficiary_without_referent_with_one_admin_structure(
        self,
        mock_get_beneficiaries_without_referent: mock.Mock,
        mock_send_email: mock.Mock,
        db_connection: Connection,
        snapshot,
    ):

        mock_get_beneficiaries_without_referent.return_value = [
            BeneficiaryWithAdminStructureEmail(
                firstname="Jay",
                lastname="Pasderéférent",
                date_of_birth=date(1981, 12, 20),
                admin_structure_email="admin@structure.cdb",
                structure_name="structure 123",
                orientation=None,
            )
        ]

        await notify_admin_structures(db_connection)

        mock_send_email.assert_called_once()
        assert (
            mock_send_email.call_args_list[0].kwargs["subject"]
            == "Nouveaux bénéficiaires sans référent"
        )
        assert mock_send_email.call_args_list[0].kwargs["to"] == "admin@structure.cdb"
        assert snapshot == mock_send_email.call_args_list[0].kwargs["message"]

    async def test_notify_admin_structures_when_one_beneficiary_without_referent_with_two_admin_structures(
        self,
        mock_get_beneficiaries_without_referent: mock.Mock,
        mock_send_email: mock.Mock,
        db_connection: Connection,
        snapshot,
    ):
        mock_get_beneficiaries_without_referent.return_value = [
            BeneficiaryWithAdminStructureEmail(
                firstname="Jay",
                lastname="Pasderéférent",
                date_of_birth=date(1981, 12, 20),
                admin_structure_email="admin@structure.cdb",
                structure_name="structure 123",
                orientation=None,
            ),
            BeneficiaryWithAdminStructureEmail(
                firstname="Jay",
                lastname="Pasderéférent",
                date_of_birth=date(1981, 12, 20),
                admin_structure_email="second_admin@structure.cdb",
                structure_name="structure 123",
                orientation=OrientationType.pro,
            ),
        ]

        await notify_admin_structures(db_connection)

        assert mock_send_email.call_count == 2
        assert (
            mock_send_email.call_args_list[0].kwargs["subject"]
            == "Nouveaux bénéficiaires sans référent"
        )
        assert mock_send_email.call_args_list[0].kwargs["to"] == "admin@structure.cdb"
        assert (
            mock_send_email.call_args_list[1].kwargs["subject"]
            == "Nouveaux bénéficiaires sans référent"
        )
        assert (
            mock_send_email.call_args_list[1].kwargs["to"]
            == "second_admin@structure.cdb"
        )
        assert snapshot == [
            mock_send_email.call_args_list[0].kwargs["message"],
            mock_send_email.call_args_list[1].kwargs["message"],
        ]

    async def test_notify_admin_structures_when_two_beneficiaries_without_referent_with_one_admin_structure_and_two_structures(
        self,
        mock_get_beneficiaries_without_referent: mock.Mock,
        mock_send_email: mock.Mock,
        db_connection: Connection,
        snapshot,
    ):
        mock_get_beneficiaries_without_referent.return_value = [
            BeneficiaryWithAdminStructureEmail(
                firstname="Jay",
                lastname="Pasderéférent",
                date_of_birth=date(1981, 12, 20),
                admin_structure_email="admin@structure.cdb",
                structure_name="structure 123",
                orientation=OrientationType.social,
            ),
            BeneficiaryWithAdminStructureEmail(
                firstname="Jean",
                lastname="Naipanonplu",
                date_of_birth=date(1980, 5, 7),
                admin_structure_email="admin@structure.cdb",
                structure_name="structure ABC",
                orientation=OrientationType.sociopro,
            ),
        ]

        await notify_admin_structures(db_connection)

        assert mock_send_email.call_count == 1
        assert (
            mock_send_email.call_args_list[0].kwargs["subject"]
            == "Nouveaux bénéficiaires sans référent"
        )
        assert mock_send_email.call_args_list[0].kwargs["to"] == "admin@structure.cdb"
        assert snapshot == mock_send_email.call_args_list[0].kwargs["message"]
