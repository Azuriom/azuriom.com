---
title: Azuriom 1.0
---

# Azuriom 1.0

## Вступ

Azuriom 1.0 - це нова основна версія Azuriom, яка містить багато змін і спрямована на те, 
щоб зробити Azuriom надійним у майбутньому.

Це оновлення містить багато внутрішніх змін, зокрема оновлення до Laravel 9 ([Laravel](https://laravel.com/) - PHP-фреймворк, який використовується Azuriom) та Bootstrap 5 ([Bootstrap](https://laravel.com/) - CSS-фреймворк, який
PHP-фреймворк - основа, що використовується компанією Azuriom) та Bootstrap 5 ([Bootstrap](https://getbootstrap.com/) - CSS-фреймворк, що використовується компанією Azuriom).
фреймворк, що використовується Azuriom).

### PHP 8

Зокрема, використання Laravel 9 означає, що для використання Azuriom тепер необхідна версія **PHP 8**.
Ми також хотіли б зазначити, що **PHP 7.4 більше не підтримується PHP** з листопада 2021 року і більше не буде **отримувати
оновлення безпеки** з листопада 2022 року (див. [веб-сайт PHP](https://www.php.net/supported-versions.php)).
З цієї причини ми рекомендуємо вам якомога швидше оновити свої сайти, що використовують PHP (незалежно від того, чи використовують вони Azuriom чи ні).

### Розширення

У зв'язку з різними внутрішніми змінами, розширення (теми і плагіни) доведеться оновити для підтримки Azuriom v1.0.
Також розширення, сумісні з Azuriom v1.0, не сумісні з попередніми версіями Azuriom.

Також була повністю переглянута компоновка основного дизайну CMS і плагінів, з метою спрощення розробки
тем, а також загальної узгодженості між плагінами.

### Реконструкція системи підключення

Також була перероблена система входу в Azuriom для Minecraft, для Minecraft: Java Edition серверів, які не
приймають неофіційні/офлайн версії гри, а також для серверів Minecraft: Bedrock Edition з'явилася можливість
увійти безпосередньо через свій обліковий запис Microsoft.

Для серверів Minecraft: Java Edition, які приймають неофіційні версії, також з'явилася можливість автоматизувати створення
облікового запису на сайті за допомогою AzLink і плагіна [AuthMe reloaded](https://www.spigotmc.org/resources/authmereloaded.6269/).

Ці різні нові системи спрощують вхід на сайт, усуваючи при цьому ризик того, що користувачі візьмуть неправильне ім'я користувача.

Нарешті, для сайтів, що використовують з'єднання Steam, можна додати адресу електронної пошти, щоб отримувати певні
сповіщення на електронну пошту (наприклад, при отриманні відповіді на плагін підтримки або при здійсненні покупки в магазині). 
Ця функція є повністю необов'язковою.

## Оновлення

Міграція доступна для сайтів, що працюють на старій версії Azuriom.
Сайт повинен бути у версії 0.6.0, тоді у вкладці "Оновлення" в панелі адміністратора,
ви можете оновитися до версії Azuriom v1.0!

Перед оновленням кілька важливих моментів:
* Зробіть резервну копію вашого сайту (файлів і бази даних)
* Переконайтеся, що всі розширення оновлені до версії 1.0
* Переконайтеся, що у вас встановлений PHP 8.0 або вище
* Переконайтеся, що сайт має необхідні дозволи на файли

Безпосередньо перед оновленням необхідно відключити всі розширення. Вони можуть бути
знову активувати, як тільки оновлення буде завершено.

{{< warn >}}
Під час міграції будуть видалені всі дані плагіна голосування. Інші плагіни
не постраждають.
{{< /warn >}}

Після завершення оновлення ви можете оновити свої розширення.

## Адаптація теми

Оскільки Azuriom зараз використовує Bootstrap 5, теми доведеться адаптувати. Ми радимо вам ознайомитися з
[Bootstrap 5 migration guide](https://getbootstrap.com/docs/5.1/migration/).

Однією з помітних змін у використанні Bootstrap 5 є те, що jQuery більше не входить до складу Azuriom.
Його також не рекомендується використовувати.

Також, з метою поліпшення сумісності в майбутньому, ми також радимо темам модифікувати HTML CMS і плагінів якомога
якомога менше, але максимально використовувати CSS. Це дозволить уникнути в майбутньому проблем сумісності в разі оновлення
з модифікацією HTML або при модифікації HTML або при додаванні нових плагінів.

{{< warn >}}
Через численні проблеми сумісності та застарілість тем, теми на ринку будуть змушені дотримуватися цього правила.
Звичайно, дозволяється змінювати домашню сторінку або макет, а також деякі додаткові сторінки, але не дозволяється
змінювати всі сторінки та/або плагіни.
{{< /warn >}}

Нарешті, багато перекладів були вдосконалені і потребують змін у тематиці.

{{< warn >}}
Для того, щоб тема завантажилася з Azuriom v1.0, **необхідно** додати `"azuriom_api": "1.0.0",` в `theme.json`:
```json
{
  "authors": [
    "..."
  ],
  "azuriom_api": "1.0.0"
}
```
{{< /warn >}}

### Icons

FontAwesome 5 було замінено на [Bootstrap Icons](https://icons.getbootstrap.com),
тому вам потрібно буде замінити всі іконки.

Також потрібно замінити CSS FontAwesome на Boostrap:
```diff
- <link href="{{ asset('vendor/fontawesome/css/all.min.css') }}" rel="stylesheet">
+ <link href="{{ asset('vendor/bootstrap-icons/bootstrap-icons.css') }}" rel="stylesheet">
```

### Соціальні мережі

В Azuriom з'явилася спеціальна конфігурація для додавання посилань на соціальні мережі прямо з налаштувань. Якщо у вас була еквівалентна конфігурація
еквівалентної конфігурації, настійно рекомендується використовувати систему, що надається CMS.
Ви можете отримати різні посилання за допомогою функції `social_links()` ось так:
```html
@foreach(social_links() as $link)
    <a href="{{ $link->value }}" title="{{ $link->title }}" target="_blank" rel="noopener noreferrer" class="btn">
        <i class="{{ $link->icon }} fs-2" style="color: {{ $link->color }}"></i>
    </a>
@endforeach
```

### Домашні сервери

З'явилася можливість виводити сервери на головну сторінку, що особливо корисно для
Steam-ігор.
Сервери доступні за допомогою змінної `$servers`, яка дає наприклад:
```html
@if(! $servers->isEmpty())
    <h2 class="text-center">
        {{ trans('messages.servers') }}
    </h2>

    <div class="row justify-content-center mb-4">
        @foreach($servers as $server)
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body text-center">
                        <h5>{{ $server->name }}</h5>
    
                        <p>
                            @if($server->isOnline())
                                {{ trans_choice('messages.server.total', $server->getOnlinePlayers(), [
                                    'max' => $server->getMaxPlayers(),
                                ]) }}
                            @else
                                <span class="badge bg-danger text-white">
                                    {{ trans('messages.server.offline') }}
                                </span>
                            @endif
                        </p>
    
                        @if($server->joinUrl())
                            <a href="{{ $server->joinUrl() }}" class="btn btn-primary">
                                {{ trans('messages.server.join') }}
                            </a>
                        @else
                            <p class="card-text">{{ $server->fullAddress() }}</p>
                        @endif
                    </div>
                </div>
            </div>
        @endforeach
    </div>
@endif
```

### Приєднання серверів до URL

Додана можливість виводити замість адреси посилання на сервер.
Це особливо корисно для серверів для ігор з підтримкою URL для прямого підключення.
Рекомендуємо замінити всі випадки використання адреси сервера на щось подібне:
```html
@if($server->joinUrl())
    <a href="{{ $server->joinUrl() }}" class="btn btn-primary">
        {{ trans('messages.server.join') }}
    </a>
@else
    {{ $server->fullAddress() }}
@endif
```

## Адаптація плагіна

Оскільки Azuriom зараз використовує Bootstrap 5, плагіни доведеться адаптувати. Радимо ознайомитися з
[Bootstrap 5 migration guide](https://getbootstrap.com/docs/5.1/migration/).

Також Azuriom тепер використовує Laravel 9 і PHP 8, радимо ознайомитися з
[Laravel 9 migration guide](https://laravel.com/docs/9.x/upgrade).

Ви також можете скористатися можливістю скористатися [новими можливостями, представленими в PHP 8.0](https://www.php.net/releases/8.0/en.php)
(але це на 100% необов'язково).

{{< warn >}}
Для того, щоб плагін завантажувався з Azuriom v1.0, **необхідно** додати `"azuriom_api": "1.0.0",` в `plugin.json`:
```json
{
  "authors": [
    "..."
  ],
  "azuriom_api": "1.0.0",
  "providers": [
    "..."
  ]
}
```
{{< /warn >}}

### Icons

FontAwesome 5 було замінено на [Bootstrap Icons](https://icons.getbootstrap.com),
тому вам потрібно буде замінити всі іконки FontAwesome.

### Постачальники послуг

Тепер у методах `routeDescriptions()`, `userNavigation()` та `adminNavigation()` потрібно явно вказувати виклики функції `trans`.

Це призводить до наступних змін:
```diff
    protected function routeDescriptions()
    {
        return [
-           'shop.home' => 'shop::messages.title',
+           'shop.home' => trans('shop::messages.title'),
        ];
    }

    // ...

    protected function adminNavigation()
    {
            return [
            'shop' => [
-               'name' => 'shop::admin.nav.title',
+               'name' => trans('shop::admin.nav.title'),
                // ...
                'items' => [
-                   'shop.admin.packages.index' => 'shop::admin.nav.packages',
+                   'shop.admin.packages.index' => trans('shop::admin.nav.packages'),
                    // ...
                ],
            ],
        ];
    }

    // ...

    protected function userNavigation()
    {
        return [
            'shop' => [
                'route' => 'shop.profile',
-               'name' => 'shop::messages.profile.payments',
+               'name' => trans('shop::messages.profile.payments'),
            ],
        ];
    }
```

Виклики цих методів тепер ліниві, тобто метод буде викликатися тільки при необхідності.

Нарешті, всі методи, застарілі в старих версіях Azuriom, були видалені.
