from datetime import date
from unittest import TestCase, mock
from uuid import UUID

import pytest

from cdb.api.core.exceptions import FindResultException
from cdb.caf_msa.parse_infos_foyer_rsa import (
    CafBeneficiary,
    CafInfoFlux,
    CafMsaInfosFoyer,
)
from cdb.caf_msa.update_cafmsa_infos import update_cafmsa_for_beneficiaries


class TestUpdateCAFMSA(TestCase):
    @pytest.mark.graphql
    @mock.patch("cdb.api.db.graphql.manager.get_manager_by_account_id")
    async def test_update_cafmsa_infos_fail_if_no_manager_found(
        self,
        get_manager_cd_93_account_id: UUID,
        get_manager_mock: mock.Mock,
        get_manager_jwt_93: str,
    ):
        infos = CafInfoFlux(date=date.today(), type="M")
        foyers = [
            CafMsaInfosFoyer(
                date_cloture_rsa=None,
                etat_droit_rsa="2",
                motif_cloture_rsa=None,
                matricule="1234567",
                personnes=[
                    CafBeneficiary(nir="1234567891234", soumis_droit_et_devoir=True)
                ],
                motif_suspension_versement_rsa=None,
                sans_domicile_fixe="0",
            )
        ]
        get_manager_mock.return_value = []
        await update_cafmsa_for_beneficiaries(
            get_manager_cd_93_account_id, get_manager_jwt_93, (infos, foyers)
        )
        self.assertRaises(FindResultException)
