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
    "azuriom_api": "1.0.0",
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

Mereka disimpan di direktori `routes` di root plugin.

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

Untuk layout halaman panel admin, hanya gunakan layout
`admin.layouts.admin`, disarankan untuk membuat folder admin
di folder `resources` dan menaruh admin view di dalamnya


### Controllers

Controllers merupakan bagian utama dari sebuah plugin, mereka terletak di folder
`src/Controllers` di root sebuah plugin, dan mereka menangani
untuk mengubah permintaan menjadi jawaban yang nantinya akan dikirimkan kembali ke pengguna.

Untuk informasi lebih lanjut untuk cara penggunaan controllers anda bisa membacanya di
[Dokumentasi Laravel](https://laravel.com/docs/controllers).

Contoh:
```php
<?php

namespace Azuriom\Plugin\Support\Controllers;

use Azuriom\Http\Controllers\Controller;
use Azuriom\Plugin\Support\Models\Ticket;

class TicketController extends Controller
{
    /**
     * Memunculkan daftar dari sumbernya.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Kami akan mengambil semua tiket
        $tickets = Ticket::all();

        // Kami kembalikan sebuah view, dan mengirim tiketnya...
        return view('support::tickets.index', [
            'tickets' => $tickets,
        ]);
    }
}
```

### Models

Template melambangkan sebuah masukkan di tabel database, dan memperbolehkan anda untuk berinteraksi dengan
database.

Anda juga bisa menandakan sebuah model yang memiliki keterkaitan yang berbeda dari model lainnya,
Contihnya, sebuah `ticket` bisa memiliki `user` dan `category`, dan juga memiliki `comments`.

Untuk informasi lebuh lanjut mengenai Models atau biasanya di panggil Eloquent di Laravel) pada
[Dokumentasi Laravel](https://laravel.com/docs/eloquent).

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
     * Awalan tabel yang menandakan model tersebut.
     *
     * @var string
     */
    protected $prefix = 'support_';

    /**
     * Attribut yang bisa digunakan.
     *
     * @var array
     */
    protected $fillable = [
        'subject', 'category_id',
    ];

    /**
     * Kunci pengguna berkaitan dengan model ini.
     *
     * @var string
     */
    protected $userKey = 'author_id';

    /**
     * Mengambil pengguna yang membuat tiket tersebut.
     */
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Mendapatkan kategori dari tiket ini.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Mendapatkan komentar dari tiket ini.
     */
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
```

### Service Provider

Service Provider adalah jantung dari sebuah plugin, mereka digunakan saat dibagian inisialisasi.
dari Laravel, dan memperbolehkan untuk menyimpan bagian berbeda dari sebuah plugin (views, translation, middleware, dependencies, dan sebagainya).

Service provider harus ditambahkan di `providers` sebagai bagian dari `plugins.json`:
```json
{
    "providers": [
        "\\Azuriom\\Plugin\\Support\\Providers\\SupportServiceProvider"
    ]
}
```

Untuk informasi lebih lanjut mengenai Service Provider dapat di baca di
[Dokumentasi Laravel](https://laravel.com/docs/providers).

```php
<?php

namespace Azuriom\Plugin\Support\Providers;

use Azuriom\Extensions\Plugin\BasePluginServiceProvider;

class SupportServiceProvider extends BasePluginServiceProvider
{
    /**
     * Mendaftarkan semua plugin.
     *
     * @return void
     */
    public function register()
    {
        $this->registerMiddlewares();

        //
    }

    /**
     * Bootstrap semua plugin.
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

Di direktori plugin anda ada sebuah komposer yang membutuhkan sebuah perintah.

Lalu tambahkan `require_once __DIR__.'/../../vendor/autoload.php';` untuk mendaftarkan metode dari service provider dari sebuah plugin.

{{< warn >}}Pastikan bahwa dependencies yang anda masukkan belum disediakan oleh Azuriom untuk menghindari konflik antar versi dan error.{{< /warn >}}

### Migration

Migration memperbolehkan anda untuk membuat, mengubah dan menghapus tabel di database.
data, mereka bisa ditemukan di folder `database/migrations`.

Untuk informasi lanjut mengenai migration ada di
[Dokumentasi Laravel](https://laravel.com/docs/migrations).

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migrasinya.
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
     * Membalik migrasinya.
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

Terjemahan memperbolehkan anda untuk meberjemahkan sebuah plugin (luar biasa), mereka dapat ditemukan di
dalam direktori `resources/lang` diroot plugin tersebut, pada folder
bahasa (`en`, `fr`, dan sebagainya...).

Untuk informasi lanjut mengenai translation ada di
[Dokumentasi Laravel](https://laravel.com/docs/localization).

Untuk mengambil sebuah terjemahan anda bisa menggunakan
`trans('<plugin id>::<filename>.<message>')`, contohnya
`trans('support::messages.tickets.home')` untuk menampilkan pesan `tickets.home`,
di file `messages.php` dari plugin support:
```php
<?php

return [
  'tickets' => [
    'home' => 'Tiket anda',
  ],
];
```

### Navigation

#### Utilisateurs

Disarankan untuk mendaftarkan rute utama dari plugin anda jadi mereka dapat
secara mudah ditambahkan ke kolom navigasi. Untuk melakukan ini, gunakan saja
`$thiS->registerRouteDescriptions()` metode ini ke provider plugin dan kembalikan
ke rute berveda di `routeDescriptions()` metode dengan format
`[<route> => <description>]`:
```php
    /**
     * Bootstrap semua plugin.
     *
     * @return void
     */
    public function boot()
    {
        // ...

        $this->registerRouteDescriptions();
    }

    /**
     * Mengembalikan rute yang harusnya ditambahkan di navbar.
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

Untuk membuat halaman admin plugin anda muncul di navbar pada panel admin,
anda bisa mendaftarkan mereka dengan menggunakan `$this->registerAdminNavigation()`
dan mengembalikan rute berbeda di `adminNavigation()`.
```php
    /**
     * Bootstrap semua plugin.
     *
     * @return void
     */
    public function boot()
    {
        // ...

        $this->registerAdminNavigation();
    }

    /**
     * Mengembalikan rute navigasi admin untuk didaftarkan di dashboard.
     *
     * @return array
     */
    protected function adminNavigation()
    {
        return [
            'support' => [
                'name' => trans('support::admin.title'), // Terjemahan nama tab
                'icon' => 'bi bi-joystick', // Ikon Bootstrap Icon
                'route' => 'support.admin.tickets.index', // Rute halaman
                'permission' => 'support.tickets', // (Pilihan) Ijin diperlukan untuk melihat halaman ini
            ],
        ];
    }
```
