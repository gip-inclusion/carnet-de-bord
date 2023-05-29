import logging
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import List
from urllib.parse import quote
from zoneinfo import ZoneInfo

import httpx

from cdb.pe.models.contrainte import Contrainte

from .models.agence import Agence
from .models.beneficiary import Beneficiary

logger = logging.getLogger(__name__)

API_CLIENT_HTTP_ERROR_CODE = "http_error"


class PoleEmploiAPIException(Exception):
    'unexpected exceptions (meaning, "exceptional") that warrant a retry.'

    def __init__(self, error_code):
        self.error_code = error_code
        super().__init__()


class PoleEmploiAPIBadResponse(Exception):
    """errors that can't be recovered from: the API server does not agree."""

    def __init__(self, response_code):
        self.response_code = response_code
        super().__init__()


API_TIMEOUT_SECONDS = 60  # this API is pretty slow, let's give it a chance


@dataclass
class PoleEmploiApiClient:
    auth_base_url: str
    base_url: str
    client_id: str
    client_secret: str
    scope: str
    tz: str = "Europe/Paris"
    token: str | None = None
    expires_at: datetime | None = None

    @property
    def token_url(self) -> str:
        return f"{self.auth_base_url}/connexion/oauth2/access_token"

    @property
    def agences_url(self) -> str:
        return f"{self.base_url}/partenaire/referentielagences/v1/agences"

    @property
    def usagers_url(self) -> str:
        # rechercher-usager/v1/usagers/recherche
        #   dateNaissance=1981-03-15
        #   nir=181036290874034
        return f"{self.base_url}/partenaire/rechercher-usager/v1/usagers/recherche"

    def contraintes_url(self, usager_id: str) -> str:
        return (
            f"{self.base_url}/partenaire/diagnosticargumente/v1/individus/"
            f"{quote(usager_id)}/contraintes"
        )

    async def _refresh_token(self, at=None) -> None:
        if not at:
            at = datetime.now(tz=ZoneInfo(self.tz))
        if self.expires_at and self.expires_at > at:
            return

        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.token_url,
                params={"realm": "/partenaire"},
                data={
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                    "grant_type": "client_credentials",
                    "scope": self.scope,
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )
        response.raise_for_status()
        auth_data = response.json()
        self.token = f"{auth_data['token_type']} {auth_data['access_token']}"
        self.expires_at = at + timedelta(seconds=auth_data["expires_in"])

    @property
    def _headers(self) -> dict:
        return {"Authorization": self.token, "Content-Type": "application/json"}

    async def _post_request(self, url: str, params: dict):
        try:
            await self._refresh_token()
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    url, json=params, headers=self._headers, timeout=API_TIMEOUT_SECONDS
                )
            if response.status_code != 200:
                raise PoleEmploiAPIException(response.status_code)
            data = response.json()
            return data
        except httpx.RequestError as exc:
            raise PoleEmploiAPIException(API_CLIENT_HTTP_ERROR_CODE) from exc

    async def _get_request(self, url: str, params: dict | None = None):
        try:
            await self._refresh_token()
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    url,
                    params=params,
                    headers=self._headers,
                    timeout=API_TIMEOUT_SECONDS,
                )
            if response.status_code != 200:
                raise PoleEmploiAPIException(response.status_code)
            data = response.json()
            return data
        except httpx.RequestError as exc:
            raise PoleEmploiAPIException(API_CLIENT_HTTP_ERROR_CODE) from exc

    async def recherche_pole_emploi_agences(
        self,
        commune: str,
        horaire: bool = False,
        zonecompetence: bool = False,
        agences_url: str | None = None,
        add_padding: bool = True,
    ) -> List[dict]:
        """Example data:
        {
            "commune":"72",
            "horaires":True,
            "zonecompetence":False
        }

        Example response:
        [
           {
              "code":"PDL0031",
              "codeSafir":"72022",
              "libelle":"LE MANS OUEST",
              "libelleEtendu":"Agence Pôle emploi LE MANS OUEST",
              "type":"APE",
              "typeAccueil":"3",
              "codeRegionINSEE":"52",
              "dispositifADEDA":true,
              "contact":{
                 "telephonePublic":"39-49",
                 "email":"ape.72022@pole-emploi.fr"
              },
              "siret":"13000548124481",
              "adressePrincipale":{
                 "ligne4":"2 AVENUE GEORGES AURIC",
                 "ligne5":"",
                 "ligne6":"72000 LE MANS",
                 "gpsLon":0.151963,
                 "gpsLat":48.015516,
                 "communeImplantation":"72181",
                 "bureauDistributeur":"72000"
              }
           },
           {
              "code":"PDL0037",
              "codeSafir":"72005",
              "libelle":"MONTVAL SUR LOIR",
              "libelleEtendu":"Agence Pôle emploi MONTVAL SUR LOIR",
              "type":"APE",
              "typeAccueil":"3",
              "codeRegionINSEE":"52",
              "dispositifADEDA":true,
              "contact":{
                 "telephonePublic":"39-49",
                 "email":"ape.72005@pole-emploi.fr"
              },
              "siret":"13000548125314",
              "adressePrincipale":{
                 "ligne4":"19 RUE du Mont sur Loir",
                 "ligne5":"",
                 "ligne6":"72500 CHATEAU DU LOIR",
                 "gpsLon":0.427813,
                 "gpsLat":47.684688,
                 "communeImplantation":"72071",
                 "bureauDistributeur":"72500"
              }
           },
           {
              "code":"PDL0038",
              "codeSafir":"72115",
              "libelle":"LE MANS SABLONS",
              "libelleEtendu":"Agence Pôle emploi LE MANS SABLONS",
              "type":"APE",
              "typeAccueil":"3",
              "codeRegionINSEE":"52",
              "dispositifADEDA":true,
              "contact":{
                 "telephonePublic":"39-49",
                 "email":"ape.72115@pole-emploi.fr"
              },
              "siret":"13000548123145",
              "adressePrincipale":{
                 "ligne4":"20 RUE DE CORSE",
                 "ligne5":"",
                 "ligne6":"72100 LE MANS",
                 "gpsLon":0.233632,
                 "gpsLat":47.996219,
                 "communeImplantation":"72181",
                 "bureauDistributeur":"72100"
              }
           },
           {
              "code":"PDL0039",
              "codeSafir":"72123",
              "libelle":"LE MANS GARE",
              "libelleEtendu":"Agence Pôle emploi LE MANS GARE",
              "type":"APE",
              "typeAccueil":"3",
              "codeRegionINSEE":"52",
              "dispositifADEDA":true,
              "contact":{
                 "telephonePublic":"39-49",
                 "email":"ape.72123@pole-emploi.fr"
              },
              "siret":"13000548122345",
              "adressePrincipale":{
                 "ligne4":"18 RUE Pierre-Felix Delarue",
                 "ligne5":"",
                 "ligne6":"72100 LE MANS",
                 "gpsLon":0.186472,
                 "gpsLat":47.994548,
                 "communeImplantation":"72181",
                 "bureauDistributeur":"72100"
              }
           },
           {
              "code":"PDL0041",
              "codeSafir":"72020",
              "libelle":"LA FLECHE",
              "libelleEtendu":"Agence Pôle emploi LA FLECHE",
              "type":"APE",
              "typeAccueil":"3",
              "codeRegionINSEE":"52",
              "dispositifADEDA":true,
              "contact":{
                 "telephonePublic":"39-49",
                 "email":"ape.72020@pole-emploi.fr"
              },
              "siret":"13000548121404",
              "adressePrincipale":{
                 "ligne3":"ZA Jalêtre ",
                 "ligne4":"3 RUE Irene Joliot Curie",
                 "ligne5":"",
                 "ligne6":"72200 LA FLECHE",
                 "gpsLon":-0.097632,
                 "gpsLat":47.706743,
                 "communeImplantation":"72154",
                 "bureauDistributeur":"72200"
              }
           },
           {
              "code":"PDL0042",
              "codeSafir":"72035",
              "libelle":"LA FERTE BERNARD",
              "libelleEtendu":"Agence Pôle emploi LA FERTE BERNARD",
              "type":"APE",
              "typeAccueil":"3",
              "codeRegionINSEE":"52",
              "dispositifADEDA":true,
              "contact":{
                 "telephonePublic":"39-49",
                 "email":"ape.72035@pole-emploi.fr"
              },
              "siret":"13000548124317",
              "adressePrincipale":{
                 "ligne4":"57 AV DU GENERAL DE GAULLE",
                 "ligne5":"",
                 "ligne6":"72400 LA FERTE BERNARD",
                 "gpsLon":0.65407,
                 "gpsLat":48.178286,
                 "communeImplantation":"72132",
                 "bureauDistributeur":"72400"
              }
           },
           {
              "code":"PDL0043",
              "codeSafir":"72043",
              "libelle":"SABLE SUR SARTHE",
              "libelleEtendu":"Agence Pôle emploi SABLE SUR SARTHE",
              "type":"APE",
              "typeAccueil":"3",
              "codeRegionINSEE":"52",
              "dispositifADEDA":true,
              "contact":{
                 "telephonePublic":"39-49",
                 "email":"ape.72043@pole-emploi.fr"
              },
              "siret":"13000548123194",
              "adressePrincipale":{
                 "ligne4":"7 RUE LA MARTINIERE",
                 "ligne5":"",
                 "ligne6":"72300 SABLE SUR SARTHE",
                 "gpsLon":-0.312381,
                 "gpsLat":47.839459,
                 "communeImplantation":"72264",
                 "bureauDistributeur":"72300"
              }
           },
           {
              "code":"PDL0044",
              "codeSafir":"72051",
              "libelle":"MAMERS",
              "libelleEtendu":"Agence Pôle emploi MAMERS",
              "type":"APE",
              "typeAccueil":"3",
              "codeRegionINSEE":"52",
              "dispositifADEDA":true,
              "contact":{
                 "telephonePublic":"39-49",
                 "email":"ape.72051@pole-emploi.fr"
              },
              "siret":"13000548123178",
              "adressePrincipale":{
                 "ligne4":"102 bis RUE LEDRU ROLLIN",
                 "ligne5":"",
                 "ligne6":"72600 MAMERS",
                 "gpsLon":0.37092,
                 "gpsLat":48.346842,
                 "communeImplantation":"72180",
                 "bureauDistributeur":"72600"
              }
           }
        ]
        """

        if add_padding:
            # By default, if you are looking for the department number 8
            # you need to pass "08" to the API
            commune = commune.rjust(2, "0")

        data = await self._get_request(
            self.agences_url if agences_url is None else agences_url,
            params={
                "horaire": horaire,
                "commune": commune,
                "zonecompetence": zonecompetence,
            },
        )
        return data

    async def recherche_agences(self, *args, **kwargs) -> List[Agence]:
        agences: List[dict] = await self.recherche_pole_emploi_agences(*args, **kwargs)
        return [Agence.parse_obj(agence) for agence in agences]

    async def search_beneficiary(self, nir: str, date_of_birth: str) -> Beneficiary:
        usager: dict = await self._post_request(
            url=self.usagers_url, params={"nir": nir, "dateNaissance": date_of_birth}
        )
        # Todo test si on ne trouve pas l'usager
        return Beneficiary.parse_obj(usager)

    async def get_contraintes(self, usager_id: str) -> List[Contrainte]:
        result: dict = await self._get_request(url=self.contraintes_url(usager_id))
        return [Contrainte.parse_obj(obj) for obj in result["contraintes"]]
