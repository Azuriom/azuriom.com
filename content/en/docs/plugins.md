---
title: Plugins
weight: 5
---

# Plugin Development

## Introduction

Plugins are the key to extending the functionality of Azuriom. They allow you to add new features to your website, such as a store, a forum or a support system.
Dozens of plugins are available on the market, yet you can also create your own to customize your site.

{{< info >}}
Installing Azuriom locally is highly recommended to simplify plugin development.
When installed locally, you can enable debug mode for easier development by editing the following lines in the `.env` file:
```env
APP_ENV=local
APP_DEBUG=true
```
{{< /info >}}

Since Azuriom is based on [Laravel](https://laravel.com/), it is recommended to consult the
[Laravel documentation](https://laravel.com/docs/) to understand how the framework works.

## Creating a Plugin

The recommended way to create a plugin is to use the following command, which generates the required files:
```sh
php artisan plugin:create <plugin name>
```

## Plugin Structure

```
plugins/  <-- Folder containing the installed plugins
|  example/  <-- ID of the plugin
|  |  plugin.json  <-- The file containing the plugin information
|  |  assets/  <-- The folder containing the plugin assets (CSS, JS, images, etc.)
|  |  database/
|  |  | migrations/ <-- The folder containing the migrations of the plugin
|  |  resources/
|  |  |  lang/  <-- The folder containing the translations of the plugin
|  |  |  views/  <-- The folder containing the views of the plugin
|  |  routes/ <-- The folder containing the routes of the plugin
|  |  src/ <-- The folder containing the controllers, models, etc. of the plugin
```

### `plugin.json` file

A plugin must include a `plugin.json` file at the root of its directory, containing the basic information about the plugin:
```json
{
    "id": "example",
    "name": "Example",
    "version": "1.0.0",
    "description": "A great plugin.",
    "url": "https://azuriom.com",
    "authors": [
        "Azuriom"
    ],
    "azuriom_api": "1.2.0",
    "providers": [
        "\\Azuriom\\Plugin\\Example\\Providers\\ExampleServiceProvider",
        "\\Azuriom\\ Plugin\\Example\\Providers\\RouteServiceProvider"
    ]
}
```

The `providers` section allows you to specify the plugin’s service providers, which will be loaded during Laravel’s initialization.

#### Identifier

A plugin must have a unique id consisting only of numbers, lowercase letters, and hyphens.
This id is used to identify the plugin within the system and must match the plugin’s folder name.
For example, a plugin named `Hello World` might have the id `hello-world`.

{{< info >}}
The plugin must be placed in a folder with the same name as the plugin ID, located inside the `plugins` directory.
{{< /info >}}

#### Dependencies

If your plugin depends on other plugins, list their ids in the `dependencies` section of the `plugin.json` file.
Optional dependencies can be specified by appending a `?` to the plugin id.
The version of a dependency is specified using the [Composer version constraint](https://getcomposer.org/doc/articles/versions.md) format.
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

Routes serve as the entry points for a plugin, defining the various URLs that lead to it.
You can find more information about routes in the [Laravel documentation](https://laravel.com/docs/routing).

By default, three route files are available in the `routes` folder:
* `web.php` for the main routes of the plugin
* `api.php` for the API routes of the plugin
* `admin.php` for the admin routes of the plugin, dedicated to the administration dashboard

{{< warn >}}
Routes with closures are not recommended, as they prevent caching and result in slower performance.
{{< /warn >}}

## Views

Views are the templates for a plugin; they define the structure of the HTML pages presented to the user.
Azuriom is based on Laravel, and uses the Blade template engine to create views.
You can find more information on Blade in the [Blade documentation](https://laravel.com/docs/blade).

To render a view, the `view('<view name>')` function is used.

Views are located in the plugin’s `resources/views` folder, must use the `.blade.php` extension,
and should extend the `layouts.app` layout (the default layout of Azuriom).
The main content of the view should be placed in the `content` section, like this:

```html
@extends('layouts.app')

@section('title', 'Page name')

@section('content')
    <div class="container content">
        <h1>A title</h1>

        <p>A text</p>
    </div>
@endsection
```

### Assets

Assets (CSS, JS, images, etc.) are located in the `assets/` folder,
and can be accessed using the `plugin_asset('<plugin id>', '<asset path>')` function.

Assets can be included on the page via a [Blade stack](https://laravel.com/docs/blade#stacks).
in three different places on the page depending on the type of asset:
* `styles` for CSS files (located in the `<head>`)
* `scripts` for JS files (located in the `<head>`, don't forget to add the `defer` attribute
  to the script, so they do not block the page rendering)
* `footer-scripts` for JS files (located at the end of the `<body>`)

Example:
```html
@push('scripts')
    <script src="{{ plugin_asset('vote', 'js/vote.js') }}" defer></script>
@endpush
```

## Controllers

Controllers contain the logic of a plugin; they define the behavior for its various routes,
process requests, and return responses (such as a view or a JSON response).
You can find more information about controllers in the [Laravel documentation](https://laravel.com/docs/controllers).

Controllers should be located in the `src/Controllers` folder of the plugin,
and extend the `Azuriom\Http\Controllers\Controller` class. A controller's methods
return a response, such as a view or a JSON response, like this:

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
        // Retrieve all the tickets
        $tickets = Ticket::all();

        // Returns the view with the tickets
        return view('support::tickets.index', ['tickets' => $tickets]);
    }
}
```

## Models

Models represent the data of a plugin and define the structure of its database tables.

Azuriom is based on Laravel, and uses the Eloquent ORM to interact with the database.
You can find more information about models in the [Laravel documentation](https://laravel.com/docs/eloquent).

Models should be located in the `src/Models` folder of the plugin, and extend the `Illuminate\Database\Eloquent\Model` class.

Eloquent models allow you to interact with the database, define relationships between models, and use attribute mutators, casts, and scopes:
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

### `User` Model

The `User` model represents a user in Azuriom and is located in the `Azuriom\Models` namespace.
The current authenticated user can be retrieved using the `$request->user()` method, which returns an instance of the `Azuriom\Models\User` class,
or `null` if the user is not authenticated. If no request instance is available, the `auth()->user()` helper can be used.

The `name` attribute of the user is used to display the user's name, and the `getAvatar()` method returns the URL of the user's avatar.

{{< warn >}}
Do not use a game-specific images API to obtain the user's avatar. Instead, use the `getAvatar()` method of the `User` model.
{{< /warn >}}

### Built-in traits

Azuriom provides several PHP traits to simplify the creation and management of models.

#### `HasTablePrefix`

The `HasTablePrefix` trait allows you to define a table prefix for a model.
This is a convenient way to avoid conflicts between tables of different plugins.
The table prefix is defined in the `$prefix` property of the model, and should be the plugin id followed by an underscore.

#### `HasUser`

The `HasUser` trait allows you to define a user key for a model, which will automatically be populated with the current authenticated user's id
when creating a new model instance. By default, the user key is `user_id`, but it can be changed by defining the `$userKey` property in the model.

#### `HasMarkdown`

The `HasMarkdown` trait allows you to simplify the use of Markdown in a model.
The rendered content is automatically cached to avoid unnecessary processing,
and the cache is invalidated when the content is updated.

An attribute can be rendered as Markdown by using the `parseMarkdown(string $attribute)`
of the model. For example, to render the `content` attribute as Markdown:

```php
public function parseContent(): string
{
    return $this->parseMarkdown('content');
}
```

#### `HasImage`

The `HasImage` trait allows you to simplify the use of images in a model.
The trait provides methods to store and retrieve images, and automatically deletes the old image when a new one is uploaded,
as well as deleting the image when the model is deleted.

By default, the image name is stored in the `image` attribute, but it can be changed by defining the `$imageKey` property in the model.
The method `imageUrl()` returns the URL of the image (or `null` if no image is set), and `hasImage()` returns whether an image is set as a boolean.

#### `Searchable`

The `Searchable` trait adds a `search` method to the model, based on the attributes defined in the `$searchable` property.
The `$searchable` property should be an array of the attributes that can be searched.
Relationships that also use the `Searchable` trait can be searched using the dot notation.
When using dot notation, `*` can be used to search all the attributes of the related model.

```php
class Ticket extends Model
{
    use Searchable;

    protected $searchable = ['subject', 'author.name', 'category.*'];
}
```

Then models can be searched like this:
```php
$tickets = Ticket::search('search query')->latest()->get();
```

## Service Provider

Service providers serve as the entry points for a plugin; they define the services offered by the plugin.
Azuriom is based on Laravel and uses service providers to register services such as routes, views, and translations.
You can find more information about services providers in the [Laravel documentation](https://laravel.com/docs/providers).

Service providers must be listed in the `providers` section of the `plugins.json`:
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
Service providers are automatically loaded and invoked for all requests—even those that do not require the plugin.
Consequently, it is crucial to keep the `register()` and `boot()` methods as lightweight as possible to avoid performance impacts.
{{< /warn >}}

### Routes Descriptions

Route descriptions indicate the main route of a plugin.
These routes become available when creating or updating a navbar item in the admin panel.

To register a route description, you must use the `RouteDescription::registerRouteDescriptions(array $routes)` method in the `boot()` method of the service provider.
The keys of the array are the route names, and the values are the route display name (description):
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

Then, make sure the `$this->registerRouteDescriptions();` method is called in the `boot()` method of the service provider.

### User Navigation

User navigation items are the links that appear in the user menu when the user is logged in.
A user navigation item can be added in the `userNavigation()` method of the service provider:

```php
/**
 * Return the user navigations routes to register in the user menu.
 *
 * @return array<string, array<string, string>>
 */
protected function userNavigation(): array
{
    return [
        'support' => [ // The unique identifier of the navigation item, like the plugin id
            'route' => 'shop.profile', // The route name
            'name' => trans('shop::messages.payments'), // The name of the navigation item
            'icon' => 'bi bi-cash-coin', // The Bootstrap icon to display
        ],
    ];
}
```

Then, make sure that the `$this->registerUserNavigation();` method is called in the `boot()` method of the service provider.

### Admin Navigation

Admin navigation items are the links that appear in the sidebar of the admin dashboard.
An admin navigation item can be added in the `adminNavigation()` method of the service provider:

```php
/**
 * Return the admin navigations routes to register in the dashboard.
 *
 * @return array<string, array<string, string>>
 */
protected function adminNavigation(): array
{
    return [
        'shop' => [ // The unique identifier of the navigation item, like the plugin id
            'name' => trans('shop::admin.nav.title'), // The name of the navigation item
            'type' => 'dropdown', // The type of the navigation item (dropdown or link). Default is link
            'icon' => 'bi bi-cart', // The Bootstrap icon to display
            'route' => 'shop.admin.*', // For a link, the route name of a link. For a dropdown, the routes that match the dropdown (use * as wildcard)
            'items' => [ // The items of the dropdown, if the type is dropdown
                'shop.admin.settings' => [ // The route name of the dropdown item
                    'name' => trans('shop::admin.nav.settings'), // The name of the dropdown item
                    'permission' => 'shop.settings', // Optional, the permission required to see the item
                ],
            ],
        ],
    ];
}
```

Then, make sure the `$this->registerAdminNavigation();` method is called in the `boot()` method of the service provider.

## Migrations

Migrations provide a way to create and modify the database schema for a plugin.
You can find more information about migrations in the [Laravel documentation](https://laravel.com/docs/migrations).

Migration files are located in the `database/migrations` folder of the plugin, and should extend the `Illuminate\Database\Migrations\Migration` class.

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
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
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('support_tickets');
    }
};
```

## Translations

Azuriom is fully translated into several languages and uses Laravel’s translation system to manage translations.
You can find more information about translations in the [Laravel documentation](https://laravel.com/docs/localization).

Translations of a plugin are stored in the `resources/lang` folder of the plugin, with one directory for each language, in which PHP files with the translations are stored:
```php
<?php

return [
    'hello' => 'Hello',
];
```

A translation can then be displayed in a view using the `trans` function with the plugin id as the translation namespace:
```html
<p>{{ trans('support::messages.hello') }}</p>
```

To translate a boolean, you can use the `trans_bool` function, which returns "Yes" or "No" in English: `trans_bool($boolean)`.
A date can be formatted with the `format_date` or `format_date_compatct` functions, which return the date formatted with the current language: `format_date($date)`.

## Permissions

Permissions control access to specific parts of the site, such as admin panels, pages, or actions.
Permissions are associated with roles and can be configured in the admin panel.

To register permissions, you must use the `Permission::registerPermissions(array $permissions)` method in the `boot()` method of the service provider.
The keys of the array are the permission names, and the values are the translation keys of the permission names:
```php
Permission::registerPermissions([
    'support.settings' => 'support::admin.permissions.settings',
]);
```

Then, you can check if a user has a permission with the `can(string $permission): bool` method of the `User` model, or with the `can:<permission>` middleware in routes.

## Action Logs

Action logs are a way to track a user's actions on the site and are visible in the admin panel under the "Logs" section.

### Automatic Logs

Azuriom automatically logs actions from a model, with the `Loggable` trait.
By default, the `created`, `updated`, and `deleted` events are logged, but you can customize which events are logged by defining the `$logEvents` property in the model.
The models should then be registered in the `boot()` method of the service provider, with the `ActionLog::registerLogModels(array $models, string $transPrefix)` method,
by passing an array of the models to log and the translation prefix which will be used to translate the log messages.

```php
ActionLog::registerLogModels([
    Ticket::class,
], 'support::admin.logs');
```

### Manual Logs

You can also log an action manually using the `ActionLog::log(string $action, ?Model $model = null)` method.
The first argument is the action type to log, and the second argument is the model associated with the log, if any.

Actions types are registered in the `boot()` method of the service provider, with the `ActionLog::registerLogActions(array $actions)` method:
```php
ActionLog::registerLogs([
    'support.tickets.closed' => [
        'icon' => 'credit-card', // The Bootstrap icon to display, without the `bi-` prefix
        'color' => 'check-circle', // A Bootstrap color (primary, secondary, success, danger, warning, info)
        'message' => 'support::admin.logs.tickets.closed', // The translation key of the log message
        'model' => Ticket::class, // The model associated with the log, if any
    ],
]);
```

## Common functions

Azuriom provides several functions to facilitate plugin development and ensure consistency across the website:

| Function                                      | Description                                                                                                    |
|-----------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| `site_name(): string`                         | Return the site name, as defined in the settings                                                               |
| `format_date(Carbon $carbon): string`         | Formats a date according to the current language. The $carbon argument must be an instance of `Carbon\Carbon`  |
| `money_name(): string`                        | Returns the name of the website's currency                                                                     |
| `format_money(float $amount): string`         | Returns `$amount` formatted using the website's currency                                                       |
| `color_contrast(string $hex): string`         | Returns either `#000` (black) or `#fff` (white), whichever provides higher contrast for the given `$hex` color |
| `trans(string $key): string`                  | Return the translation corresponding to the given `$key`                                                       |
| `trans_bool(bool $value): string`             | Returns the translation of the given boolean value. In English, this is 'Yes' or 'No'                          |
| `auth()->user(): \Azuriom\Models\User`        | Returns the authenticated user, or `null` if no user is authenticated                                          |
