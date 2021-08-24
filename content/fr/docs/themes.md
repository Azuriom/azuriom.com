---
title: Thèmes
---

# Thèmes

## Introduction

Un thème permet de personnaliser entièrement l'apparence d'un site utilisant Azuriom.

Pour installer un thème il suffit de placer celui-ci dans le dossier `resources/themes/` à
la racine de votre site.

## Création d'un thème

Pour créer un thème rapidement il est possible d'utiliser la commande suivante qui
va générer automatiquement le dossier du thème ainsi que le fichier `theme.json`:
```
php artisan theme:create <nom du thème>
```

{{< info >}}
Pour créer des thèmes avec une structure plus poussée avec webpack pour compiler
du SASS et optimiser les fichiers JavaScript, vous pouvez utiliser ce
[boilerplate non-officiel](https://github.com/nolway/azuriom-theme-boilerplate)
(il est également nécessaire d'installer [Node.js](https://nodejs.org) avec NPM)
{{< /info >}}

{{< warn >}}
Lorsqu'Azuriom est installé en local pour du développement de thème,
il est très fortement recommandé d'activer le debug afin de simplifier le développement.
Cela peut se faire très simplement en modifiant ces 2 lignes dans le fichier `.env` à la
racine du site :
```
APP_ENV=local
APP_DEBUG=true
```
{{< /warn >}}

### Structuration

```
themes/  <-- Dossier contenant tous les thèmes installés
|  example/  <-- Id de votre thème
|  |  theme.json  <-- Le fichier principal de votre thème contenant les différentes informations
|  |  assets/  <-- Le dossier contenant les assets de votre thème (css, js, images, svg, etc)
|  |  views/  <-- Le dossier contenant les vues de votre thème
|  |  config/
|  |  |  config.blade.php
|  |  |  rules.php
|  |  config.json
```

### Le fichier theme.json

Tous les thèmes ont besoin d'avoir un fichier `theme.json` à leur racine, c'est
le seul élément indispensable pour un thème et il se présente sous cette forme :
```json
{
    "id": "exemple",
    "name": "Exemple",
    "version": "1.0.0",
    "description": "Un super thème",
    "url" : "https://azuriom.com",
    "authors": [
        "Azuriom"
    ]
}
```

#### ID du thème

Chaque thème doit posséder un id, qui doit être unique et qui doit contenir seulement
des chiffres, des lettres minuscules et des tirets. Il est recommandé de se baser pour
le nom pour créer l'id, par exemple si le nom est `Hello World`, l'id pourra être
`hello-world`.
Également le dossier du thème doit avoir le même nom que son id.

### Vues

Les vues sont le coeur de d'un thème, ce sont les fichiers content l'HTML de
d'un thème pour afficher les différentes parties du site.

Azuriom utilisant [Laravel](https://laravel.com/), les vues peuvent être faites en utilisant le moteur
de template Blade. Si vous ne maitrisez pas Blade il est très vivement recommandé
de lire [sa documentation](https://laravel.com/docs/blade), d'autant plus que celle-ci est assez courte.

{{< warn >}}
Il est très vivement recommandé de ne PAS utiliser la syntaxe PHP
traditionnelle lorsque vous travaillez avec Blade, en effet celle-ci n'apporte
aucun avantage et seulement des inconvénients.
{{< /warn >}}

Côté CSS, il est recommandé d'utiliser framework par défaut du cms qui est [Bootstrap 4](https://getbootstrap.com/), 
cela permettra de réaliser plus facilement un thème et sera compatible avec les nouveaux plugins 
ce qui vous évitera de faire des mises à jour constamment.
Mais si vous préférez, vous pouvez utiliser un autre framework CSS.

Côté Javascript, la seule dépendance nécessaire est [Axios](https://github.com/axios/axios).

{{< warn >}}
Bien que jQuery peut être ajouté et utilisé sans problèmes, il est recommandé
de ne pas l'utiliser afin qu'il puisse être retiré facilement lors de la sortie de
Bootstrap 5. De façon générale, [jQuery n'est plus nécessaire aujourd'hui et peut
être retiré facilement](http://youmightnotneedjquery.com/).
{{< /warn >}}

{{< info >}}
Si jamais une vue n'est pas présente dans le thème mais est présente de
base dans le CMS ou dans un plugin, celle-ci sera automatiquement utilisée.
{{< /info >}}

#### Layout

Le layout est la structure de l'ensemble des pages d'un thème. Il contient
en effet les metas, assets du thème, header, footer, etc.

Pour définir le layout de la page, il faut que la vue étende la vue contenant
le layout, vous pouvez soit utiliser le layout par défaut avec
`@extends('layouts.app')`, soit créer votre propre layout et l'étendre.

Pour afficher le contenu de la page actuelle, vous pouvez utiliser
`@yield('content')`, et pour afficher le titre de la page actuelle vous pouvez
utiliser `@yield('title')`.

Également vous pouvez intégrer différents éléments avec
`@include('<nom de la vue>')`, par exemple `@include('element.navbar')` pour
inclure la navbar.

#### Vues d'un plugin

Pour changer les vues d'un plugin, il suffit de créer un dossier `plugins` dans
le dossier `views` du thème et de créer un dossier pour chaque plugin (en utilisant
l'id du plugin et non le nom du plugin), puis d'y ajouter les vues du plugin.

Par exemple pour le plugin vote, ca donnera `views/plugins/vote/index.blade.php`.

### Méthodes

#### Assets

Pour avoir le lien vers un asset de du thème vous pouvez utiliser la fonction
`theme_asset`: 
```html
<link rel="stylesheet" href="{{ theme_asset('css/style.css') }}">
```

#### Utilisateur actuel

L'utilisateur actuel peut être récupéré grâce à la fonction `auth()->user()`.
Pour plus de détails sur l'authentification, vous pouvez vous référer à la
[documentation de Laravel](https://laravel.com/docs/authentication).

#### Fonctions utiles

Vous pouvez récupérer un certain nombre de paramètres du site via des fonctions
dédiées :

|    Fonction      |             Description                |
| ---------------- | -------------------------------------- |
| `site_name()`    | Permet de récupérer le nom du site     |
| `site_logo()`    | Permet d'avoir le lien du logo du site |
| `favicon()`      | Permet d'avoir le lien de la favicon   |
| `format_date()`  | Affiche une date formatée avec la langue actuelle. Cette fonction prend en paramètre une instance de `Carbon\Carbon` |
| `money_name()`   | Retourne le nom de la monnaie du site  |
| `format_money()` | Retourne un montant formaté avec la monnaie du site |

#### Affichage des joueurs connectés sur le serveur

Pour afficher les joueurs connectés, il suffit de vérifier que la variable `$server`
n'est pas null et que le serveur est en ligne, et si c'est le cas utiliser
`$server->getOnlinePlayers()` pour récupérer le nombre de joueurs en ligne.

```blade
@if($server && $server->isOnline())
    {{ trans_choice('messages.server.online', $server->getOnlinePlayers()) }}
@else
    {{ trans('messages.server.offline') }}
@endif
```

### Traductions

Un thème peut, s’il en a besoin, charger des traductions.

Pour cela il suffit de créer un fichier `messages.php` dans le dossier `lang/<lang>` (ex : `lang/fr`)
du thème, vous pouvez ensuite affichez une traduction via la fonction
`trans` : `{{ trans('theme::messages.hello') }}` ou via la directive `@lang`: 
`@lang('theme::messages.hello')`.
Vous pouvez également utiliser `trans_choice` pour une traduction comportant des
nombres, et `trans_bool` pour traduire un boolean (retournera en français `Oui`
/ `Non`).

Pour plus de détails sur les traductions, vous pouvez vous référer à la
[documentation de Laravel](https://laravel.com/docs/localization).

### Configuration

Vous pouvez ajouter une configuration dans un thème, pour cela il vous suffit
de créer à la racine du thème :
* Une vue `config/config.blade.php` contenant le form pour la configuration
* Un fichier `config/rules.php` contenant les différentes règles de validation pour
la configuration d'un thème.
* Un fichier `config.json` où sera stocké la configuration du thème, et contenant les valeurs par défaut 

##### Exemple

config.blade.php
```html
<form action="{{ route('admin.themes.update', $theme) }}" method="POST">
    @csrf

    <div class="form-group">
        <label for="discordInput">{{ trans('theme::carbon.config.discord') }}</label>
        <input type="text" class="form-control @error('discord-id') is-invalid @enderror" id="discordInput" name="discord-id" required value="{{ old('discord-id', config('theme.discord-id')) }}">

        @error('discord-id')
        <span class="invalid-feedback" role="alert"><strong>{{ $message }}</strong></span>
        @enderror
    </div>

    <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> {{ trans('messages.actions.save') }}</button>
</form>
```

config.json
```json
{
    "discord-id": "625774284823986183"
}
```
