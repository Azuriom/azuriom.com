---
title: Plugins
---

# Plugins

## Introdução

Um plugin permite que você adicione novos recursos ao seu site, muitos plugins estão disponíveis em nosso [Mercado](https://market.azuriom.com), e você também pode criar um caso não encontre um que corresponda ao seu precisa.

## Criando um plugin

Antes de criar um plugin, é recomendado que você leia a [documentação do Laravel](https://laravel.com/docs/).

{{< warn >}}
Quando Azuriom é instalado localmente para desenvolvimento de plugin, é altamente recomendável ativar a depuração para simplificar o desenvolvimento. Isso pode ser feito simplesmente editando essas 2 linhas no arquivo `.env`:
```
APP_ENV=local
APP_DEBUG=true
```
{{< /warn >}}

### Estruturando um plugin

```
plugins/  <-- Folder containing the different installed plugins
|  example/  <-- Id of your plugin
|  |  plugin.json  <-- The main file of your theme containing the various information
|  |  assets/  <-- The folder containing the assets of your plugin (css, js, images, svg, etc)
|  |  database/
|  |  | migrations/ <-- The folder containing your plugin's migrations
|  |  resources/
|  |  |  lang/  <-- The folder containing the translations of your plugin
|  |  |  views/  <-- The folder containing the views of your plugin
|  |  routes/ <-- The folder containing the different routes of your plugin
|  |  src/ <-- The folder containing the sources of your plugin
```

### O arquivo plugin.json

O arquivo `plugin.json` é necessário para carregar um plugin e contém as diferentes informações de um plugin:
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
    "azuriom_api": "1.0.0",
    "providers": [
        "\\Azuriom\\Plugin\\Example\\Providers\\ExampleServiceProvider",
        "\\Azuriom\\ Plugin\\Example\\Providers\\RouteServiceProvider"
    ]
}
```

#### Plugin ID

Cada plugin deve ter um id, que deve ser único e conter apenas números, letras minúsculas e hífens. Recomenda-se usar o nome como base para a criação do id, por exemplo, se o nome for `Hello World`, o id pode ser `hello-world`. Além disso, o diretório do plugin deve ter o mesmo nome de seu id.

{{< info >}}
Para criar um plugin você pode usar o seguinte comando que irá gerar automaticamente a pasta do plugin e muitos arquivos por padrão:
```
php artisan plugin:create <plugin name>
```
{{< /info >}}

#### Dependências

A seção `dependencies` permite que você especifique os plugins (usando seu id) que devem ser instalados para usar o plugin. Um `?` após o nome do plugin significa que o plugin é opcional, ou seja, não precisa ser instalado, mas quando for, a versão deve corresponder. Também é possível especificar uma versão do Azuriom usando o valor `azuriom`.

Por exemplo, este plugin precisa do Azuriom `0.4.0` ou superior, da versão do plugin Shop `0.1.0` ou superior. Além disso, quando o plugin Vote estiver instalado, ele deve estar na versão `0.2.0` ou superior:
```json
"dependencies": {
    "azuriom": "^0.4.0",
    "shop": "^0.1.0",
    "vote?": "^0.2.0"
}
```

### Routes

As routes permitem que você associe uma URL a uma ação específica.

Eles são armazenados no diretório `routes' na raiz do plugin.

Para obter mais informações sobre como as routes funcionam, você pode ler a [documentação do Laravel](https://laravel.com/docs/routing).

Exemplo:
```php
Route::get('/support', 'SupportController@index')->name('index');
```

{{< warn >}}
Tenha cuidado para não usar rotas com fechamentos, pois elas não são compatíveis com algumas otimizações internas.
{{< /warn >}}

#### Admin routes
 
Para uma route estar no painel de administração, basta colocá-la no arquivo `routes/admin.php` do plugin.

### Views

As views são a parte visível de um plugin, são os arquivos de conteúdo HTML do plugin para exibir uma página.

Azuriom usando [Laravel](https://laravel.com/), as views podem ser feitas usando o Blade. Se você não domina o Blade, é altamente recomendável ler [sua documentação](https://laravel.com/docs/blade), especialmente porque é bastante curto.

{{< warn >}}
É altamente recomendável NÃO usar a sintaxe do PHP. quando você trabalha com o Blade, porque o Blade não traz o tradicional sem vantagens e apenas desvantagens.
{{< /warn >}}

To display a view you can use `view('<plugin id>::<name of the view>')`, of example `view('support::tickets.index')` to display the `tickets.index` view of the support plugin.

To define the layout of the page, it is necessary that the view extends the view containing the layout, you can either use the default layout (or the theme layout if there is one) with `@extends('layouts.app')`, or create your own layout and extend it.

Then put all the main content into the `content` section, and the title of the page in the `title` section.

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

#### Assets

The assets (CSS, JS, images, etc.) are located in the `assets/` folder and can be used with the `plugin_asset('<plugin id>', '<asset path>')` function.

Assets can be included in the page via a [Blade stack](https://laravel.com/docs/blade#stacks). in 2 different places on the page depending on the type of asset:
* `styles` for CSS files (located in the `<head>`)
* `scripts` for JS files (located in the `<head>`, don't forget to add the `defer` attribute to the script, so they do not block the page rendering)

Example:
```html
@push('scripts')
    <script src="{{ plugin_asset('vote', 'js/vote.js') }}" defer></script>
@endpush
```

#### Admin View

For a page to use the admin panel layout, just use the layout `admin.layouts.admin`, it is also recommended creating an admin folder in the `resources` folder and put the admin views in it.

### Controllers

Controllers are a central part of a plugin, they are located in the folder `src/Controllers` at the root of the plugin, and they take care of to transform a request into the answer that will be sent back to the user.

For more information on how the controllers work you can read the [Laravel documentation](https://laravel.com/docs/controllers).

example:
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
        // We're picking up all the tickets
        $tickets = Ticket::all();

        // We're return a view, pass him the tickets...
        return view('support::tickets.index', [
            'tickets' => $tickets,
        ]);
    }
}
```

### Models

Templates represent an entry in a database table, and allow you to interact with the database.

You can also define in a model the different relationships of the model, For example, a `ticket` can have a `user` and a `category`, and have `comments`.

You can find more information about models (also called Eloquent on Laravel) in the [Laravel documentation](https://laravel.com/docs/eloquent).

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

The service providers are the heart of a plugin, they are called at the initialization stage. Of Laravel, and allow to save the different parts of a plugin (views, translations, middlewares, dependencies, etc.).

Service providers must be added to the `providers` part of the `plugins.json`:
```json
{
    "providers": [
        "\\Azuriom\\Plugin\\Support\\Providers\\SupportServiceProvider"
    ]
}
```

You can find more information about the services provided in the [Laravel documentation](https://laravel.com/docs/providers).

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

### Dependencies

Within your plugin directory run your usual composer require command.

Then add `require_once __DIR__.'/../../vendor/autoload.php';` to the register method of the service provider of the plugin.

{{< warn >}}Make sure that the dependencies you require are not already provided by Azuriom to avoid versions conflicts and errors.{{< /warn >}}

### Migration

Migrations allow you to create, modify or delete tables in the database. data, they can be found in the `database/migrations` folder.

You can use the following command to automatically generate the migration file:
```
php artisan make:migration <migration name> --path plugins/<plugin id>/database/migrations 
```

You can find more information about migrations in the [Laravel documentation](https://laravel.com/docs/migrations).

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
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
};
```

### Translations

Translations allow you to translate a plugin (amazing), they are found at in the `resources/lang` directory at the root of a plugin, in the language folder (`en`, `fr`, etc...).

You can find more information on translations in the [Laravel documentation](https://laravel.com/docs/localization).

To retrieve a translation you can use the `trans('<plugin id>::<filename>.<message>')`, for example `trans('support::messages.tickets.home')` to display the `tickets.home` message, in the `messages.php` file of the support plugin:
```php
<?php

return [
  'tickets' => [
    'home' => 'Your tickets',
  ],
];
```

### Navigation

#### Utilisateurs

It is recommended to register the main routes of your plugin so that they can be easily added in the navigation bar. To do this, simply call the `$thiS->registerRouteDescriptions()` method in the plugin provider and return the different routes in the `routeDescriptions()` method with the format 
`[<route> => <description>]`:
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
            'support.tickets.index' => trans('support::messages.title'),
        ];
    }
```

### Admin

To make your plugin's admin pages appear in the navbar of the admin panel, you can register them by calling the method `$this->registerAdminNavigation()` and returning the different routes in the `adminNavigation()` method.
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
                'name' => trans('support::admin.title'), // Translation of the tab name
                'icon' => 'bi bi-joystick', // Bootstrap Icons icon
                'route' => 'support.admin.tickets.index', // Page's route
                'permission' => 'support.tickets', // (Optional) Permission required to view this page
            ],
        ];
    }
```
