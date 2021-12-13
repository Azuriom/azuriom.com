---
title: Plugin
---

# Plugin

## Perkenalan

Sebuah plugin memperbolehkan anda untuk menambah fitur baru ke website anda, untuk
plugin mereka tersedia di [Pasar](https://market.azuriom.com)
tapi anda bisa membuat satu jika anda tidak dapat menemukan yang anda
butuhkan.

## Membuat sebuah plugin

Sebelum membuat sebuah plugin, sangat di sarankan bahwa anda membaca 
[Dokumentasi Laravel](https://laravel.com/docs/).

{{< warn >}}
Saat Azuriom di unduh secara lokal untuk pengembangan plugin,
sangat disarankan untuk menyalakan debug untuk mempermudah pengembangan.
Ini bisa dilakukan dengan mengubah 2 baris di file `.env`: 
```
APP_ENV=local
APP_DEBUG=true
```
{{< /warn >}}

### Struktur sebuah plugin

```
plugins/  <-- Folder berisi berbagai plugin yang diunduh 
|  example/  <-- ID plugin anda
|  |  plugin.json  <-- File utama dari plugin yang berisi tentang berbagai informasi 
|  |  assets/  <-- Folder yang berisi aset dari plugin anda (css, js, foto, svg, etc)
|  |  database/
|  |  | migrations/ <-- Folder yang berisi migrasi plugin anda
|  |  resources/
|  |  |  lang/  <-- Folder yang berisi terjemahan dari plugin anda
|  |  |  views/  <-- Folder yang berisi views dari plugin anda
|  |  routes/ <-- Folder yang berisi rute berbeda dari plugin anda 
|  |  src/ <-- Folder yang berisi sumber dari plugin anda 
```

### File plugin.json

File `plugin.json` diperlukan untuk memuat plugin, dan
berisi informasi berbeda dari sebuah plugin:
```json
{
    "id": "contoh",
    "name": "Contih",
    "version": "1.0.0",
    "description": "Sebuah plugin.",
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

#### ID Plugin

Setiap plugin memiliki sebuah ID, yang dimana harus unik dan hanya berisi angka, 
angka kecil dan garis. Ini disarankan untuk menggunakan nama plugin sebagai patokan untuk
membuat ID, sebagai contoh jika namanya adalah `Halo Dunia`, maka ID nya akan menjadi
`halo-dunia`. Juga, sebuah direktori plugin harus memiliki nama yang sama dengan ID. 

{{< info >}}
Untuk membuat sebuah plugin anda bisa menggunakan perintah sebagai berikut yang akan 
secara otomatis membuat folder plugin dan file lainnya dengan
bawaan:
```
php artisan plugin:create <nama plugin>
```
{{< /info >}}

#### Dependencies

Bagian `dependencies` memperbolehkan anda untuk menentukan sebuah plugin (menggunakan ID plugin mereka) yang harus
di unduh supaya dapat menggunakan plugin. `?` setelah di nama plugin artinya plugin tersebut
adalah sebuah pilihan, atau sebagainya, ini tidak harus di unduh, tapi saat diperlukan, versinya harus sama.
Ini juga dapat menentukan versi dari Azuriom menggunakan nilai `azuriom`.

Sebagai contoh, plugin ini membutuhkan `0.4.0` atau diatasnya, Versi Plugin Shop adalah `0.1.0` atau
diataanya. Juga, saat plugin Vote di unduh, Plugin tersebut harus pada versi `0.2.0` atau lebih tinggi:
```json
"dependencies": {
    "azuriom": "^0.4.0",
    "shop": "^0.1.0",
    "vote?": "^0.2.0"
}
```

### Routes

Routes memperbolehkan anda untuk menghubungkan sebuah URL dengan aksi tertentu atau khusus.

Mereka disimpan di direktori `routes' di root plugin.

Untuk informasi lebih lanjut tentang bagaimana routes bekerja anda bisa baca di
[Dokumentasi Laravel](https://laravel.com/docs/routing).

Contoh:
```php
Route::get('/support', 'SupportController@index')->name('index');
```

{{< warn >}}
Mohon diperhatikan untuk tidak menggunakan routes dengan penutupan,
karena ini tidak kompatibel dengan beberapa optimasi internal.
{{< /warn >}}

#### Admin routes
 
Untuk route yang ada di panel admin, taruh saja di file `routes/admin.php` di plugin.

### Views

Views adalah bagian yang dapat dilihat dari sebuh plugin, mereka adalah file HTML
dari plugin untuk memperlihatkan sebuah halaman. 

Azuriom menggunakan [Laravel](https://laravel.com/), views dapat dibuat menggunakan Blade.
Jika anda tidak mengerti mengenai Blade ini sangat direkomendasikan untuk membaca
[Dokumentasi nya](https://laravel.com/docs/blade), terutama saat itu lumayan pendek.

{{< warn >}}
Sangat disarankan untuk TIDAK menggunakan PHP.
saat anda bekerja dengan Blade, karena Blade tidak memberikan anda cara yang tradisional
tidak ada kelebihan dan hanya kekurangan saja.
{{< /warn >}}

Untuk memperlihatkan sebuah view anda bisa menggunakan `view('<plugin id>::<nama dari view>')`,
atau contohnya `view('support::tickets.index')` untuk memperlihatkan view `tickets.index` 
dari plugin support.

Untuk menggunakan struktur dari halaman, sangat dibutuhkan bahwa view meng[extend] view yang menggunakan struktur/layout,
anda bisa menggunakan struktur bawaan (atau struktur theme jika ada)
dengan `@extends('layouts.app')`, atau membuat struktur anda sendiri dan [extend]kan.

Lalu masukkan konten utama ke bagian `content`,
dan judul dari halaman tersebut di bagian `title`.

```html
@extends('layouts.app')

@section('title', 'Nama halaman')

@section('content')
    <div class="container content">
        <h1>Sebuah Judul</h1>

        <p>Sebuah Teks</p>
    </div>
@endsection
```

#### Aset

Aset (CSS, JS, Foto, etc) berlokasi di folder `assets/` dan bisa
digunakan dengan fungsi `plugin_asset('<plugin id>', '<jalur aset>')`.

Aset bisa di masukkan ke halaman menggunakan [Blade stack](https://laravel.com/docs/blade#stacks).
dalam 2 tempat yang berbeda di halaman sesuai dengan tipe asetnya:
* `styles` untuk file CSS  (berlokasi di `<head>`)
* `scripts` untuk file JS  (berlokasi `<head>`, jangan lupa untuk menambahkan atribut `defer`
  ke skriptny, jadi mereka tidak memblokir render halaman)

Contoh:
```html
@push('scripts')
    <script src="{{ plugin_asset('vote', 'js/vote.js') }}" defer></script>
@endpush
```

#### Admin view

For a page to use the admin panel layout, just use the layout
`admin.layouts.admin`, it is also recommended creating an admin folder
in the `resources` folder and put the admin views in it.

### Controllers

Controllers are a central part of a plugin, they are located in the folder
`src/Controllers` at the root of the plugin, and they take care of
to transform a request into the answer that will be sent back to the user.

For more information on how the controllers work you can read the
[Laravel documentation](https://laravel.com/docs/controllers).

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

Templates represent an entry in a database table, and allow you to interact with
the database.

You can also define in a model the different relationships of the model,
For example, a `ticket` can have a `user` and a `category`, and have `comments`.

You can find more information about models (also called Eloquent on Laravel) in the
[Laravel documentation](https://laravel.com/docs/eloquent).

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

The service providers are the heart of a plugin, they are called at the initialization stage.
of Laravel, and allow to save the different parts of a plugin (views, translations, middlewares, dependencies, etc).

Service providers must be added to the `providers` part of the `plugins.json`:
```json
{
    "providers": [
        "\\Azuriom\\Plugin\\Support\\Providers\\SupportServiceProvider"
    ]
}
```

You can find more information about the services provided in the
[Laravel documentation](https://laravel.com/docs/providers).

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

Migrations allow you to create, modify or delete tables in the database.
data, they can be found in the `database/migrations` folder.

You can find more information about migrations in the
[Laravel documentation](https://laravel.com/docs/migrations).

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

### Translations

Translations allow you to translate a plugin (amazing), they are found at
in the `resources/lang` directory at the root of a plugin, in the 
language folder (`en`, `fr`, etc...).

You can find more information on translations in the
[Laravel documentation](https://laravel.com/docs/localization).

To retrieve a translation you can use the
`trans('<plugin id>::<filename>.<message>')`, for example
`trans('support::messages.tickets.home')` to display the `tickets.home` message,
in the `messages.php` file of the support plugin:
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

It is recommended to register the main routes of your plugin so that they can be
easily added in the navigation bar. To do this, simply call the
`$thiS->registerRouteDescriptions()` method in the plugin provider and return
the different routes in the `routeDescriptions()` method with the format 
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
            'support.tickets.index' => 'support::messages.title',
        ];
    }
```

### Admin

To make your plugin's admin pages appear in the navbar of the admin panel,
you can register them by calling the method `$this->registerAdminNavigation()`
and returning the different routes in the `adminNavigation()` method.
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
