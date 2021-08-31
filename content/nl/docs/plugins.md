---
title: Plug-ins
---

# Plug-ins

## Introductie

Met een plug-in kunt u nieuwe functies aan uw site toevoegen,
veel plug-ins zijn beschikbaar op onze [Markt](https://market.azuriom.com)
maar u kunt ze ook zelf maken, als u er geen kunt vinden die overeenkomt met uw
behoeften.

## Een plug-in maken

Voordat u een plug-in maakt, is het raadzaam om de
[Laravel documentatie](https://laravel.com/docs/) te lezen.

{{< warn >}}
Wanneer Azuriom lokaal is geïnstalleerd voor de ontwikkeling van plug-ins,
wordt het sterk aanbevolen om foutopsporing in te schakelen om de ontwikkeling te vereenvoudigen.
Dit kan gedaan worden door simpelweg deze 2 regels in het `.env` bestand te bewerken:
```
APP_ENV=local
APP_DEBUG=true
```
{{< /warn >}}

### Een plug-in structureren

```
plugins/  <-- Map met de verschillende geïnstalleerde plug-ins
|  example/  <-- ID van uw plug-in
|  |  plugin.json  <-- Het hoofdbestand van uw plug-in met verschillende informatie
|  |  assets/  <-- De map met de middelen van uw plug-in (css, js, afbeeldingen, svg, etc)
|  |  database/
|  |  | migrations/ <-- De map met de migraties van uw plug-in
|  |  resources/
|  |  |  lang/  <-- De map met de vertalingen van uw plug-in
|  |  |  views/  <-- De map met de webpagina's van uw plug-in
|  |  routes/ <-- De map met de verschillende routes van uw plug-in
|  |  src/ <-- De map met de bronnen van uw plug-in
```

### Het plugin.json bestand

Het bestand `plugin.json` is vereist om een plug-in te laden, en
bevat de verschillende informatie van een plug-in:
```json
{
    "id": "voorbeeld",
    "name": "Voorbeeld",
    "version": "1.0.0",
    "description": "Een geweldige plugin.",
    "url": "https://azuriom.com",
    "authors": [
        "Azuriom"
    ],
    "providers": [
        "\\Azuriom\\Plugin\\Example\\Providers\\ExampleServiceProvider",
        "\\Azuriom\\Plugin\\Example\\Providers\\RouteServiceProvider"
    ]
}
```

#### Plug-in ID

Elke plug-in moet een ID hebben, die uniek moet zijn en alleen cijfers, kleine letters en streepjes mag bevatten,
Het wordt aanbevolen om de naam te gebruiken als basis voor:
Het maken van de ID, bijvoorbeeld als de naam `Hallo Wereld` is, kan de
ID zijn `hallo-wereld`. Ook moet de map van de plug-in dezelfde naam hebben als zijn ID.

{{< info >}}
Om een plug-in te maken, kunt u de volgende opdracht gebruiken die:
automatisch de map van de plug-in en de bestanden standaard.
genereerd:
```
php artisan plugin:create <plugin name>
```
{{< /info >}}

### Routes

Met routes kunt u een URL aan een bepaalde actie koppelen.

Ze worden opgeslagen in de map `routes` in de hoofdmap van de plug-in.

Voor meer informatie over hoe routes werken kun je de
[Laravel documentatie](https://laravel.com/docs/routing) raadplegen.

Voorbeeld:
```php
Route::get('/support', 'SupportController@index')->name('index');
```

{{< warn >}}
Pas op dat u geen routes gebruikt met afsluitingen,
omdat deze niet compatibel zijn met sommige interne optimalisaties.
{{< /warn >}}

#### Beheerdersroutes
 
Om een route in het beheerders-paneel te plaatsen, plaats je deze in het bestand `routes/admin.php` van de plug-in.

### Views

De views zijn het zichtbare deel van een plug-in, het zijn de inhoudsbestanden in HTML
van de plug-in om een pagina weer te geven.

Azuriom gebruikt [Laravel](https://laravel.com/), om views te maken met gebruik van Blade.
Als je Blade niet onder de knie hebt, wordt het ten zeerste aanbevolen om
[de documentatie](https://laravel.com/docs/blade), te lezen, vooral omdat het vrij kort is.

{{< warn >}}
Het wordt ten zeerste aanbevolen om GEEN PHP-syntaxis te gebruiken.
Wanneer je met Blade werkt, want Blade brengt
geen voordelen en alleen nadelen. 
{{< /warn >}}

Om een pagina weer te geven, kun je `view('<plugin id>::<naam van de pagina>')` gebruiken,
van bijvoorbeeld `view('support::tickets.index')` om de pagina `tickets.index` weer te geven
van de ondersteunings plug-in.

Om de lay-out van de pagina te definiëren, is het noodzakelijk dat de pagina uitbreidt met:
de lay-out, kunt u de standaard lay-out gebruiken (of de thema lay-out als die er is)
met `@extends('layouts.app')`, of maak je eigen lay-out en breid deze uit.

Plaats vervolgens alle hoofdinhoud in de sectie `content`,
en de titel van de pagina in het gedeelte `title`.

```html
@extends('layouts.app')

@section('title', 'Pagina naam')

@section('content')
    <div class="container content">
        <h1>Een titel</h1>

        <p>Een tekst</p>
    </div>
@endsection
```

#### Middelen

De middelen (CSS, JS, afbeeldingen, etc) bevinden zich in de `assets/` map en kunnen
worden gebruikt met de functie `plugin_asset('<plugin id>','<asset path>')`.

Middelen kunnen in de pagina worden opgenomen via een [Blade stack](https://laravel.com/docs/blade#stacks).
Op 2 verschillende plaatsen op de pagina, afhankelijk van het type asset:
* `styles` voor CSS-bestanden (bevindt zich in de `<head>`)
* `scripts` voor JS-bestanden (bevindt zich in de `<head>`, vergeet niet
het `defer` attribuut toe te voegen aan het script, zodat ze de pagina weergave niet blokkeren)

Voorbeeld:
```html
@push('scripts')
    <script src="{{ plugin_asset('vote', 'js/vote.js') }}" defer></script>
@endpush
```

#### Beheeders Pagina

Om een pagina de lay-out van het beheerders paneel te laten gebruiken, gebruik je gewoon de lay-out
`admin.layouts.admin`, het wordt ook aanbevolen om een beheerdersmap te maken
in de map `resources` en plaats de beheerders pagina's erin.

### Controllers

Controllers zijn een centraal onderdeel van een plug-in, ze bevinden zich in de map
`src/Controllers` in de hoofdmap van de plug-in, en zij zorgen er voor
om een verzoek om te zetten in het antwoord dat naar de gebruiker wordt teruggestuurd.

Voor meer informatie over de werking van de controllers kunt u de:
[Laravel documentatie](https://laravel.com/docs/controllers) raadplegen.

voorbeeld:
```php
<?php

namespace Azuriom\Plugin\Support\Controllers;

use Azuriom\Http\Controllers\Controller;
use Azuriom\Plugin\Support\Models\Ticket;

class TicketController extends Controller
{
    /**
     * Geef een lijst van de bron weer.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // We halen alle tickets op.
        $tickets = Ticket::all();

        // We geven een overzicht terug, geven de tickets...
        return view('support::tickets.index', [
            'tickets' => $tickets,
        ]);
    }
}
```

### Modellen

modellen vertegenwoordigen een item in een database tabel en
stellen u in staat om te communiceren met de databank.

U kunt in een model ook de verschillende relaties van het model definiëren,
Een `ticket` kan bijvoorbeeld een `user` en een `category` hebben en `comments` hebben.

Meer informatie over modellen (ook wel Eloquent genoemd op Laravel) vind je in de
[Laravel documentatie](https://laravel.com/docs/eloquent).

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
     * Het tabel voorvoegsel dat aan het model is gekoppeld.
     *
     * @var string
     */
    protected $prefix = 'support_';

    /**
     * De attributen die massaal toewijsbaar zijn.
     *
     * @var array
     */
    protected $fillable = [
        'subject', 'category_id',
    ];

    /**
     * De gebruikers sleutel die aan dit model is gekoppeld.
     *
     * @var string
     */
    protected $userKey = 'author_id';

    /**
     * Haal de gebruiker op die deze ticket heeft gemaakt.
     */
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Verkrijg de categorie van deze ticket.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Ontvang de opmerkingen van deze ticket.
     */
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
```

### Dienstverlener

De dienstverleners vormen het hart van een plug-in, ze worden aangeroepen in de initialisatie fase.
Van Laravel, en laat toe om de verschillende delen van een plug-in op te slaan
(pagina's, vertalingen, middlewares, benodigdheden, enz)

Dienstverleners moeten worden toegevoegd aan het `providers`-gedeelte van `plugins.json`:
```json
{
    "providers": [
        "\\Azuriom\\Plugin\\Support\\Providers\\SupportServiceProvider"
    ]
}
```

Meer informatie over de geleverde diensten vindt u in de
[Laravel documentatie](https://laravel.com/docs/providers).

```php
<?php

namespace Azuriom\Plugin\Support\Providers;

use Azuriom\Extensions\Plugin\BasePluginServiceProvider;

class SupportServiceProvider extends BasePluginServiceProvider
{
    /**
     * Registreer eventuele plug-in services.
     *
     * @return void
     */
    public function register()
    {
        $this->registerMiddlewares();

        //
    }

    /**
     * Bootstrap alle plug-in services op.
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

### Benodigdheden

Voer in uw plug-in map uw gebruikelijke opdracht voor componist vereist uit.

Voeg vervolgens `require_once__DIR__.'/../../vendor/autoload.php';`
toe aan de registratie methode van de dienstverlener van de plug-in.

{{< warn >}}
Zorg ervoor dat de vereiste benodigdheden niet al door Azuriom worden geleverd om versie conflicten en fouten te voorkomen.
{{< /warn >}}

### Migratie

Met migraties kunt u tabellen in de database maken, wijzigen of verwijderen.
Gegevens, zijn te vinden in de map `database/migrations`.

Meer informatie over migraties vindt u in de
[Laravel documentatie](https://laravel.com/docs/migrations).

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSupportTicketsTable extends Migration
{
    /**
     * Voer de migraties uit.
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
     * Draai de migraties terug.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('support_tickets');
    }
}
```

### Vertalingen

Met vertalingen kun je een plug-in vertalen (geweldig), ze zijn te
vinden in de `resources/lang` map in de hoofdmap van de plug-in,
in de taalmap (`en`, `fr`, `nl`, enz...)

Meet informatie over vertaligen vindt u in de
[Laravel documentatie](https://laravel.com/docs/localization).

Om een vertaling op te halen kunt u de `trans('<plugin id>::<filename>.<message>')` gebruiken,
bijvoorbeeld `trans('support::messages.tickets.home')` om het bericht `tickets.home` weer te geven
in het bestand `messages.php` van de ondersteunings plug-in.
```php
<?php

return [
  'tickets' => [
    'home' => 'Jouw tickets',
  ],
];
```

### Navigatie

#### Gebruikers

Het wordt aanbevolen om de hoofdroutes van uw plug-in te registreren,
zodat ze eenvoudig kunnen worden toegevoegd in de navigatiebalk.
Om dit te doen, neemt u gewoon de `$thiS->registerRouteDescriptions()` methode in de plug-in verlener en
stuur terug de verschillende routes in `routeDescriptions()` methode met het formaat
`[<route> => <description>]`:
```php
    /**
     * Bootstrap alle plug-in services op.
     *
     * @return void
     */
    public function boot()
    {
        // ...

        $this->registerRouteDescriptions();
    }

    /**
     * Geeft de routes terug die aan de navigatiebalk kunnen worden toegevoegd.
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

### Beheerder

Om de beheerderspagina's van uw plug-in in de navigatiebalk van het beheerders paneel te laten verschijnen,
Kunt u ze registreren door de methode `$thiS->registerAdminNavigation()`. aan te roepen
en het retourneren van de verschillende routes in de `adminNavigation()` methode.
```php
    /**
     * Bootstrap alle plug-in services op.
     *
     * @return void
     */
    public function boot()
    {
        // ...

        $this->registerAdminNavigation();
    }

    /**
     * Stuur de beheerder-navigatieroutes terug om te registreren in het paneel.
     *
     * @return array
     */
    protected function adminNavigation()
    {
        return [
            'support' => [
                'name' => 'support::admin.title', // Vertaling van de naam van het tabblad
                'icon' => 'fas fa-question', // FontAwesome icoon
                'route' => 'support.admin.tickets.index', // Pagina's route
                'permission' => 'support.tickets', // (Optioneel) Toestemming vereist om deze pagina te bekijken
            ],
        ];
    }
```
