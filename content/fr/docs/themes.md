---
title: Thèmes
weight: 6
---

# Développement de Thèmes

## Introduction

Les thèmes sont essentiels pour un site web et en définissent l'apparence complète.
Des dizaines de thèmes prêts à l'emploi sont disponibles sur le marché.
Cependant, vous pouvez aussi créer vos propres thèmes pour adapter votre site selon vos besoins.

{{< info >}}
L'installation d'Azuriom en locale est fortement recommandée pour simplifier le développement de thèmes.
Lorsque Azuriom est installé localement, le mode debug peut être activé en modifiant les lignes suivantes dans
le fichier `.env` :
```env
APP_ENV=local
APP_DEBUG=true
```
{{< /info >}}

## Création d'un Thème

La façon recommandée de créer un thème est en utilisant la commande suivante pour générer les fichiers requis :
```sh
php artisan theme:create <nom_du_theme>
```

## Structure du Thème

```
themes/  <-- Dossier contenant tous les thèmes installés
| example/  <-- Identifiant du thème
| | theme.json  <-- Fichier contenant les informations du thème
| | assets/ <-- Dossier contenant les ressources du thème (CSS, JS, images, etc.)
| | views/  <-- Dossier contenant les vues du thème
| | config/
| | | config.blade.php  <-- Vue contenant le formulaire de configuration du thème
| | | rules.php  <-- Règles de validation pour la configuration du thème
| | config.json  <-- Configuration par défaut du thème
```

### Fichier `theme.json`

Un thème doit inclure un fichier `theme.json` à sa racine, contenant les informations de base du thème :
```json
{
    "id": "example",
    "name": "Example",
    "version": "1.0.0",
    "description": "Un excellent thème.",
    "url": "https://azuriom.com",
    "authors": [
        "Azuriom"
    ],
    "azuriom_api": "1.2.0"
}
```

#### Identifiant

Un thème doit avoir un identifiant unique qui ne contient que des chiffres, des lettres minuscules et des tirets.
L'identifiant est utilisé pour identifier le thème dans le système et doit correspondre au nom du dossier du thème.
Par exemple, un thème nommé `Hello World` pourrait avoir l'identifiant `hello-world`.

{{< info >}}
Le dossier dans lequel le thème est installé doit être nommé avec l'identifiant du thème.
{{< /info >}}

## Vues

Azuriom est basé sur [Laravel](https://laravel.com) et utilise le moteur de templates Blade pour créer les vues.
Pour plus d'informations sur Blade, consultez la [documentation de Blade](https://laravel.com/docs/blade).

Lors du rendu d'une vue, Azuriom la recherche d'abord dans le thème. Si elle n'est pas trouvée,
elle est ensuite recherchée dans Azuriom ou dans le plugin correspondant.
Les parties des vues peuvent être réparties à différents endroits, ce qui permet de personnaliser la mise en page d'Azuriom tout en conservant le contenu par défaut d'une vue.

### Mise en Page

Le layout principal d'Azuriom se trouve dans le fichier `views/layouts/base.blade.php`.
Ce layout contient la structure de base du site, y compris le header, footer et le contenu de la page (affiché avec `@yield('content')`).
Toutes les pages, à l'exception de la page d'accueil, étendent un sous-layout, `views/layouts/app.blade.php`, qui étend le layout de base.

Les composants peuvent être inclus dans le layout à l'aide de `@include`. Par exemple, pour inclure la barre de navigation :
```html
@include('elements.navbar')
```

{{< warn >}}
Il est fortement recommandé **de ne pas modifier** les vues autres que le layout, les composants (comme la barre de navigation) et la page d'accueil,
car cela peut entraîner des problèmes de compatibilité avec les plugins et les mises à jour futures.

Il est préférable d'utiliser du CSS pour personnaliser l'apparence du site.
{{< /warn >}}

### Couleur du Thème

La couleur principale par défaut de Bootstrap est le bleu (`#0d6efd`),
mais Azuriom propose une solution simple pour la modifier,
en ajoutant simplement la ligne suivante dans la section `<head>` du layout (après le fichier CSS de Bootstrap),
où `$color` représente la valeur hexadécimale de la couleur :
```html
<link href="{{ asset('css/base.css') }}" rel="stylesheet">
@include('elements.theme-color', ['color' => $color])
```

## Ressources

Azuriom repose sur [Bootstrap 5](https://getbootstrap.com) afin de garantir une bonne cohérence visuelle sur l'ensemble du site et plugins,
tout en profitant des différents composants et utilitaires fournis par Bootstrap.
Pour plus d'informations sur Bootstrap, consultez la [documentation de Bootstrap](https://getbootstrap.com/docs/5.2/).

Vous pouvez ajouter de nouveaux fichiers CSS/JavaScript et images dans le thème, en les plaçant dans le dossier `assets` du thème.
Ces fichiers peuvent ensuite être inclus en utilisant la fonction `theme_asset`, qui génère l'URL correspondante pour chaque fichier.
```html
<link href="{{ theme_asset('css/style.css') }}" rel="stylesheet">
```

Veuillez éviter d'utiliser jQuery dans votre thème, car il n'est pas inclus par défaut dans Azuriom et peut être facilement remplacé par du JavaScript natif.

## Configuration

Les thèmes peuvent inclure une configuration, pour permettre aux utilisateurs de personnaliser facilement le thème depuis le panel admin.

La vue pour la configuration est créée dans un fichier Blade nommé `config.blade.php`, situé dans le dossier `config` du thème,
et contient les champs nécessaires à la configuration du thème.
```html
<form action="{{ route('admin.themes.update', $theme) }}" method="POST">
    @csrf

    <div class="form-group">
        <label for="discordInput">{{ trans('theme::messages.discord') }}</label>
        <input type="text" class="form-control @error('discord') is-invalid @enderror" id="discordInput" name="discord" required value="{{ old('discord', theme_config('discord')) }}">

        @error('discord')
        <span class="invalid-feedback" role="alert"><strong>{{ $message }}</strong></span>
        @enderror
    </div>

    <button type="submit" class="btn btn-primary">
        <i class="bi bi-save"></i> {{ trans('messages.actions.save') }}
    </button>
</form>
```

Pour pouvoir sauvegarder la configuration, le formulaire doit être envoyé sur la route `admin.themes.update` avec l'id du thème en paramètre.
La configuration doit être validée via un fichier `rules.php` dans le dossier `config` du thème, qui contient les règles de validation.
```php
<?php

return [
    'discord' => 'required|string',
];
```

Pour définir une configuration par défaut pour le thème, créez un fichier `config.json` à la racine du thème, contenant la configuration par défaut au format JSON.
```json
{
    "discord": "https://azuriom.com/discord"
}
```

Enfin, vous pouvez accéder à la configuration dans vos vues en utilisant la fonction d'aide `theme_config`, qui accepte la clé de en paramètre.
```php
<a href="{{ theme_config('discord') }}">Discord</a>
```

## Traductions

Azuriom est entièrement traduit en plusieurs langues, et les thèmes peuvent également être traduits en utilisant le système de traduction de Laravel.
Les traductions d'un thème sont stockées dans le dossier `lang` du thème, avec un sous-dossier pour chaque langue, contenant les fichiers PHP avec les traductions.

Par exemple, un fichier de traduction en français serait stocké dans `lang/fr/messages.php` :
```php
<?php

return [
    'hello' => 'Bonjour',
];
```

Une traduction peut ensuite être affichée dans une vue en utilisant la fonction `trans` avec le préfixe `theme::` :
```html
<p>{{ trans('theme::messages.hello') }}</p>
```

Pour traduire un booléen, vous pouvez utiliser la fonction `trans_bool`. Par exemple, en français "Oui" ou "Non" sera renvoyé : `{{ trans_bool($boolean) }}`.
Une date peut être formatée avec les fonctions `format_date` ou `format_date_compatct`, qui renvoient la date formatée selon la langue actuelle : `format_date($date)`.

Pour plus d'informations sur les traductions, consultez la [documentation de Laravel](https://laravel.com/docs/localization).

## Fonctions Communes

Azuriom fournit plusieurs fonctions pour faciliter le développement de thèmes et garantir une certaine cohérence sur l'ensemble du site :

| Fonction                                      | Description                                                                                               |
|-----------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| `site_name(): string`                         | Retourne le nom du site tel que défini dans les paramètres                                                |
| `site_logo(): string`                         | Retourne l'URL du logo tel que défini dans les paramètres                                                 |
| `favicon(): string`                           | Retourne l'URL du favicon tel que défini dans les paramètres                                              |
| `format_date(Carbon $carbon): string`         | Formate une date selon la langue actuelle. L'argument `$carbon` doit être une instance de `Carbon\Carbon` |
| `money_name(): string`                        | Retourne le nom de la monnaie du site                                                                     |
| `format_money(float $amount): string`         | Retourne `$amount` formaté avec la monnaie du site                                                        |
| `dark_theme(bool $defaultDark = false): bool` | Retourne `true` si l'utilisateur utilise le thème sombre, et `false` sinon                                |
| `hex2rgb(string $hex): [int, int, int]`       | Convertit la couleur `$hex` en un tableau contenant les valeurs R, G, B sous forme d'`int`                |
| `color_contrast(string $hex): string`         | Retourne `black` ou `white` selon celui qui offre le meilleur contraste pour la couleur `$hex`            |
| `trans(string $key): string`                  | Retourne la traduction correspondant à la clé `$key`                                                      |
| `trans_bool(bool $value): string`             | Retourne la traduction de la valeur booléenne donnée. Renvoie "Oui" ou "Non" en français                  |
| `auth()->user(): \Azuriom\Models\user`        | Retourne l'utilisateur connecté sur le site, ou `null` si l'utilisateur n'est pas connecté                |

Laravel fournit de nombreuses fonctions pour faciliter le développement d'un site. Pour plus d'informations, consultez la [documentation de Laravel](https://laravel.com/docs/helpers).

## Directives Blade

Azuriom et Laravel fournissent plusieurs directives Blade pour faciliter le développement de thèmes :

| Directive                               | Description                                                                        |
|-----------------------------------------|------------------------------------------------------------------------------------|
| `@plugin('<plugin id>') ... @endplugin` | Inclut le code contenu uniquement si le plugin avec l'id spécifié est activé       |
| `@route('<route>') ... @endroute`       | Inclut le code contenu uniquement sur la route spécifiée                           |
| `@auth ... @endauth`                    | Inclut le code contenu uniquement si l'utilisateur est connecté sur le site        |
| `@guest ... @endguest`                  | Inclut le code contenu uniquement si l'utilisateur n'est pas connecté              |
| `@can('<permission>') ... @endcan`      | Inclut le code contenu uniquement si l'utilisateur dispose de la permission donnée |
