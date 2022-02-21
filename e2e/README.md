# tests end-to-end

Les tests e2e sont écrits en [gherkin](https://cucumber.io/docs/gherkin/reference/) en [francais](https://cucumber.io/docs/gherkin/reference/#spoken-languages) via la directive `#language: fr` présente dans les tests. Afin que codecept supporte le francais, nous utilisons le fichier `step_definitions/fr.js` pour traduire les instructions gherkin en francais.

```gherkin
Scénario:
	Soit un utilisateur sur la page d'accueil
	Alors je vois "La nouvelle version du Carnet de bord est en ligne"
	Alors le lien "Accéder à mon compte" pointe sur "/auth/login"
```

On utilise [codeceptjs](https://codecept.io/) et [playwright](https://codecept.io/playwright/)

## vocabulaire

La situation initiale commence `Soit`
les actions commencent par `Quand`
les assertions commencent par `Alors`

## utilisation

Pour lancer les tests:

```sh
cd e2e
yarn && yarn test
```

Par défaut, les tests se lancent en mode headless mais on peut aussi les lancer avec l'interface de codecept en utilisant

```sh
yarn test:e2e:ui
```

## Ecrire un test

Pour l'exemple, nous allons écrire le test pour un konami code

1. Créer le fichier konami-code.feature
1. Ecrire le test
1. lancer `yarn codeceptjs gherkin:snippets`
1. Implementer les snippets manquants
1. lancer les test.

Les snippets se trouve dans le fichier `steps.js`

## howto

Lancer un test en mode debug

```sh
$ yarn test --steps --verbose --grep "@home" -p pauseOnFail
```

on peut aussi mettre une pause dans le test

```gherkin
@my_test
Fonctionnalité: Mon test

  Scénario:
    Soit un navigateur web sur le site
    Quand je pause le test
    Alors je vois "foo"
```
