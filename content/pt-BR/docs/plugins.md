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

#### Dependencies

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

Eles são armazenados no diretório `routes` na raiz do plugin.

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

Para exibir uma view, você pode usar `view('<plugin id>::<nome da visualização>')`, por exemplo `view('support::tickets.index')` para exibir o `tickets.index` visualização do plug-in de suporte.

Para definir o layout da página, é necessário que a view estenda a view que contém o layout, você pode usar o layout padrão (ou o layout do tema se houver) com `@extends('layouts.app')`, ou crie seu próprio layout e estenda-o.

Em seguida, coloque todo o conteúdo principal na seção `content` e o título da página na seção `title`.

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

Os assets (CSS, JS, images, etc.) estão localizados na pasta `assets/` e podem ser usados ​​com a função `plugin_asset('<plugin id>', '<asset path>')`.

Os assets podem ser incluídos na página por meio de uma [Blade stack](https://laravel.com/docs/blade#stacks) em 2 lugares diferentes na página, dependendo do tipo de ativo:
* `styles` para arquivos CSS (localizados no `<head>`)
* `scripts` para arquivos JS (localizados no `<head>`, não esqueça de adicionar o atributo `defer` ao script, para que não bloqueiem a renderização da página)

Exemplo:
```html
@push('scripts')
    <script src="{{ plugin_asset('vote', 'js/vote.js') }}" defer></script>
@endpush
```

#### Admin view

Para uma página usar o layout do painel de administração, basta usar o layout `admin.layouts.admin`, também é recomendável criar uma pasta admin na pasta `resources` e colocar as visualizações do administrador nela.

### Controllers

Controllers são a parte central de um plugin, eles estão localizados na pasta `src/Controllers` na raiz do plugin, e eles se encarregam de transformar uma requisição na resposta que será enviada de volta ao usuário.

Para mais informações sobre como os controllers funcionam, você pode ler a [documentação do Laravel](https://laravel.com/docs/controllers).

Exemplo:
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

Os models representam uma entrada em uma tabela de banco de dados e permitem que você interaja com o banco de dados.

Você também pode definir em um modelo os diferentes relacionamentos do modelo. Por exemplo, um `ticket` pode ter um `user` e uma `category`, e ter `comments`.

Você pode encontrar mais informações sobre models (também chamados de Eloquent no Laravel) na [documentação do Laravel](https://laravel.com/docs/eloquent).

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

Os service provider são o coração de um plugin, eles são chamados no estágio de inicialização. Do Laravel, e permite salvar as diferentes partes de um plugin  (views, translations, middlewares, dependencies, etc.).

Os service provider devem ser adicionados à parte `providers` do `plugins.json`:
```json
{
    "providers": [
        "\\Azuriom\\Plugin\\Support\\Providers\\SupportServiceProvider"
    ]
}
```

Você pode encontrar mais informações sobre os service provider na [documentação do Laravel](https://laravel.com/docs/providers).

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

### Dependências

Dentro do seu diretório de plugins, execute seu comando usual composer require.

Em seguida, adicione `require_once __DIR__.'/../../vendor/autoload.php';` ao método register do provedor de serviços do plugin.

{{< warn >}}
Certifique-se de que as dependências que você precisa não são fornecidas pela Azuriom para evitar conflitos de versões e erros.
{{< /warn >}}

### Migration

As migrations permitem criar, modificar ou excluir tabelas no banco de dados. data, eles podem ser encontrados na pasta `database/migrations`.

Você pode usar o seguinte comando para gerar automaticamente o arquivo de migration:
```
php artisan make:migration <migration name> --path plugins/<plugin id>/database/migrations 
```

Você pode encontrar mais informações sobre migrations na [documentação do Laravel](https://laravel.com/docs/migrations).

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

### Traduções

As traduções permitem que você traduza um plugin (incrível), elas são encontradas no diretório `resources/lang` na raiz de um plugin, na pasta do idioma (`en`, `fr`, etc...).

Você pode encontrar mais informações sobre traduções na [documentação do Laravel](https://laravel.com/docs/localization).

Para recuperar uma tradução, você pode usar o `trans('<plugin id>::<filename>.<message>')`, por exemplo `trans('support::messages.tickets.home')` para exibir o ` tickets.home`, no arquivo `messages.php` do plugin de suporte:
```php
<?php

return [
  'tickets' => [
    'home' => 'Your tickets',
  ],
];
```

### Barra de navegação

#### Usuários

Recomenda-se cadastrar as rotas principais do seu plugin para que possam ser facilmente adicionadas na barra de navegação. Para fazer isso, simplesmente chame o método `$thiS->registerRouteDescriptions()` no provedor do plugin e retorne as diferentes routes no método `routeDescriptions()` com o formato`[<route> => <description>]`:
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

Para fazer com que as páginas de administração do seu plugin apareçam na barra de navegação do painel de administração, você pode registrá-las chamando o método `$this->registerAdminNavigation()` e retornando as diferentes routes no método `adminNavigation()`.
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
