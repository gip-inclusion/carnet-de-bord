# Tests end-to-end

Afin de vérifier le bon comportement de la plateforme dans son ensemble, du point de vue de l'utilisateur, l'équipe développe et maintient des tests bout-en-bout (a.k.a. tests _end-to-end_ ou "e2e").

Ceux-ci sont intégrés au _pipeline CI/CD_ du projet (cf. fichiers GitHub Actions `./github/workflows/*.yml`).

![Workflow GitHub Actions](./workflow_cicd.png)

## Technologies

Les tests e2e sont développés et mis en œuvre grâce aux technologies CodeceptJS et Playwright.

[**CodeceptJS**](https://codecept.io) est un framework de test UI full-stack qui se veut agnostique des technologies sous-jacentes (Playwright, WebDriver, Puppeteer, TestCafe, Protractor, Appium). Nous l'utilisons comme _runner_ et orchestrateur des tests e2e. CodeceptJS peut être exécuté en mode ligne de commande (CLI) ou via une interface graphique (CodeceptUI).

[**Playwright**](https://codecept.io/playwright/) est une bibliothèque Node.js permettant d'automatiser et valider des traitements sur différents navigateurs (Chromium, Firefow, Safari, Electron) via une API exploitant le [protocole DevTools](https://chromedevtools.github.io/devtools-protocol/).

Les tests e2e sont écrits au format [**Gherkin**](https://cucumber.io/docs/gherkin/reference/) en [francais](https://cucumber.io/docs/gherkin/reference/#spoken-languages) grâce à la directive `#language: fr`, à renseigner dans chaque fichier de test.

```gherkin
Scénario:
  Soit un utilisateur sur la page d'accueil
  Alors je vois "La nouvelle version du Carnet de bord est en ligne"
  Alors le lien "Accéder à mon compte" pointe sur "/auth/login"
```

> 💡 Pour que CodeceptJS supporte le français, des équivalences de termes sont définies dans le fichier `step_definitions/fr.js`.

## Usage

> ⚠️ Vous devez au préalable avoir une plateforme opérationnelle (cf. [Installation](../README.md#Installation)), notamment la partie API backend.

Pour lancer les tests e2e sur sa machine :

```sh
cd e2e
npm ci && npm test
```

Par défaut, les tests se lancent en mode _headless_ mais on peut aussi les lancer avec l'interface de Codecept - CodeceptUI - grâce à la commande :

```sh
npm run test:ui
```

![CodeceptUI](./codeceptui.png)

## Écrire un test

Pour l'exemple, nous allons écrire le test pour un konami code

1. Créer le fichier konami-code.feature
1. Ecrire le test
1. lancer `npm run codeceptjs gherkin:snippets`
1. Implementer les snippets manquants
1. Lancer les test.

Les snippets se trouvent dans le fichier `steps.js`

## Howto

#### Vocabulaire

- La situation initiale commence par `Soit`
- Les actions commencent par `Quand`
- Les assertions commencent par `Alors`

#### Lancer un test en mode debug

```sh
$ npm run test --steps --verbose --grep "@home" -p pauseOnFail
```

#### Mettre une pause dans le test

```gherkin
@my_test
Fonctionnalité: Mon test

  Scénario:
    Soit un navigateur web sur le site
    Quand je pause le test # il faut insérer toute la phrase telle quelle
    Alors je vois "foo"
```

## Liens

- [xpath cheatsheet](https://devhints.io/xpath)
