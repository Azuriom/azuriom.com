---
title: Plugins
---

# Plugins

## Einführung

Ein Plugin ermöglicht es Dir, Deiner Website neue Funktionen hinzuzufügen.
Viele Plugins sind auf [unserem Markt](https://market.azuriom.com) verfügbar,
aber Du kannst eines erstellen, wenn Du keins finden, das Deinen Anforderungen entspricht.

## Ein Plugin erstellen

Bevor Du ein Plugin erstellst, wird empfohlen,
die [Laravel-Dokumentation](https://laravel.com/docs/) zu lesen.

{{< warn >}}
Wenn Azuriom für die Plugin-Entwicklung lokal installiert wird, wird dringend empfohlen,
das Debugging zu aktivieren, um die Entwicklung zu vereinfachen.
Dies kann durch einfaches Bearbeiten dieser 2 Zeilen in der `.env`-Datei erfolgen:
```
APP_ENV=local
APP_DEBUG=true
```
{{< /warn >}}

### Ein plugin strukturieren

```
plugins/  <-- Ordner mit den verschiedenen installierten Plugins
|  beispiel/  <-- ID deines Plugins
|  |  plugin.json  <-- Die Hauptdatei Deines Themes mit den verschiedenen Informationen
|  |  assets/  <-- Der Ordner, der die Assets Deines Plugins enthält (css, js, Bilder, SVG usw.)
|  |  database/
|  |  | migrations/ <-- Der Ordner mit den Migrationen Deines Plugins
|  |  resources/
|  |  |  lang/  <-- Der Ordner mit den Übersetzungen Deines Plugins
|  |  |  views/  <-- Der Ordner mit den Ansichten Deines Plugins
|  |  routes/ <-- Der Ordner mit den verschiedenen Routen Deines Plugins
|  |  src/ <-- Der Ordner mit den Quellen Deines Plugins
```

### Die plugin.json-Datei

Die Datei `plugin.json` wird zum Laden eines Plugins benötigt
und enthält die verschiedenen Informationen eines Plugins:
```json
{
    "id": "beispiel",
    "name": "Beispiel",
    "version": "1.0.0",
    "description": "Ein tolles Plugin.",
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

#### Plugin ID

Jedes Plugin muss eine ID haben, die eindeutig sein muss und nur Zahlen,
Kleinbuchstaben und Bindestriche enthalten darf. Es wird empfohlen,
den Namen als Grundlage für die Erstellung der ID zu verwenden.
Wenn der Name beispielsweise `Hello World` lautet, könnte die ID `hello-world` sein.
Außerdem muss das Verzeichnis des Plugins denselben Namen wie seine ID haben.

{{< info >}}
Um ein Plugin zu erstellen, kannst Du den folgenden Befehl verwenden,
der den Ordner des Plugins und viele Dateien standardmäßig automatisch generiert:
default:
```
php artisan plugin:create <plugin name>
```
{{< /info >}}

### Routen

Routen ermöglichen es Dir, eine URL mit einer bestimmten Aktion zu verknüpfen.

Sie werden im Verzeichnis `routes` im Stammverzeichnis des Plugins gespeichert.

Weitere Informationen zur Funktionsweise von Routen findest Du in der
[Laravel Dokumentaion](https://laravel.com/docs/routing).

Beispiel:
```php
Route::get('/support', 'SupportController@index')->name('index');
```

{{< warn >}}
Bitte achte darauf, keine Strecken mit Sperrung zu verwenden,
da diese mit einigen internen Optimierungen nicht kompatibel sind.
{{< /warn >}}

#### Admin Routen
 
For a route to be in the admin panel, just place it in the file `routes/admin.php` of the plugin.

### Ansichten

Die Ansichten sind der sichtbare Teil eines Plugins,
sie sind die Inhaltsdateien HTML des Plugins, um eine Seite anzuzeigen.

Azuriom verwendet [Laravel](https://laravel.com), Ansichten können mit Blade erstellt werden.
Wenn Du Blade nicht beherrschst, wird dringend empfohlen,
die [Dokumentation](https://laravel.com/docs/blade) zu lesen, zumal sie ziemlich kurz ist.

{{< warn >}}
Es wird dringend empfohlen, KEINE PHP-Syntax zu verwenden, wenn Du mit Blade arbeitest,
da Blade Dir  keine Vorteile und nur Nachteile bringt.
{{< /warn >}}

To display a view you can use `view('<plugin id>::<name of the view>')`,
of example `view('support::tickets.index')` to display the `tickets.index` view
of the support plugin.

Um das Layout der Seite zu definieren, ist es notwendig,
dass die Ansicht die Ansicht erweitert, die das Layout enthält.
Du kannst entweder das Standardlayout (oder das Theme-Layout, falls vorhanden)
mit `@extends('layouts.app')` verwenden,
oder Erstelle Dein eigenes Layout und erweitere es.

Füge dann den gesamten Hauptinhalt in den `Inhalts`bereich
und den `Titel` der Seite in den Titelbereich ein.

```html
@extends('layouts.app')

@section('title', 'Seiten Name')

@section('content')
    <div class="container content">
        <h1>Ein Titel</h1>

        <p>Ein Text</p>
    </div>
@endsection
```

#### Assets

The assets (CSS, JS, images, etc) are located in the `assets/` folder and can
be used with the `plugin_asset('<plugin id>', '<asset path>')` function.

Assets can be included in the page via a [Blade stack](https://laravel.com/docs/blade#stacks).
in 2 different places on the page depending on the type of asset:
* `styles` for CSS files (located in the `<head>`)
* `scripts` for JS files (located in the `<head>`, don't forget to add the `defer` attribute
  to the script, so they do not block the page rendering)

Example:
```html
@push('scripts')
    <script src="{{ plugin_asset('vote', 'js/vote.js') }}" defer></script>
@endpush
```

#### Admin Ansicht

Damit eine Seite das Admin-Panel-Layout verwendet,
verwende einfach das Layout `admin.layouts.admin`.
Es wird auch empfohlen, einen Admin-Ordner im `Ressourcen`ordner zu erstellen
und die Admin-Ansichten darin abzulegen.

### Controllers

Controller sind ein zentraler Bestandteil eines Plugins,
sie befinden sich im Ordner `src/Controllers` im Stammverzeichnis des Plugins
und sorgen dafür, dass eine Anfrage in eine Antwort umgewandelt wird,
die an den Benutzer zurückgesendet wird.

Weitere Informationen zur Funktionsweise der Controller findest Du in der [Laravel-Dokumentation](https://laravel.com/docs/controllers).

Beispiel:
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

Vorlagen stellen einen Eintrag in einer Datenbanktabelle dar
und ermöglichen Dir die Interaktion mit der Datenbank.

Sie können auch in einem Modell die verschiedenen Beziehungen des Modells definieren.
Beispielsweise kann ein `Ticket` einen `Benutzer` und eine `Kategorie` sowie `Kommentare` haben.

Weitere Informationen zu Modellen (bei Laravel auch Eloquent genannt) findest Du in der [Laravel-Dokumentation](https://laravel.com/docs/eloquent).

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

Die Dienstanbieter sind das Herzstück eines Plugins, sie werden in der Initialisierungsphase von Laravel aufgerufen und ermöglichen das Speichern der verschiedenen Teile eines Plugins (Ansichten, Übersetzungen, Middleware, Abhängigkeiten usw.).

Dienstanbieter müssen dem `providers` Teil der `plugins.json` hinzugefügt werden:
```json
{
    "providers": [
        "\\Azuriom\\Plugin\\Support\\Providers\\SupportServiceProvider"
    ]
}
```

Weitere Informationen zu den angebotenen Diensten findest du in der [Laravel-Dokumentation](https://laravel.com/docs/providers).

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

### Abhängigkeiten

Führe in Deinem Plugin-Verzeichnis Deinen üblichen Composer-Befehl require aus.

Dann füge `require_once __DIR__.'/../../vendor/autoload.php';`
an die Registrierungsmethode des Diensteanbieters des Plugins.

{{< warn >}}
Stelle sicher, dass die benötigten Abhängigkeiten nicht
bereits von Azuriom bereitgestellt werden, um Versionskonflikte und Fehler zu vermeiden.
{{< /warn >}}

### Migration

Migrationen ermöglichen es Ihnen, Tabellen in der Datenbank zu erstellen, zu ändern oder zu löschen. Die Daten findest Du im Ordner `database/migrations`.

Weitere Informationen zu Migrationen findest Du in der [Laravel-Dokumentation](https://laravel.com/docs/migrations).

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

### Übersetzungen

Übersetzungen ermöglichen es Ihnen, ein Plugin zu übersetzen (erstaunlich).
Sie befinden sich im Verzeichnis `resources/lang` im Stammverzeichnis eines
Plugins im Sprachordner (`en`, `fr`, etc…).

Weitere Informationen zu Übersetzungen finden Sie in der [Laravel-Dokumentation](https://laravel.com/docs/localization).

Um eine Übersetzung abzurufen, können Sie `trans('<plugin id>::<filename>.<message>')` verwenden,
zum Beispiel `trans('support::messages.tickets.home')`,
um die Nachricht tickets.home in der Datei `messages.php` anzuzeigen des Support-Plugins:
```php
<?php

return [
  'tickets' => [
    'home' => 'Deine Tickets',
  ],
];
```

### Navigation

#### Benutzer

Es wird empfohlen, die Hauptrouten Ihres Plugins zu registrieren,
damit sie einfach in der Navigationsleiste hinzugefügt werden können.
Rufe dazu einfach die Methode `$this->registerRouteDescriptions()` im Plugin-Anbieter
auf und gebe die verschiedenen Routen in der Methode `routeDescriptions()` im Format
`[<route> => <description>]` zurück:

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

Damit die Admin-Seiten deines Plugins in der Navbar des Admin-Panels erscheinen,
kannst Du sie registrieren, indem Du die Methode `$this->registerAdminNavigation()` aufrufst
und die verschiedenen Routen in der Methode `adminNavigation()` zurückgibst.
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
                'name' => 'support::admin.title', // Translation of the tab name
                'icon' => 'fas fa-question', // FontAwesome icon
                'route' => 'support.admin.tickets.index', // Page's route
                'permission' => 'support.tickets', // (Optional) Permission required to view this page
            ],
        ];
    }
```
