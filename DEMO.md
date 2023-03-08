# Comptes de démo

Il existe plusieurs roles dans l'application Carnet de bord. Chacun correspondant à un profil d'usager.
- admin_cdb
- administrateur de territoire (manager dans les permissions hasura)
- admin_structure
- orientation_manager
- professional
- beneficiary

## Compte Administrateur (role: admin_cdb)
| username | email |
| --- | --- |
| admin | contact+admin@carnetdebord.inclusion.beta.gouv.fr |

Ce compte permet de créer un déploiement et d'y assigner un administrateur de structure.
Il existe 2 déploiement dans le jeu de données de test qui sert à peupler la base de données.

## Compte admin de territoire (role: manager)
| username | email |
| --- | --- |
| manager.cd93 | contact+cd93@carnetdebord.inclusion.beta.gouv.fr |
| manager.cd51 | contact+cd51@carnetdebord.inclusion.beta.gouv.fr |

## Compte admin de structure (role: admin_structure)
| username | email | structure | onboarding |
| --- | --- | --- | --- |
| vincent.timaitre | vincent.timaitre@groupe-ns.fr | Groupe NS | oui |
| jacques.celaire | jacques.celaire@livry-gargan.fr | Centre Communal d'action social Livry-Gargan | non |


## Compte chargé d'orientation (role: orientation_manager)
| username | email |  onboarding |
| --- | --- | --- |
| giulia.diaby | giulia.diaby@cd93.fr | non |
| laure.loge | laure.loge@cd51.fr | non |
| samy.rouate | samy.rouate@cd93.fr | oui |

## Compte d'accompagnant (role: professional)
| username | email |  structure | onboarding |
| --- | --- | --- | --- |
| pierre.chevalier | pierre.chevalier@livry-gargan.fr | Centre Communal d'action social Livry-Gargan| oui |
| sandie.manchet | sandie.manchet@livry-gargan.fr | Centre Communal d'action social Livry-Gargan | non |
| pcamara | pcamara@seinesaintdenis.fr | Service Social Départemental | oui |
| sanka | sanka@groupe-ns.fr | Groupe NS | oui |
| thierry.dunord | dunord@pole-emploi.fr | Pole Emploi Agence Livry-Gargnan | oui |
| jean.poiret | jeanpoiret@mission-locale.fr | Interlogement 93 | non |
| edith.orial | edith.orial@interlogement93.fr | Interlogement 93 | non |

## Compte de bénéficiaire (role: beneficiary)
| email | deploiement |
| --- | --- |
| stifour93@yahoo.fr | 93 |
