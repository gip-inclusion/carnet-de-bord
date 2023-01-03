import os
from uuid import UUID


class OrientationInfoDTO:
    def __init__(self, beneficiary, former_referents, new_structure, new_referent):
        self.beneficiary = beneficiary
        self.former_referents = former_referents
        self.new_structure = new_structure
        self.new_referent = new_referent
        self.former_referent_account_id = (
            former_referents[0]["account"]["id"] if len(former_referents) > 0 else None
        )

    @classmethod
    def parse_from_gql(cls, orientation_info_response, with_new_referent):
        notebook = orientation_info_response["notebook"][0]

        return OrientationInfoDTO(
            beneficiary=notebook["beneficiary"],
            former_referents=notebook["former_referents"]
            if notebook["former_referents"]
            else [],
            new_structure=orientation_info_response["newStructure"],
            new_referent=orientation_info_response["newReferent"][0]
            if with_new_referent and len(orientation_info_response["newReferent"]) > 0
            else None,
        )


class OrientationInfoRepository:
    def __init__(self, gql_session, gql):
        self.gql_session = gql_session
        self.gql = gql

    async def get(
        self,
        notebook_id: UUID,
        structure_id: UUID,
        new_referent_account_id: UUID | None,
    ) -> OrientationInfoDTO:
        with_new_referent = new_referent_account_id is not None
        orientation_info_response = await self.gql_session.execute(
            self.gql(self.load_gql_file()),
            variable_values={
                "notebook_id": str(notebook_id),
                "structure_id": str(structure_id),
                "new_referent_account_id": str(new_referent_account_id),
                "with_new_referent": with_new_referent,
            },
        )
        return OrientationInfoDTO.parse_from_gql(
            orientation_info_response, with_new_referent
        )

    def load_gql_file(self, path: str = os.path.dirname(__file__)):
        with open(os.path.join(path, "orientation_info.gql"), encoding="utf-8") as f:
            return f.read()
