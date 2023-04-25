from datetime import date
from unittest import mock

from cdb.api.db.models.beneficiary import BeneficiaryWithAdminStructureEmail
from cdb.api.db.models.orientation_system import OrientationSystem


@mock.patch("cdb.api.core.emails.send_mail")
@mock.patch(
    "cdb.api.v1.routers.notify_admin_structures.get_beneficiaries_without_referent"
)
class TestNotifyAdminStructure:
    async def test_return_unauthorized_when_no_secret_token(
        self,
        mock_get_beneficiaries_without_referent: mock.Mock,
        mock_send_email: mock.Mock,
        test_client,
    ):
        response = await test_client.post("/v1/admin_structures/notify")

        assert response.status_code == 401
        json = response.json()
        assert json["detail"] == "Missing credentials"

    async def test_return_forbidden_when_no_secret_token(
        self,
        mock_get_beneficiaries_without_referent: mock.Mock,
        mock_send_email: mock.Mock,
        test_client,
    ):
        response = await test_client.post(
            "/v1/admin_structures/notify", headers={"secret-token": "bad token"}
        )

        assert response.status_code == 403
        json = response.json()
        assert json["detail"] == "Provided credentials are invalid"

    async def test_notify_admin_structures_when_no_beneficiaries_without_referent(
        self,
        mock_get_beneficiaries_without_referent: mock.Mock,
        mock_send_email: mock.Mock,
        test_client,
    ):
        mock_get_beneficiaries_without_referent.return_value = []

        response = await test_client.post(
            "/v1/admin_structures/notify",
            headers={"secret-token": "action_secret_token"},
        )
        json = response.json()

        assert response.status_code == 200
        assert json == []
        mock_send_email.assert_not_called()

    async def test_notify_admin_structures_when_one_beneficiary_without_referent_with_one_admin_structure(  # noqa: E501
        self,
        mock_get_beneficiaries_without_referent: mock.Mock,
        mock_send_email: mock.Mock,
        test_client,
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

        response = await test_client.post(
            "/v1/admin_structures/notify",
            headers={"secret-token": "action_secret_token"},
        )
        json = response.json()

        assert response.status_code == 200
        assert json == [
            {
                "email": "admin@structure.cdb",
                "structures": [
                    {
                        "name": "structure 123",
                        "beneficiaries": [
                            {
                                "firstname": "Jay",
                                "lastname": "Pasderéférent",
                            }
                        ],
                    }
                ],
            }
        ]

        mock_send_email.assert_called_once()
        assert (
            mock_send_email.call_args_list[0].kwargs["subject"]
            == "Nouveaux bénéficiaires sans référent"
        )
        assert mock_send_email.call_args_list[0].kwargs["to"] == "admin@structure.cdb"
        assert snapshot == mock_send_email.call_args_list[0].kwargs["message"]

    async def test_notify_admin_structures_when_one_beneficiary_without_referent_with_two_admin_structures(  # noqa: E501
        self,
        mock_get_beneficiaries_without_referent: mock.Mock,
        mock_send_email: mock.Mock,
        snapshot,
        test_client,
        orientation_system_pro: OrientationSystem,
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
                orientation=orientation_system_pro,
            ),
        ]

        response = await test_client.post(
            "/v1/admin_structures/notify",
            headers={"secret-token": "action_secret_token"},
        )
        json = response.json()

        assert response.status_code == 200
        assert json == [
            {
                "email": "admin@structure.cdb",
                "structures": [
                    {
                        "name": "structure 123",
                        "beneficiaries": [
                            {
                                "firstname": "Jay",
                                "lastname": "Pasderéférent",
                            }
                        ],
                    }
                ],
            },
            {
                "email": "second_admin@structure.cdb",
                "structures": [
                    {
                        "name": "structure 123",
                        "beneficiaries": [
                            {
                                "firstname": "Jay",
                                "lastname": "Pasderéférent",
                            }
                        ],
                    }
                ],
            },
        ]

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

    async def test_notify_admin_structures_when_two_beneficiaries_without_referent_with_one_admin_structure_and_two_structures(  # noqa: E501
        self,
        mock_get_beneficiaries_without_referent: mock.Mock,
        mock_send_email: mock.Mock,
        snapshot,
        test_client,
        orientation_system_pe: OrientationSystem,
        orientation_system_ria: OrientationSystem,
    ):
        mock_get_beneficiaries_without_referent.return_value = [
            BeneficiaryWithAdminStructureEmail(
                firstname="Jay",
                lastname="Pasderéférent",
                date_of_birth=date(1981, 12, 20),
                admin_structure_email="admin@structure.cdb",
                structure_name="structure 123",
                orientation=orientation_system_pe,
            ),
            BeneficiaryWithAdminStructureEmail(
                firstname="Jean",
                lastname="Naipanonplu",
                date_of_birth=date(1980, 5, 7),
                admin_structure_email="admin@structure.cdb",
                structure_name="structure ABC",
                orientation=orientation_system_ria,
            ),
        ]

        response = await test_client.post(
            "/v1/admin_structures/notify",
            headers={"secret-token": "action_secret_token"},
        )

        json = response.json()

        assert response.status_code == 200
        assert json == [
            {
                "email": "admin@structure.cdb",
                "structures": [
                    {
                        "name": "structure 123",
                        "beneficiaries": [
                            {
                                "firstname": "Jay",
                                "lastname": "Pasderéférent",
                            }
                        ],
                    },
                    {
                        "name": "structure ABC",
                        "beneficiaries": [
                            {
                                "firstname": "Jean",
                                "lastname": "Naipanonplu",
                            },
                        ],
                    },
                ],
            },
        ]
        assert mock_send_email.call_count == 1
        assert (
            mock_send_email.call_args_list[0].kwargs["subject"]
            == "Nouveaux bénéficiaires sans référent"
        )
        assert mock_send_email.call_args_list[0].kwargs["to"] == "admin@structure.cdb"
        assert snapshot == mock_send_email.call_args_list[0].kwargs["message"]
