---
title: Plugins
---

# Plugins

## Introduction

Un plugin vous permet d'ajouter de nouvelles fonctionnalités à votre site, de
nombreux plugins sont disponibles sur notre [Market](https://market.azuriom.com)
mais vous pouvez en créer un si vous n'en trouvez pas un qui correspond à vos
besoins.

## Création d'un plugin

Avant de créer un plugin, il est recommandé de lire la
[documentation de Laravel](https://laravel.com/docs/).

{{< warn >}}
Lorsqu'Azuriom est installé en local pour du développement de plugin,
il est très fortement recommandé d'activer le debug afin de simplifier le développement.
Cela peut se faire très simplement en modifiant ces 2 lignes dans le fichier `.env` à la
racine du site :
```
APP_ENV=local
APP_DEBUG=true
```
{{< /warn >}}

### Structuration d'un plugin

```
plugins/  <-- Dossier contenant les différents plugins installés
|  example/  <-- Id de votre plugin
|  |  plugin.json  <-- Le fichier principal de votre thème contenant les différentes informations
|  |  assets/  <-- Le dossier contenant les assets de votre plugin (css, js, images, svg, etc)
|  |  database/
|  |  |  migrations/ <-- Le dossier contenant les migrations de votre plugin
|  |  resources/
|  |  |  lang/  <-- Le dossier contenant les traductions de votre plugin
|  |  |  views/  <-- Le dossier contenant les vues de votre plugin
|  |  routes/ <-- Le dossier contenant les différents routes de votre plugin
|  |  src/ <-- Le dossier contenant les sources de votre plugin
```

### Le fichier plugin.json

Le fichier `plugin.json` est indispensable pour charger un plugin, et
contient les différentes informations d'un plugin :
```json
{
    "id": "exemple",
    "name": "Exemple",
    "version": "1.0.0",
    "description": "Un super plugin",
    "url" : "https://azuriom.com",
    "authors": [
        "Azuriom"
    ],
    "providers": [
        "\\Azuriom\\Plugin\\Exemple\\Providers\\ExempleServiceProvider",
        "\\Azuriom\\Plugin\\Exemple\\Providers\\RouteServiceProvider"
    ]
}
```

{{< info >}}
Pour créer un plugin vous pouvez utiliser la commande suivante qui va
générer automatiquement le dossier du plugin ainsi que de nombreux fichiers par
défaut :
```
php artisan plugin:create <nom du plugin>
```
{{< /info >}}

#### ID du plugin

Chaque plugin doit posséder un id, qui doit être unique et qui doit contenir seulement
des chiffres, des lettres minuscules et des tirets. Il est recommandé de se baser pour
le nom pour créer l'id, par exemple si le nom est `Hello World`, l'id pourra être
`hello-world`.
Également le dossier du plugin doit avoir le même nom que son id.

#### Dépendances

La partie `dependencies` permet de spécifier les plugins (en utilisant leur id)
qui doivent être installés pour pouvoir utiliser le plugin.
Un `?` après le nom du plugin signifie que le plugin est optionnel, c’est-à-dire que
celui-ci n’a pas besoin d’être installé, mais que lorsqu’il l’est, la version doit correspondre.
Il est également possible de spécifier une version d’Azuriom en utilisant la valeur `azuriom`.

Par exemple, ce plugin a besoin d’Azuriom `0.4.0` ou supérieur, du plugin Shop version`0.1.0`
ou supérieur. Enfin, lorsque le plugin Vote est installé, celui-ci doit être en version `0.2.0` ou plus récent:
```json
"dependencies": {
    "azuriom": "^0.4.0",
    "shop": "^0.1.0",
    "vote?": "^0.2.0"
}
```

### Routes

Les routes permettent d'associer une URL à une action en particulier.

Elles sont enregistrées dans le dossier `routes` à la racine du plugin.

Pour plus d'informations sur le fonctionnement des routes vous pouvez lire la
[documentation de Laravel](https://laravel.com/docs/routing).

Exemple :
```php
Route::get('/support', 'SupportController@index')->name('index');
```

{{< warn >}}
Veuillez faire attention à ne pas utiliser de routes avec des closures,
car celles-ci ne sont pas compatibles avec certaines optimisations du CMS.
{{< /warn >}}

#### Assets

Les assets (CSS, JS, images, etc) se trouvent dans le dossier `assets/` et peuvent
être utilisés avec la fonction `plugin_asset('<id du plugin>', '<chemin de l asset>')`.

Les assets peuvent être inclus dans la page via une [stack Blade](https://laravel.com/docs/blade#stacks)
à 2 endroits différents de la page selon le type de l'asset :
* `styles` pour les fichiers CSS (situé dans le `<head>`)
* `scripts` pour les fichiers JS (situé dans le `<head>`, ne pas oublier d'ajouter l'attribut `defer`
  aux scripts afin qu'ils ne bloquent pas le rendu de la page)

Ce qui donne par exemple :
```html
@push('scripts')
    <script src="{{ plugin_asset('vote', 'js/vote.js') }}" defer></script>
@endpush
```

#### Routes admin
 
 Pour qu'une route soit dans le panel admin, il suffit de la placer dans le fichier
 `routes/admin.php` du plugin.

### Vues

Les vues sont la partie visible d'un plugin, ce sont les fichiers content l'HTML
du plugin pour afficher une page.

Azuriom utilisant [Laravel](https://laravel.com/), les vues peuvent être faites en utilisant le moteur
de template Blade. Si vous ne maitrisez pas Blade il est très vivement recommandé
de lire [sa documentation](https://laravel.com/docs/blade), d'autant plus que celle-ci est assez courte.

{{< warn >}}
Il est très vivement recommandé de ne PAS utiliser la syntaxe PHP
traditionnelle lorsque vous travaillez avec Blade, en effet celle-ci n'apporte
aucun avantage et seulement des inconvénients.
{{< /warn >}}

Pour afficher une vue vous pouvez utiliser `view('<id du plugin>::<nom de la vue>')`,
par exemple `view('support::tickets.index')` pour afficher la vue `tickets.index`
du plugin support.

Pour définir le layout de la page, il faut que la vue étende la vue contenant
le layout, vous pouvez soit utiliser le layout par défaut (ou du thème s’il y en a)
avec `@extends('layouts.app')`, soit créer votre propre layout et l'étendre.

Ensuite il faudra mettre tout le contenu principal au sein de la section `content`,
et le titre de la page dans la section `title`.

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

#### Vue admin

Pour qu'une page utilise le layout du panel admin il suffit d'utiliser le layout
`admin.layouts.admin`, il est également recommandé de créer un dossier admin
dans le dossier `resources` et d'y placer les vues admin dedans.

### Contrôleurs

Les contrôleurs sont une partie centrale d'un plugin, ils se trouvent dans le dossier
`src/Controllers` à la racine du plugin et c'est eux qui s'occupent
de transformer une requête en la réponse qui sera renvoyée à l'utilisateur.

Pour plus d'informations sur le fonctionnement des contrôleurs vous pouvez lire la
[documentation de Laravel](https://laravel.com/docs/controllers).

Exemple :
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
        // On récupère l'ensemble des tickets
        $tickets = Ticket::all();

        // On retourne une vue, en lui passant les tickets
        return view('support::tickets.index', [
            'tickets' => $tickets,
        ]);
    }
}
```

### Modèles

Les modèles représentent une entrée dans une table de la base de données, et permettent
d'interagir avec la base de données.

Vous pouvez également définir dans un modèle les différentes relations de celui-ci,
par exemple un `ticket` peut avoir un `user` et une `category`, et avoir des `comments`.

Vous pouvez trouver plus d'informations sur les modèles (aussi appelés Eloquent sur Laravel) dans la
[documentation de Laravel](https://laravel.com/docs/eloquent).

Exemple :
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

### Service Provider

Les services providers sont le cœur d'un plugin, ils sont appelés à l'initialisation
de Laravel, et permettent d'enregistrer les différentes parties d'un plugin (vues, traductions, middlewares, librairies, etc).

Les services providers doivent être ajoutés dans la partie `providers` du `plugins.json`.

Exemple :
```json
{
    "providers": [
        "\\Azuriom\\Plugin\\Support\\Providers\\SupportServiceProvider"
    ]
}
```

Vous pouvez trouver plus d'informations sur les services providers dans la
[documentation de Laravel](https://laravel.com/docs/providers).

```php
<?php

namespace Azuriom\Plugin\Support\Providers;

use Azuriom\Extensions\Plugin\BasePluginServiceProvider;

class SupportServiceProvider extends BasePluginServiceProvider
{
    /**
     * Register any plugin services.
     *
     * @return void
     */
    public function register()
    {
        $this->registerMiddlewares();

        //
    }

    /**
     * Bootstrap any plugin services.
     *
     * @return void
     */
    public function boot()
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

### Librairies

Pour ajouter une libraire Composer, dans le dossier de votre plugin, exécutez la commande Composer pour installer une librairie composer.

Puis ajoutez `require_once __DIR__.'/../../vendor/autoload.php';` à la méthode `register` du service provider de votre plugin.

{{< warn >}}Verifiez que les librairies que vous ajoutez ne sont pas déjà incluses dans Azuriom afin d'éviter des conflits entre les versions et des erreurs.{{< /warn >}}

### Migrations

Les migrations permettent de créer, modifier ou supprimer des tables dans la base
de données, elles se trouvent dans le dossier `database/migrations`.

Vous pouvez trouver plus d'informations sur les migrations dans la
[documentation de Laravel](https://laravel.com/docs/migrations).

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSupportTicketsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
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
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('support_tickets');
    }
}
```

### Traductions

Les traductions permettent de traduire un plugin (incroyable), elles se trouvent
dans le dossier `resources/lang` à la racine d'un plugin, dans le dossier de la 
langue (`en`, `fr`, etc).

Vous pouvez trouver plus d'informations sur les traductions dans la
[documentation de Laravel](https://laravel.com/docs/localization).

Pour récupérer une traduction vous pouvez utiliser la fonction
`trans('<id du plugin>::<nom du fichier>.<message>')`, par exemple
`trans('support::messages.tickets.home')` pour afficher le message `tickets.home`,
dans le fichier `messages.php` du plugin support :
```php
<?php

return [
  'tickets' => [
    'home' => 'Vos tickets',
  ],
];
```

### Navigation

#### Utilisateurs

Il est recommandé d'enregistrer les routes principales de votre plugin 
afin que celles-ci puissent facilement être ajoutée dans la barre de navigation.
Pour cela il suffit d'appeler la méthode `$thiS->registerRouteDescriptions()`
dans le provider du plugin et de retourner les différentes routes dans la méthode
`routeDescriptions()` au format `[<route> => <description>]` :
```php
    /**
     * Bootstrap any plugin services.
     *
     * @return void
     */
    public function boot()
    {
        // ...

        $this->registerRouteDescriptions();
    }

    /**
     * Returns the routes that should be able to be added to the navbar.
     *
     * @return array
     */
    protected function routeDescriptions()
    {
        return [
            'support.tickets.index' => 'support::messages.title',
        ];
    }
```

### Admin

Pour que les pages d'administration de votre plugin apparaissent dans la barre de
navigation du panel admin, vous pouvez les enregistrer en appelant la méthode
`$this->registerAdminNavigation()` et en retournant les différentes routes dans
la méthode `adminNavigation()` :
```php
    /**
     * Bootstrap any plugin services.
     *
     * @return void
     */
    public function boot()
    {
        // ...

        $this->registerAdminNavigation();
    }

    /**
     * Return the admin navigations routes to register in the dashboard.
     *
     * @return array
     */
    protected function adminNavigation()
    {
        return [
            'support' => [
                'name' => 'support::admin.title', // Traduction du nom de l'onglet
                'icon' => 'fas fa-question', // Icône FontAwesome
                'route' => 'support.admin.tickets.index', // Route de la page
                'permission' => 'support.tickets', // (Optionnel) Permission nécessaire pour voir cet onglet
            ],
        ];
    }
```
