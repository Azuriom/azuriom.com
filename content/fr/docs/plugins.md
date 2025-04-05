---
title: Plugins
weight: 5
---

# Développement de Plugins

## Introduction

Les plugins sont la clé pour rendre votre site Azuriom unique.
Ils permettent d'ajouter de nouvelles fonctionnalités à votre site, telles qu'une boutique, un forum ou un système de support.
Des dizaines de plugins sont disponibles sur le marché, mais vous pouvez également créer vos propres plugins selon vos besoins.

{{< info >}}
L'installation d'Azuriom en locale est fortement recommandée pour simplifier le développement de plugins.
Lorsque Azuriom est installé localement, le mode debug peut être activé en modifiant les lignes suivantes dans
le fichier `.env` :
```env
APP_ENV=local
APP_DEBUG=true
```
{{< /info >}}

Azuriom est basé sur [Laravel](https://laravel.com/), il est donc recommandé de consulter la [documentation de Laravel](https://laravel.com/docs/)
pour comprendre le fonctionnement du framework.

## Création d'un Plugin

La façon recommandée de créer un plugin est en utilisant la commande suivante pour générer les fichiers requis :
```sh
php artisan plugin:create <nom_du_plugin>
```

## Structure du Plugin

```
plugins/  <-- Dossier contenant tous les plugins installés
| example/  <-- Identifiant du plugin
| | plugin.json  <-- Fichier contenant les informations du plugin
| | assets/  <-- Dossier contenant les ressources du plugin (CSS, JS, images, etc.)
| | database/
| | | migrations/  <-- Dossier contenant les migrations du plugin
| | resources/
| | | lang/  <-- Dossier contenant les traductions du plugin
| | | views/  <-- Dossier contenant les vues du plugin
| | routes/  <-- Dossier contenant les routes du plugin
| | src/  <-- Dossier contenant les contrôleurs, modèles, etc. du plugin
```

### Fichier `plugin.json`

Un plugin doit inclure un fichier `plugin.json` à sa racine, contenant les informations de base du plugin :
```json
{
    "id": "example",
    "name": "Example",
    "version": "1.0.0",
    "description": "Un excellent plugin.",
    "url": "https://azuriom.com",
    "authors": [
        "Azuriom"
    ],
    "azuriom_api": "1.2.0",
    "providers": [
        "\\Azuriom\\Plugin\\Example\\Providers\\ExampleServiceProvider",
        "\\Azuriom\\Plugin\\Example\\Providers\\RouteServiceProvider"
    ]
}
```

La section `providers` vous permet de spécifier les service providers, qui seront chargés lors de l'initialisation de Laravel.

#### Identifiant

Un plugin doit avoir un identifiant unique qui ne contient que des chiffres, des lettres minuscules et des tirets.
L'identifiant est utilisé pour identifier le plugin dans le système et doit correspondre au nom du dossier du plugin.
Par exemple, un plugin nommé `Hello World` pourrait avoir l'identifiant `hello-world`.

{{< info >}}
Le dossier dans lequel le plugin est installé doit être nommé avec l'identifiant du plugin.
{{< /info >}}

#### Dépendances

Si votre plugin dépend d'autres plugins, indiquez leurs identifiants dans la section `dependencies` du fichier `plugin.json`.
Les dépendances optionnelles peuvent être spécifiées en ajoutant un `?` à la fin de l'id du plugin.
La version d'une dépendance est indiquée en utilisant le [format de version de Composer](https://getcomposer.org/doc/articles/versions.md).
```json
{
    // ...
    "dependencies": {
      "required-plugin": "^1.0.0",
      "optional-plugin?": "^1.0.0"
    }
}
```

## Routes

Les routes servent de points d'entrée pour un plugin, définissant les différentes URL accessibles.
Pour plus d'informations sur les routes, consultez la [documentation Laravel](https://laravel.com/docs/routing).

Par défaut, trois fichiers de routes sont disponibles dans le dossier `routes` du plugin :
* `web.php` pour les routes principales du plugin
* `api.php` pour les routes API du plugin
* `admin.php` pour les routes d'administration du plugin, dédiées au panel admin

{{< warn >}}
Il est déconseillé d'utiliser des closures dans les routes, car cela empêche la mise en cache et peut impacter les performances.
{{< /warn >}}

## Vues

Les vues définissent la structure des pages HTML affichées à l'utilisateur.
Azuriom est basé sur Laravel et utilise le moteur de templates Blade pour créer les vues.
Pour plus d'informations sur Blade, consultez la [documentation de Blade](https://laravel.com/docs/blade).

Pour afficher une vue, vous pouvez utiliser la fonction `view('<nom_de_la_vue>')`.

Les vues se trouvent dans le dossier `resources/views` du plugin, doivent utiliser l'extension `.blade.php` et doivent utiliser le layout `layouts.app` (le layout par défaut d'Azuriom).
Le contenu principal de la vue doit être placé dans la section `content`, comme ceci :

```html
@extends('layouts.app')

@section('title', 'Nom de la page')

@section('content')
    <div class="container content">
        <h1>Un titre</h1>

        <p>Un texte</p>
    </div>
@endsection
```

### Ressources

Les ressources (CSS, JS, images, etc.) se trouvent dans le dossier `assets/`,
et peuvent être récupérées via la fonction `plugin_asset('<id_du_plugin>', '<chemin_de_la_ressource>')`.

Les ressources peuvent être incluses sur la page via une [stack Blade](https://laravel.com/docs/blade#stacks)
dans trois sections différentes, selon le type de ressource :
* `styles` pour les fichiers CSS (situé dans le `<head>`)
* `scripts` pour les fichiers JS (situé dans le `<head>`, n'oubliez pas d'ajouter l'attribut `defer` pour ne pas bloquer le rendu de la page)
* `footer-scripts` pour les fichiers JS (situé à la fin du `<body>`)

Par exemple :
```html
@push('scripts')
    <script src="{{ plugin_asset('vote', 'js/vote.js') }}" defer></script>
@endpush
```

## Contrôleurs

Les contrôleurs contiennent la logique d'un plugin, ils définissent le comportement de ses différentes routes,
traitent les requêtes et renvoient une réponse (comme une vue ou une réponse JSON).
Pour plus d'informations sur les contrôleurs, consultez la [documentation de Laravel](https://laravel.com/docs/controllers).

Les contrôleurs se situent dans le dossier `src/Controllers` du plugin et étendent de la classe `Azuriom\Http\Controllers\Controller`.
Les différentes méthodes d'un contrôleur renvoient une réponse, par exemple :
```php
<?php

namespace Azuriom\Plugin\Support\Controllers;

use Azuriom\Http\Controllers\Controller;
use Azuriom\Plugin\Support\Models\Ticket;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
   */
    public function index()
    {
        // Nous récupérons tous les tickets
        $tickets = Ticket::all();

        // Nous renvoyons une vue en lui passant les tickets
        return view('support::tickets.index', ['tickets' => $tickets]);
    }
}
```

## Modèles

Les modèles représentent les données d'un plugin et définissent la structure de ses tables dans la base de données.
Azuriom est basé sur Laravel et utilise l'ORM Eloquent pour interagir avec la base de données.
Pour plus d'informations sur les modèles, consultez la [documentation de Laravel](https://laravel.com/docs/eloquent).

Les modèles sont situés dans le dossier `src/Models` du plugin et étendent de la classe `Illuminate\Database\Eloquent\Model`.
Les modèles Eloquent vous permettent d'interagir avec la base de données, de définir des relations entre les modèles, ainsi que d'utiliser des mutateurs d'attributs, des casts et des scopes :
```php
<?php

namespace Azuriom\Plugin\Support\Models;

use Azuriom\Models\Traits\HasTablePrefix;
use Azuriom\Models\Traits\HasUser;
use Azuriom\Models\User;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasTablePrefix;
    use HasUser;

    /**
     * The table prefix associated with the model.
     *
     * @var string
     */
    protected $prefix = 'support_';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'subject', 'category_id',
    ];

    /**
     * The user key associated with this model.
     *
     * @var string
     */
    protected $userKey = 'author_id';

    /**
     * Get the user who created this ticket.
     */
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Get the category of this ticket.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the comments of this ticket.
     */
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
```

### Modèle `User`

Le modèle `User` représente un utilisateur dans Azuriom et se trouve dans le namespace `Azuriom\Models`.
L'utilisateur connecté peut être récupéré en utilisant la méthode `$request->user()`,
qui renvoie une instance de la classe `Azuriom\Models\User`, ou `null` si l'utilisateur n'est pas connecté.

Si aucune instance de la requête n'est disponible, vous pouvez utiliser la fonction `auth()->user()`.
L'attribut `name` de l'utilisateur permet d'obtenir son nom, et la méthode `getAvatar()` renvoie l'URL de son avatar.

{{< warn >}}
N'utilisez pas une API d'image spécifique à un jeu pour obtenir l'avatar de l'utilisateur, et utilisez plutôt la méthode `getAvatar()` du modèle `User`.
{{< /warn >}}

### Traits Disponibles

Azuriom fournit plusieurs traits PHP pour simplifier la création et la gestion des modèles.

#### `HasTablePrefix`

Le trait `HasTablePrefix` permet de définir un préfixe pour la table d'un modèle.
C'est une méthode pratique pour éviter les conflits entre les tables des différents plugins.
Le préfixe de la table est défini dans la propriété `$prefix` du modèle et doit être l'id du plugin suivi d'un underscore.

#### `HasUser`

Le trait `HasUser` permet d'indiquer qu'un modèle possède un utilisateur,
qui sera automatiquement associé à l'utilisateur connecté lors de la création d'une nouvelle instance du modèle.
Par défaut, l'attribut utilisé est `user_id`, mais il peut être modifié en définissant la propriété `$userKey` dans le modèle.

#### `HasMarkdown`

Le trait `HasMarkdown` permet de simplifier l'utilisation du Markdown dans un modèle.
Le contenu est automatiquement mis en cache après le rendu, pour éviter des traitements inutiles,
et le cache est supprimé lorsque le contenu est mis à jour.
Un attribut peut être converti en Markdown en utilisant la méthode `parseMarkdown(string $attribute)` du modèle.
Par exemple, pour convertir l'attribut `content` en Markdown :

```php
public function parseContent(): string
{
  return $this->parseMarkdown('content');
}
```

#### `HasImage`

Le trait `HasImage` permet de simplifier l'utilisation des images dans un modèle.
Il fournit des méthodes pour stocker et récupérer des images, et supprime automatiquement l'ancienne image lorsqu'une nouvelle est transférée, ainsi que lors de la suppression du modèle.
Par défaut, le nom de l'image est stocké dans l'attribut `image`, mais cela peut être modifié en définissant la propriété `$imageKey` du modèle.
La méthode `imageUrl()` renvoie l'URL de l'image (ou `null` si aucune image n'est définie), et `hasImage()` renvoie un booléen indiquant si une image est définie.

#### `Searchable`

Le trait `Searchable` ajoute une méthode `search` au modèle, basée sur les attributs définis dans la propriété `$searchable`.
La propriété `$searchable` doit être un tableau des attributs pouvant être utilisés pour la recherche.
Les relations qui utilisent également le trait `Searchable` peuvent être recherchées en utilisant la notation par points.
Lorsqu'on utilise la notation par points, `*` peut être utilisé pour rechercher dans tous les attributs du modèle lié.
```php
class Ticket extends Model
{
    use Searchable;

    protected $searchable = ['subject', 'author.name', 'category.*'];
}
```

Ensuite, les modèles peuvent être recherchés ainsi :
```php
$tickets = Ticket::search('requête de recherche')->latest()->get();
```

## Services Providers

Les fournisseurs de services (services providers) servent de points d'entrée pour un plugin,
et définissent les services offerts par celui-ci.
Azuriom est basé sur Laravel et utilise des fournisseurs de services pour enregistrer
les routes, vues, traductions, etc.
Pour plus d'informations sur les fournisseurs de services, consultez la
[documentation de Laravel](https://laravel.com/docs/providers).

Les fournisseurs de services doivent être listés dans la section `providers` du fichier `plugin.json` :
```json
{
    "providers": [
        "\\Azuriom\\Plugin\\Support\\Providers\\SupportServiceProvider"
    ]
}
```

```php
<?php

namespace Azuriom\Plugin\Support\Providers;

use Azuriom\Extensions\Plugin\BasePluginServiceProvider;

class SupportServiceProvider extends BasePluginServiceProvider
{
    /**
     * Register any plugin services.
     */
    public function register(): void
    {
        $this->registerMiddlewares();

        //
    }

    /**
     * Bootstrap any plugin services.
     */
    public function boot(): void
    {
        // $this->registerPolicies();

        $this->loadViews();

        $this->loadTranslations();

        $this->loadMigrations();

        $this->registerRouteDescriptions();

        $this->registerAdminNavigation();

        //
    }
}
```

{{< warn >}}
Les fournisseurs de services sont automatiquement chargés et appelés pour toutes les requêtes, même celles qui n'utilisent pas le plugin.
Par conséquent, il est essentiel de garder les méthodes `register()` et `boot()` aussi efficaces que possible afin d'éviter
d'impacter les performances de l'ensemble du site.
{{< /warn >}}

### Descriptions des Routes

Les descriptions de routes indiquent la route principale d'un plugin.
Ces routes seront disponibles lors de la création ou de la mise à jour d'un élément de la barre de navigation
dans le panel d'admin.

Pour ajouter une description de route, vous devez utiliser la méthode `RouteDescription::registerRouteDescriptions(array $routes)`
dans la méthode `boot()` du fournisseur de services du plugin.
Les clés du tableau correspondent aux noms des routes, et les valeurs sont le nom affiché de la route (la description) :
```php
/**
 * Returns the routes that should be able to be added to the navbar.
 *
 * @return array<string, string>
 */
protected function routeDescriptions(): array
{
    return [
        'shop.home' => trans('shop::messages.title'),
    ];
}
```

Ensuite, assurez-vous que la méthode `$this->registerRouteDescriptions();` est appelée
dans la méthode `boot()` du fournisseur de services.

### Navigation Utilisateur

Les éléments de navigation utilisateur sont les liens qui apparaissent dans le menu de l'utilisateur lorsqu'il est connecté.
Un élément de navigation utilisateur peut être ajouté dans la méthode `userNavigation()`
du fournisseur de services du plugin :

```php
/**
 * Return the user navigations routes to register in the user menu.
 *
 * @return array<string, array<string, string>>
 */
protected function userNavigation(): array
{
    return [
        'support' => [ // L'identifiant unique de l'élément de navigation, par exemple l'id du plugin
            'route' => 'shop.profile', // Le nom de la route
            'name' => trans('shop::messages.payments'), // Le nom de l'élément de navigation
            'icon' => 'bi bi-cash-coin', // L'icône Bootstrap à afficher
        ],
    ];
}
```

Ensuite, assurez-vous que la méthode `$this->registerUserNavigation();` est appelée
dans la méthode `boot()` du fournisseur de services.

### Navigation Admin

Les éléments de navigation administrateur sont les liens qui apparaissent dans la
barre latérale du panel admin.
Un élément de navigation administrateur peut être ajouté dans la méthode `adminNavigation()`
du fournisseur de services du plugin :

```php
/**
 * Return the admin navigations routes to register in the dashboard.
 *
 * @return array<string, array<string, string>>
 */
protected function adminNavigation(): array
{
    return [
        'shop' => [ // L'identifiant unique de l'élément de navigation, par exemple l'id du plugin
            'name' => trans('shop::admin.nav.title'), // Le nom de l'élément de navigation
            'type' => 'dropdown', // Le type d'élément de navigation (dropdown ou link). La valeur par défaut est link
            'icon' => 'bi bi-cart', // L'icône Bootstrap à afficher
            'route' => 'shop.admin.*', // Pour un lien, le nom de la route. Pour un dropdown, les routes correspondantes (utilisez * comme joker)
            'items' => [ // Les éléments du dropdown, si le type est dropdown
                'shop.admin.settings' => [ // Le nom de la route de l'élément du dropdown
                    'name' => trans('shop::admin.nav.settings'), // Le nom de l'élément du dropdown
                    'permission' => 'shop.settings', // Optionnel, la permission requise pour voir l'élément
                ],
            ],
        ],
    ];
}
```

Ensuite, assurez-vous que la méthode `$this->registerAdminNavigation();` est appelée
dans la méthode `boot()` du fournisseur de services.

## Migrations

Les migrations permettent de créer et de modifier le schéma de la base de données d'un plugin.
Pour plus d'informations sur les migrations, consultez la [documentation Laravel](https://laravel.com/docs/migrations).

Les fichiers de migration se trouvent dans le dossier `database/migrations` du
plugin et doivent étendre de la classe `Illuminate\Database\Migrations\Migration`.

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Exécute les migrations.
     */
    public function up(): void
    {
        Schema::create('support_tickets', function (Blueprint $table) {
            $table->increments('id');
            $table->string('subject');
            $table->unsignedInteger('author_id');
            $table->unsignedInteger('category_id');
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();

            $table->foreign('author_id')->references('id')->on('users');
            $table->foreign('category_id')->references('id')->on('support_categories');
        });
    }

    /**
     * Annule les migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('support_tickets');
    }
};
```

## Traductions

Azuriom est entièrement traduit en plusieurs langues et utilise le système de traduction de Laravel pour gérer les traductions.
Pour plus d'informations sur les traductions, consultez la [documentation Laravel](https://laravel.com/docs/localization).

Les traductions d'un plugin sont stockées dans le dossier `resources/lang` du plugin, avec un sous-dossier
pour chaque langue, qui contient les fichiers PHP des traductions :
```php
<?php

return [
    'hello' => 'Bonjour',
];
```

Une traduction peut ensuite être affichée dans une vue en utilisant la fonction `trans`
avec l'identifiant du plugin comme espace de noms de traduction :
```html
<p>{{ trans('support::messages.hello') }}</p>
```

Pour traduire un booléen, vous pouvez utiliser la fonction `trans_bool`. Par exemple, en français "Oui" ou "Non" sera renvoyé : `{{ trans_bool($boolean) }}`.
Une date peut être formatée avec les fonctions `format_date` ou `format_date_compatct`, qui renvoient la date formatée selon la langue actuelle : `format_date($date)`.

## Permissions

Les permissions permettent de contrôler l'accès à certaines parties du site, comme le panel administrateur, les pages ou certaines actions.
Les permissions sont associées aux rôles et peuvent être configurées depuis le panel admin.

Pour enregistrer des permissions, vous pouvez utiliser la méthode `Permission::registerPermissions(array $permissions)`
dans la méthode `boot()` du fournisseur de services du plugin.
Les clés du tableau correspondent aux noms des permissions, et les valeurs aux clés de traduction de ces permissions :
```php
Permission::registerPermissions([
    'support.settings' => 'support::admin.permissions.settings',
]);
```

Ensuite, vous pouvez vérifier si un utilisateur dispose d'une permission avec la méthode `can(string $permission): bool` du modèle `User`, ou avec le middleware `can:<permission>` dans les routes.

## Log d'Actions

Les logs d'actions permettent de suivre les actions d'un utilisateur sur le site
et sont visibles dans le panel admin du site, dans la section "Logs".

### Logs Automatiques

Azuriom enregistre automatiquement les actions d'un modèle grâce au trait `Loggable`.
Par défaut, les événements `created`, `updated` et `deleted` sont enregistrés,
mais vous pouvez personnaliser les événements à enregistrer en définissant la propriété `$logEvents` dans le modèle.
Les modèles doivent ensuite être enregistrés dans la méthode `boot()` du fournisseur
de services à l'aide de la méthode `ActionLog::registerLogModels(array $models, string $transPrefix)`,
en passant un tableau des modèles à enregistrer et le préfixe de traduction qui sera utilisé pour traduire les messages de log.

```php
ActionLog::registerLogModels([
    Ticket::class,
], 'support::admin.logs');
```

### Logs Manuels

Vous pouvez également enregistrer une action manuellement avec la méthode
`ActionLog::log(string $action, ?Model $model = null)`.
Le premier argument correspond au type d'action à enregistrer, et le deuxième, s'il existe, au modèle associé au log.

Les types d'actions sont enregistrés dans la méthode `boot()` du fournisseur de
services à l'aide de la méthode `ActionLog::registerLogActions(array $actions)` :
```php
ActionLog::registerLogs([
    'support.tickets.closed' => [
        'icon' => 'credit-card', // L'icône Bootstrap à afficher, sans le préfixe `bi-`
        'color' => 'check-circle', // Une couleur Bootstrap (primary, secondary, success, danger, warning, info)
        'message' => 'support::admin.logs.tickets.closed', // La clé de traduction du message de log
        'model' => Ticket::class, // Le modèle associé au log, le cas échéant
    ],
]);
```

## Fonctions Utiles

Azuriom fournit plusieurs fonctions pour faciliter le développement de plugins et garantir la cohérence sur l'ensemble du site :

| Fonction                                      | Description                                                                                               |
|-----------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| `site_name(): string`                         | Retourne le nom du site tel que défini dans les paramètres                                                |
| `site_logo(): string`                         | Retourne l'URL du logo tel que défini dans les paramètres                                                 |
| `favicon(): string`                           | Retourne l'URL du favicon tel que défini dans les paramètres                                              |
| `format_date(Carbon $carbon): string`         | Formate une date selon la langue actuelle. L'argument `$carbon` doit être une instance de `Carbon\Carbon` |
| `money_name(): string`                        | Retourne le nom de la monnaie du site                                                                     |
| `format_money(float $amount): string`         | Retourne `$amount` formaté avec la monnaie du site                                                        |
| `trans(string $key): string`                  | Retourne la traduction correspondant à la clé `$key`                                                      |
| `trans_bool(bool $value): string`             | Retourne la traduction de la valeur booléenne donnée. Renvoie "Oui" ou "Non" en français                  |
| `auth()->user(): \Azuriom\Models\user`        | Retourne l'utilisateur connecté sur le site, ou `null` si l'utilisateur n'est pas connecté                |
