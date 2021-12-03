---
title: Doplňky
---

# Doplňky

## Úvod

Doplněk (plugin) vám umožňuje přidávat nové funkce na váš web, spousta
jich je dostupná v našem [obchodě](https://market.azuriom.com)
ale můžete si vytvořit i vlastní, pokud v obchodě nenajdete takový,
který zrovna potřebujete

## Tvorba doplňku

Před tvorbou doplňku je doporučeno si pročíst
[dokumentaci Laravelu](https://laravel.com/docs/).

{{< warn >}}
Pokud je Azuriom nainstalovám lokálně pro tvorbu doplňků,
je vysoce doporučeno zapnout ladění pro zjednodušení vývoje.
To lze učinit jednoduchým povolením těchto dvou řádků v souboru `.env`:
```
APP_ENV=local
APP_DEBUG=true
```
{{< /warn >}}

### Struktura doplňku

```
plugins/  <-- Složka obsahující všechny nainstalované doplňky
|  example/  <-- ID vašeho doplňku
|  |  plugin.json  <-- Hlavní soubor vašeho doplňku obsahující různé informace
|  |  assets/  <-- Složka obsahující assety vašeho doplňku (css, js, obrázky, svg, atd)
|  |  database/
|  |  | migrations/ <-- Složka obsahující migrace vašeho doplňku
|  |  resources/
|  |  |  lang/  <-- Složka obsahující překlady vašeho doplňku
|  |  |  views/  <-- Složka obsahující views vašeho doplňku
|  |  routes/ <-- Složka obsahující různé cesty (routes) vašeho doplňku
|  |  src/ <-- Složka obsahující zdroje vašeho doplňku
```

### Soubor plugin.json

Soubor `plugin.json` je vyžadován pro načtení doplňku a
obsahuje různé informace o něm:
```json
{
    "id": "priklad",
    "name": "Příklad",
    "version": "1.0.0",
    "description": "Úžasný doplněk.",
    "url": "https://azuriom.com",
    "authors": [
        "Azuriom"
    ],
    "providers": [
        "\\Azuriom\\Plugin\\Example\\Providers\\ExampleServiceProvider",
        "\\Azuriom\\ Plugin\\Example\\Providers\\RouteServiceProvider"
    ]
}
```

#### ID doplňku

Každý doplněk musí mít ID, které musí být unikátní a může obsahovat pouze
čísla, malá písmena a pomlčky. Je doporučeno použít název jako základ pro
tvorbu ID, takže pokud máte například název `Ahoj světe`, ID může být
`ahoj-svete`. Název adresáře doplňku se také musí shodovat s jeho ID.

{{< info >}}
Pro vytvoření doplňku můžete použít následující příkaz, který
automaticky vygeneruje složku doplňku a jeho soubory:
```
php artisan plugin:create <název doplňku>
```
{{< /info >}}

#### Závislosti

Sekce `dependencies` vám umožňuje upřesnit doplňky (jejich ID), které musí být nainstalovány
pro správnou funkčnost doplňku. `?` za názvem doplňku znamená, že doplněk je volitelný,
například že nemusí být nainstalován, ale když bude, jeho verze se musí shodovat.
Je také možné upřesnit verzi Azuriomu pomocí hodnoty `azuriom`.

Tento doplněk například potřebuje Azuriom `0.4.0` nebo vyšší a doplněk Shop verze `0.1.0` nebo
vyšší. Pokud bude navíc nainstalován doplněk Vote, musí mít verzi `0.2.0` nebo vyšší:
```json
"dependencies": {
    "azuriom": "^0.4.0",
    "shop": "^0.1.0",
    "vote?": "^0.2.0"
}
```

### Cesty

Cesty (routes) vám umožňují přiřadit URL k určité akci.

Jsou ukládány v adresáři `routes' v kořenovém adresáři doplňku.
Pro více informací o funkčnosti cest si můžete přečíst
[dokumentaci Laravelu](https://laravel.com/docs/routing).
Příklad:
```php
Route::get('/support', 'SupportController@index')->name('index');
```

{{< warn >}}
Buďte opatrní abyste nepoužili cesty s uzávěry (closures),
protože nejsou kompatibilní s některými interními optimalizacemi.
{{< /warn >}}

#### Administrátorské cesty
 
Aby mohla být cesta ve správcovském panelu, stačí ji dát do souboru `routes/admin.php` doplňku.

### Views

Views jsou viditelné části doplňku, jsou obsahovými soubory HTML
doplňku pro zobrazení stránky.

Azuriom používá [Laravel](https://laravel.com/), views mohou být vytvořeny pomocí Blade.
Pokud neznáte Blade, je vysoce doporučeno přečíst si
[jeho dokumentaci](https://laravel.com/docs/blade), hlavně protože je poměrně krátká.

{{< warn >}}
Je vysoce doporučeno NEPOUŽÍVAT syntaxi PHP
při práci s Blade, protože Blade vám nepřináší
tradiční žádné výhody a pouze nevýhody.
{{< /warn >}}

Chcete-li zobrazit view, můžete použít `view('<plugin id>::<name of the view>')`,
například `view('support::tickets.index')` pro zobrazení view `tickets.index`
doplňku podpory.

Aby bylo možné definovat rozložení stránky, je nutné, aby view rozšiřovalo view obsahující
rozvržení, můžete buď použít výchozí rozvržení (nebo rozvržení tématu, pokud existuje).
pomocí `@extends('layouts.app')`, nebo vytvořit vlastní rozvržení a rozšířit ho.

Poté dejte všechen hlavní obsah do sekce `content`
a název stránky do sekce `title`.

```html
@extends('layouts.app')

@section('title', 'Název stránky')

@section('content')
    <div class="container content">
        <h1>Název</h1>

        <p>Text</p>
    </div>
@endsection
```

#### Assety

Assety (CSS, JS, obrázky, atd) se nachází ve složce `assets/` a mohou
být použity pomocí funkce `plugin_asset('<id doplňku>', '<cesta k assetu>')`.

Assety mohou být zahrnuty ve stránce pomocí [Blade stacku](https://laravel.com/docs/blade#stacks).
na 2 různých místech stránky, podle typu assetu:
* `styles` pro soubory CSS (nacházející se v `<head>`)
* `scripts` pro soubory JS (nacházející se v `<head>`, nezapomeňte přidat atributu `defer`
  do skriptu, aby nebylo blokováno renderování stránky)

Příklad:
```html
@push('scripts')
    <script src="{{ plugin_asset('vote', 'js/vote.js') }}" defer></script>
@endpush
```

#### Administrátorská views

Aby stránka používala rozložení správcovského panelu, stačí použít rozvržení
`admin.layouts.admin`, je také doporučeno vytvořit složku admin
ve složce `resources` a dát do ní administrátorská views.

### Controllery

Controlerry jsou základní částí doplňku, nachází se ve složce
`src/Controllers` v kořenovém adresáři doplňku a starají se o
transformaci žádosti do odpovědi, která bude odeslána zpět uživateli.

Další informace o funkčnosti controllerů lze nalézt v
[dokumentaci Laravelu](https://laravel.com/docs/controllers).

Příklad:
```php
<?php
namespace Azuriom\Plugin\Support\Controllers;
use Azuriom\Http\Controllers\Controller;
use Azuriom\Plugin\Support\Models\Ticket;
class TicketController extends Controller
{
    /**
     * Zobrazit listing zdroje.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Sbíráme všechny tickety
        $tickets = Ticket::all();
        // Vrátíme view, dáme mu tickety...
        return view('support::tickets.index', [
            'tickets' => $tickets,
        ]);
    }
}
```

### Modely

Šablony reprezentují vstup v databázové tabulce a umožňují vám interagovat
s databází.

V modelu můžete také nadefinovat různé vztahy modelu,
například `ticket` může mít `user` a `category`, a mít `comments`.

Další informace o modelech (také nazývaných Eloquent v Laravelu) lze nalézt v
[dokumentaci Laravelu](https://laravel.com/docs/eloquent).

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
     * Předpona tabulky přidružená k modelu.
     *
     * @var string
     */
    protected $prefix = 'support_';
    /**
     * Atributy, které jsou masově přiřaditelné.
     *
     * @var array
     */
    protected $fillable = [
        'subject', 'category_id',
    ];
    /**
     * Uživatelský klíč přidružený k tomuto modelu.
     *
     * @var string
     */
    protected $userKey = 'author_id';
    /**
     * Získat uživatele, který vytvořil tento ticket.
     */
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
    /**
     * Získat kategorii tohoto ticketu.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    /**
     * Získat komentáře tohoto ticketu.
     */
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
```

### Service providery

Service providery jsou srdcem doplňku, jsou voláni ve fázi inicializace
Laravelu a umožňují ukládat rúzné části doplňku (views, překlady, middlewares, závislosti, atd).

Service providery musí být přidány do části `providers` souboru `plugins.json`:
```json
{
    "providers": [
        "\\Azuriom\\Plugin\\Support\\Providers\\SupportServiceProvider"
    ]
}
```

Další informace o service providerech lze nalézt v
[dokumentaci Laravelu](https://laravel.com/docs/providers).

```php
<?php
namespace Azuriom\Plugin\Support\Providers;
use Azuriom\Extensions\Plugin\BasePluginServiceProvider;
class SupportServiceProvider extends BasePluginServiceProvider
{
    /**
     * Zaregistrovat všechny služby doplňku.
     *
     * @return void
     */
    public function register()
    {
        $this->registerMiddlewares();
        //
    }
    /**
     * Booststrapnout všechny služby doplňku.
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

### Závislosti

V adresáři vašeho doplňku spusťte váš obvyklý příkaz composer require.
Poté přidejte `require_once __DIR__.'/../../vendor/autoload.php';` do registrační metody service provideru doplňku.

{{< warn >}}Ujistěte se, že závislosti, které vyžadujete, již nejsou poskytnuty Azuriomem pro zabránění konfliktů verzí a chybám.{{< /warn >}}

### Migrace

Migrace vám umožňují vytvářet, upravovat nebo mazat tabulky v databázi.
Lze je nalézt ve složce `database/migrations`.

Další informace o migracích lze nalézt v
[dokumentaci Laravelu](https://laravel.com/docs/migrations).

```php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
class CreateSupportTicketsTable extends Migration
{
    /**
     * Spustit migrace.
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
     * Obrátit migrace.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('support_tickets');
    }
}
```

### Překlady

Překlady vám umožňují přeložit doplněk (úžasné) a lze je nalézt v
adresáři `resources/lang` v kořenovém adresáři doplňku v
jazykové složce (`en`, `fr`, atd...).

Další informace o překladech lze nalézt v
[dokumentaci Laravelu](https://laravel.com/docs/localization).

Pro získání překladu můžete použít
`trans('<plugin id>::<filename>.<message>')`, například
`trans('support::messages.tickets.home')` pro zobrazení zprávy `tickets.home`
v souboru `messages.php` doplňku podpory:
```php
<?php
return [
  'tickets' => [
    'home' => 'Vaše tickety',
  ],
];
```

### Navigace

#### Použití

Je doporučeno zaregistrovat hlavní cesty vašeho doplňku, aby mohly být
jednoduše přidány do navigační lišty. Abyste tak učinili, jednoduše zavolejte metodu
`$thiS->registerRouteDescriptions()` v poskytovateli doplňku a vraťte
různé cesty v metodě `routeDescriptions()` s formátem
`[<route> => <description>]`:
```php
    /**
     * Bootstrap všech služeb doplňku.
     *
     * @return void
     */
    public function boot()
    {
        // ...
        $this->registerRouteDescriptions();
    }
    /**
     * Vrátit cesty, které by měly být přidány do navigační lišty.
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

Aby se mohly administrátorské stránky vašeho doplňku objevit v navigační liště,
můžete je zaregistrovat zavoláním metody `$this->registerAdminNavigation()`
a vrácením různých cest v metodě `adminNavigation()`.
```php
    /**
     * Bootstrap všech služeb doplňku.
     *
     * @return void
     */
    public function boot()
    {
        // ...
        $this->registerAdminNavigation();
    }
    /**
     * Vrátit cesty admin navigací pro zaregistrování v panelu.
     *
     * @return array
     */
    protected function adminNavigation()
    {
        return [
            'support' => [
                'name' => 'support::admin.title', // Překlad názvu karty
                'icon' => 'fas fa-question', // FontAwesome ikona
                'route' => 'support.admin.tickets.index', // Cesta ke stránce
                'permission' => 'support.tickets', // (Volitelné) Oprávnění vyžadované k zobrazení této stránky
            ],
        ];
    }
```
