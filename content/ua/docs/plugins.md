---
title: Плагіни
---

# Плагіни

## Вступ

Плагін дозволяє додати нові можливості на ваш сайт, для
багато плагінів доступні на нашому [Маркеті](https://market.azuriom.com),
і ви також можете створити його, якщо не можете знайти той, який відповідає вашим
потребам.

## Створення плагіна

Перед створенням плагіна рекомендується ознайомитися з
[документацією Laravel](https://laravel.com/docs/).

{{< warn >}}
Коли Azuriom встановлюється локально для розробки плагінів,
настійно рекомендується включити налагодження для спрощення розробки.
Це можна зробити, просто відредагувавши ці 2 рядки у файлі `.env`:
```
APP_ENV=local
APP_DEBUG=true
```
{{< /warn >}}

### Структурування плагіна

```
plugins/  <-- Папка з різними встановленими плагінами
|  example/  <-- Ідентифікатор вашого плагіна
|  |  plugin.json  <-- Основний файл вашої теми, що містить різноманітну інформацію
|  |  assets/  <-- Папка, що містить ресурси вашого плагіна (css, js, images, svg і т.д.)
|  |  database/
|  |  | migrations/ <-- Папка з міграціями вашого плагіна
|  |  resources/
|  |  |  lang/  <-- Папка з перекладами вашого плагіна
|  |  |  views/  <-- Папка, що містить види вашого плагіна
|  |  routes/ <-- Папка, що містить різні маршрути вашого плагіна
|  |  src/ <-- Папка з вихідними кодами вашого плагіна
```

### Файл plugin.json

Файл `plugin.json` необхідний для завантаження плагіна і
містить різну інформацію про плагін:
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

#### Ідентифікатор плагіна

Кожен плагін повинен мати ідентифікатор, який повинен бути унікальним і містити тільки цифри,
малі літери та тире. Рекомендується використовувати назву як основу для
створення ідентифікатора, наприклад, якщо ім'я плагіна `Hello World`, то ідентифікатор може бути
`hello-world`. Також каталог плагіна повинен мати таку ж назву, як і його ідентифікатор. 

{{< info >}}
Для створення плагіна можна скористатися наступною командою, яка
автоматично згенерує папку плагіна і безліч файлів 
за замовчуванням:
```
php artisan plugin:create <plugin name>
```
{{< /info >}}

#### Залежності

Розділ `dependencies` дозволяє вказати плагіни (використовуючи їх id), які повинні бути
бути встановлені для використання плагіна. Символ `?` після назви плагіна означає, що плагін
є необов'язковим, тобто його не потрібно встановлювати, але коли він встановлений, то версія повинна збігатися.
Також є можливість вказати версію Azuriom за допомогою значення `azuriom`.

Наприклад, для роботи цього плагіна потрібен Azuriom версії `0.4.0` або вище, плагін Shop версії `0.1.0` або
або вище. Також, коли встановлюється плагін Vote, він повинен бути версії `0.2.0` або вище:
```json
"dependencies": {
    "azuriom": "^0.4.0",
    "shop": "^0.1.0",
    "vote?": "^0.2.0"
}
```

### Маршрути

Маршрути дозволяють пов'язати URL-адресу з певною дією.

Вони зберігаються в каталозі `routes` в корені плагіна.

Для отримання додаткової інформації про роботу маршрутів ви можете прочитати
[Документація Laravel](https://laravel.com/docs/routing).

Приклад:
```php
Route::get('/support', 'SupportController@index')->name('index');
```

{{< warn >}}
Будь ласка, будьте обережні, не використовуйте маршрути з перекриттями,
оскільки вони несумісні з деякими внутрішніми оптимізаціями.
{{< /warn >}}

#### Адміністрування маршрутів
 
Для того, щоб маршрут був в адмін-панелі, достатньо розмістити його у файлі `routes/admin.php` плагіна.

### Види

Подання - це видима частина плагіна, це файли вмісту HTML
плагіна для відображення сторінки.

Azuriom за допомогою [Laravel](https://laravel.com/), перегляди можна робити за допомогою Blade.
Якщо ви не володієте Blade, настійно рекомендується прочитати
[його документацію](https://laravel.com/docs/blade), тим більше, що вона досить коротка.

{{< warn >}}
Настійно рекомендується НЕ використовувати синтаксис PHP.
при роботі з Blade, тому що Blade не принесе вам традиційних
ніяких переваг, а тільки недоліки.
{{< /warn >}}

Для відображення представлення можна використовувати `view('<plugin id>::<name of the view>')`,
наприклад `view('support::tickets.index')` для відображення `tickets.index` плагіна підтримки.

Для визначення макета сторінки необхідно, щоб подання розширювало подання, що містить
макет, можна або використовувати макет за замовчуванням (або макет теми, якщо такий є)
за допомогою `@extends('layouts.app')`, або створити власний макет і розширити його.

Потім помістіть весь основний контент в розділ `content`,
а заголовок сторінки - в розділ `title`.

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

#### Активи

Активи (CSS, JS, зображення і т.д.) знаходяться в папці `assets/` і можуть бути
використовуватися за допомогою функції `plugin_asset('<plugin id>', '<asset path>')`.

Активи можуть бути включені на сторінку за допомогою [Blade stack] (https://laravel.com/docs/blade#stacks).
в 2 різних місцях на сторінці в залежності від типу ресурсу:
* `styles` для CSS-файлів (знаходиться в `<head>`)
* `scripts` для JS-файлів (знаходяться в `<head>`, не забудьте додати атрибут `defer` до скрипту
  до скрипту, щоб вони не блокували рендеринг сторінки)

Приклад:
```html
@push('scripts')
    <script src="{{ plugin_asset('vote', 'js/vote.js') }}" defer></script>
@endpush
```

#### Подання адміністратора

Для того, щоб сторінка використовувала макет адмін-панелі, досить використовувати макет
`admin.layouts.admin`, також рекомендується створити папку admin
в папці `resources` і помістити в неї адмін-вигляди.

### Контролери

Контролери - це центральна частина плагіна, вони знаходяться в папці
`src/Controllers` в корені плагіна, і вони дбають про те, щоб
перетворення запиту у відповідь, яка буде відправлена назад користувачеві.

Більш детальну інформацію про роботу контролерів ви можете знайти в
[документації Laravel](https://laravel.com/docs/controllers).

Приклад:
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

### Моделі

Шаблони представляють собою запис в таблиці бази даних, і дозволяють взаємодіяти з
базою даних.

Ви також можете визначити в моделі різні зв'язки моделі,
Наприклад, `ticket` може мати `user` та `category`, а також мати `comments`.

Ви можете знайти більше інформації про моделі (також звані Eloquent на Laravel) в
[Документація по Laravel](https://laravel.com/docs/eloquent).

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

### Постачальник послуг

Постачальники послуг - це серце плагіна, вони викликаються на етапі ініціалізації.
Вони зберігаються в папці Laravel і дозволяють зберігати різні частини плагіна (подання, переклади, проміжні модулі, залежності і т.д.).

Провайдери послуг повинні бути додані в частину `providers` файлу `plugins.json:
```json
{
    "providers": [
        "\\Azuriom\\Plugin\\Support\\Providers\\SupportServiceProvider"
    ]
}
```

Більш детальну інформацію про послуги, що надаються, Ви можете знайти в
[Документація Laravel](https://laravel.com/docs/providers).

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

### Залежності

У каталозі плагінів запустіть вашу звичайну команду composer require.

Потім додайте `require_once __DIR__.'/../../vendor/autoload.php';` в метод register постачальника послуг плагіна.

{{< warn >}}Переконайтеся, що необхідні вам залежності ще не надаються компанією Azuriom, щоб уникнути конфлікту версій і помилок.{{< /warn >}}

### Міграція

Міграції дозволяють створювати, змінювати або видаляти таблиці в базі даних.
Якщо ви хочете створити міграції даних, їх можна знайти в папці `database/migrations`.

Ви можете скористатися наступною командою для автоматичного створення файлу міграції:
```
php artisan make:migration <migration name> --path plugins/<plugin id>/database/migrations 
```

Ви можете знайти більше інформації про міграцію в
[Документація Laravel](https://laravel.com/docs/migrations).

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

### Переклади

Переклади дозволяють перевести плагін (дивовижно), вони знаходяться за адресою
в каталозі `resources/lang` в корені плагіна, в папці 
папці мови (`en`, `fr` і т.д...).

Більш детальну інформацію про переклади ви можете знайти в
[Документація Laravel](https://laravel.com/docs/localization).

Для отримання перекладу ви можете скористатися
`trans('<plugin id>::<filename>.<message>')`, наприклад
`trans('support::messages.tickets.home')` для відображення `tickets.home` повідомлення,
у `messages.php` файлі плагіна підтримки:
```php
<?php

return [
  'tickets' => [
    'home' => 'Your tickets',
  ],
];
```

### Навігація

#### Утилізатори

Рекомендується зареєструвати основні маршрути вашого плагіна, щоб їх можна було
легко додавати в навігаційну панель. Для цього достатньо викликати функцію
`$thiS->registerRouteDescriptions()` метод в постачальнику плагінів і повернути
різні маршрути в `routeDescriptions()` метод з форматом 
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

### Адміністратор

Щоб адмін-сторінки вашого плагіна відображалися в навігаційній панелі адмін-панелі,
ви можете зареєструвати їх, викликавши метод `$this->registerAdminNavigation()`
та повернення різних маршрутів у `adminNavigation()` метод.
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
