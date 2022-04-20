---
title: Azuriom 1.0
---

# Azuriom 1.0

## Introduction

Azuriom 1.0 est la nouvelle version majeure d'Azuriom, elle contient de nombreux changements et a pour objectif de permettre 
à Azuriom de rester nouvelle génération.

Cette mise à jour contient de nombreux changements internes, en particulier l'utilisation de Laravel 9
([Laravel](https://laravel.com/) étant le framework PHP - la base - utilisé par Azuriom) et de Bootstrap 5
([Bootstrap](https://getbootstrap.com/) étant le framework CSS utilisé par Azuriom).

### PHP 8

En particulier, l'utilisation de Laravel 9 fait que **PHP 8 est maintenant nécessaire pour utiliser Azuriom**.
Nous tenons également à souligner le fait que **PHP 7.4 n'est plus supporté par PHP** depuis novembre 2021 et ne recevra
**plus de mises à jour de sécurité** à partir de novembre 2022 (voir le [site de PHP](https://www.php.net/supported-versions.php)).
Pour cela, nous vous recommandons de mettre à jour dès que possible vos sites utilisant PHP (qu'ils utilisent Azuriom ou non).

### Extensions

Les différents changements internes font que les extensions (thèmes et plugins) vont devoir être mises à jour pour supporter
Azuriom v1.0. De même les extensions compatibles avec Azuriom v1.0 ne sont pas compatibles avec les versions antérieures
d'Azuriom.

La structure du design de base du CMS et des plugins a également été entièrement revu, afin de faciliter le développement des thèmes ainsi
que la cohérence générale entre les plugins.

### Refonte du système de connexion

Le système de connexion à Azuriom pour Minecraft a aussi été revu, pour les serveurs Minecraft: Java Edition qui n'acceptent pas les
versions non-officiels du jeu (versions dites « cracks ») ainsi que pour les serveurs Minecraft: Bedrock Edition, il
est maintenant possible de se connecter directement via son compte Microsoft.

Pour les serveurs Minecraft: Java Edition acceptant les versions non-officielles, il est également possible d'automatiser
la création d'un compte sur le site en utilisant AzLink et le plugin [AuthMe reloaded](https://www.spigotmc.org/resources/authmereloaded.6269/).

Ces différents nouveaux systèmes permettent de simplifier la connexion sur le site tout en éliminant le risque d'usurpation d'identité.

Enfin, pour les sites utilisant la connexion Steam, il est possible d'ajouter une adresse e-mail afin de pouvoir recevoir certaines
alertes par mail (par exemple lors d'une réponse sur le plugin support ou lors d'un achat sur la boutique). Cette fonctionnalité
est entièrement optionnelle.

## Mettre à jour

Pour le moment, seuls les nouveaux sites utilisant Azuriom peuvent utiliser Azuriom
v1.0. 

Pour les sites existants, il sera possible de mettre à jour sans réinstaller et sans
perdre de données dans les jours à venir.

## Adaptation d'un thème

Pour les développeurs ayant créé leur thème, Azuriom utilisant maintenant Bootstrap 5, les thèmes vont devoir être adaptés. Nous vous conseillons de regarder le [guide
de migration vers Bootstrap 5](https://getbootstrap.com/docs/5.1/migration/).

Un changement notable de l'utilisation de Bootstrap 5 est que jQuery n'est plus inclus avec Azuriom. Il est également
déconseillé de l'utiliser.

De plus, afin d'améliorer la compatibilité future, nous conseillons également aux thèmes de modifier au minimum l'HTML du CMS et des plugins,
mais d'utiliser au maximum du CSS. Cela évite les problèmes de compatibilité future en cas de mise à jour s'accompagnant d'une modification
de l'HTML ou lors de l'ajout de nouveaux plugins.

{{< warn >}}
Dû à des nombreux problèmes de compatibilité et de thèmes non mis à jour, les thèmes sur le market seront contraint de respecter
cette règle. Il est bien sûr autorisé de modifier la page d'accueil ou le layout, ainsi que quelques pages supplémentaires,
mais il ne sera pas autorisé de modifier toutes les pages et/ou tous les plugins.
{{< /warn >}}

Un message d'accueil configurable depuis le panel admin a également été ajouté et il est recommandé le d'ajouter dans le
fichier `home.blade.php` via la variable `$message`, par exemple :
```html
<div class="card">
    <div class="card-body">
        {{ $message }}
    </div>
</div>
```

Enfin, de nombreuses traductions ont été améliorées et vont devoir être modifiées dans les thèmes.

{{< warn >}}
Pour qu'un thème puise être chargé avec Azuriom v1.0, il est **nécessaire** d'ajouter `"azuriom_api": "1.0.0",` dans le fichier
`theme.json` :
```json
{
  "authors": [
    "..."
  ],
  "azuriom_api": "1.0.0",
  "providers": [
    "..."
  ]
}
```
{{< /warn >}}

### Icônes

FontAwesome 5 a été remplacé par [Bootstrap Icons](https://icons.getbootstrap.com),
il faudra donc remplacer les noms de toutes les icônes en conséquence.

Il faut également remplacer le lien FontAwesome par celui de Bootstrap Icons :
```diff
- <link href="{{ asset('vendor/fontawesome/css/all.min.css') }}" rel="stylesheet">
+ <link href="{{ asset('vendor/bootstrap-icons/bootstrap-icons.css') }}" rel="stylesheet">
```

### Réseaux sociaux

Azuriom dispose maintenant d'une configuration dédiée pour ajouter des liens vers les réseaux sociaux directement depuis
les paramètres. Si vous aviez une configuration équivalente il est fortement recommandé d'utiliser le système fournit par le CMS
à la place.
Au niveau du code, vous pouvez obtenir les différents liens avec la fonction `social_links()` ce qui donne par exemple :
```html
@foreach(social_links() as $link)
    <a href="{{ $link->value }}" title="{{ $link->title }}" target="_blank" rel="noopener noreferrer" class="btn">
        <i class="{{ $link->icon }} fs-2" style="color: {{ $link->color }}"></i>
    </a>
@endforeach
```

### Serveurs sur la page d'accueil

Il est maintenant possible d'afficher des serveurs sur la page d'accueil du site, ce
qui notamment très pratique pour les jeux Steam.
Les serveurs sont disponibles avec la variable `$servers`, ce qui donne par exemple

```html
@if(! $servers->isEmpty())
    <h2 class="text-center">
        {{ trans('messages.servers') }}
    </h2>
    
    <div class="row justify-content-center mb-4">
        @foreach($servers as $server)
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body text-center">
                        <h5>{{ $server->name }}</h5>
    
                        <p>
                            @if($server->isOnline())
                                {{ trans_choice('messages.server.total', $server->getOnlinePlayers(), [
                                    'max' => $server->getMaxPlayers(),
                                ]) }}
                            @else
                                <span class="badge bg-danger text-white">
                                    {{ trans('messages.server.offline') }}
                                </span>
                            @endif
                        </p>
    
                        @if($server->joinUrl())
                            <a href="{{ $server->joinUrl() }}" class="btn btn-primary">
                                {{ trans('messages.server.join') }}
                            </a>
                        @else
                            <p class="card-text">{{ $server->fullAddress() }}</p>
                        @endif
                    </div>
                </div>
            </div>
        @endforeach
    </div>
@endif
```

### URL pour rejoindre les serveurs

Une option a été ajoutée pour afficher un lien permettant de rejoindre le serveur
à la place de l'adresse. C'est particulièrement utile pour les serveurs utilisant un
launcher ou pour les serveurs de certains jeux qui permettent d'avoir une URL pour
se connecter directement. Nous recommandons de remplacer tous les affichages de l'adresse du serveur
par quelque chose comme ça :
```html
@if($server->joinUrl())
    <a href="{{ $server->joinUrl() }}" class="btn btn-primary">
        {{ trans('messages.server.join') }}
    </a>
@else
    {{ $server->fullAddress() }}
@endif
```

## Adaptation d'un plugin

Pour les développeurs ayant créé leur plugin, Azuriom utilisant maintenant Bootstrap 5, les plugins vont devoir être adaptés. Nous vous conseillons de regarder le [guide
de migration vers Bootstrap 5](https://getbootstrap.com/docs/5.1/migration/).

De plus Azuriom utilise maintenant Laravel 9 et PHP 8, nous vous conseillons de regarder [le guide de migration vers
Laravel 9](https://laravel.com/docs/9.x/upgrade).

Bien qu'entièrement optionnel, vous pouvez aussi en profiter pour utiliser
les [nouvelles fonctionnalités introduites dans PHP 8.0](https://www.php.net/releases/8.0/en.php).

{{< warn >}}
Pour qu'un plugin puise être chargé avec Azuriom v1.0, il est **nécessaire** d'ajouter `"azuriom_api": "1.0.0",` dans le fichier
`plugin.json` :
```json
{
  "authors": [
    "..."
  ],
  "azuriom_api": "1.0.0",
  "providers": [
    "..."
  ]
}
```
{{< /warn >}}

### Icônes

FontAwesome 5 a été remplacé par [Bootstrap Icons](https://icons.getbootstrap.com),
il faudra donc remplacer les noms de toutes les icônes en conséquence.

### Service providers

Il est maintenant nécessaire de spécifier explicitement les appels à la fonction `trans` dans les méthodes `routeDescriptions()`,
`userNavigation()` et `adminNavigation()`

Cela donne par exemple les modifications suivantes :
```diff
    protected function routeDescriptions()
    {
        return [
-           'shop.home' => 'shop::messages.title',
+           'shop.home' => trans('shop::messages.title'),
        ];
    }

    // ...

    protected function adminNavigation()
    {
            return [
            'shop' => [
-               'name' => 'shop::admin.nav.title',
+               'name' => trans('shop::admin.nav.title'),
                // ...
                'items' => [
-                   'shop.admin.packages.index' => 'shop::admin.nav.packages',
+                   'shop.admin.packages.index' => trans('shop::admin.nav.packages'),
                    // ...
                ],
            ],
        ];
    }

    // ...

    protected function userNavigation()
    {
        return [
            'shop' => [
                'route' => 'shop.profile',
-               'name' => 'shop::messages.profile.payments',
+               'name' => trans('shop::messages.profile.payments'),
            ],
        ];
    }
```

Les appels à ces méthodes sont maintenant lazy, c'est-à-dire que la méthode ne sera appelée que lors que nécessaire.

Enfin, les méthodes dépréciées dans les anciennes versions d'Azuriom ont toutes été retirées.
