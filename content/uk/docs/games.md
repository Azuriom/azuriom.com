---
title: Кастомні ігри
---

# Додайте підтримку нової гри

## Вимоги

- Доступ до терміналу, щоб виконувати команди на кшталт `php -v` і бути трохи знайомим з програмуванням

Якщо у вас встановлено Azuriom, ви можете перейти до кроку Налаштування.

Якщо ви ніколи не встановлювали Azuriom, вам необхідно його встановити. Під час інсталяції вам буде запропоновано вибрати гру.

Ви перейдете за адресою `/install/game/custom`. Маючи це на увазі, тепер ви можете слідувати інструкціям по встановленню.

Після встановлення Azuriom ви можете виконати наступну команду в терміналі, щоб створити користувача адміністратора:
```
php artisan user:create --admin
```

## Налаштування

Ви можете запустити наступну команду, щоб згенерувати макет проекту для вашої гри, вказавши `MyNewGame` назву вашої гри:
```
php artisan game:create MyNewGame
```

## Підключення Azuriom до гри

### Використання власної бази даних

перейдіть до файлу `plugins/mynewgame/src/Providers/MyNewGameServiceProvider.php` та відредагуйте його

У розділі `use Azuriom\Extensions\Plugin\BasePluginServiceProvider;` вставте `use Illuminate\Support\Facades\DB;`.

Тепер знайдіть метод `boot` і в розділі `$this->registerUserNavigation();` додайте `$this->setupDatabaseConnection();`

Тепер ви можете вставити функцію, наведену нижче, безпосередньо під `}` методу завантаження:

```php
protected function setupDatabaseConnection()
{
    $driver = 'mysql'; // Can also be pgsql, sqlsrv
    $config = config('database.connections.'.$driver);

    /**
     * To use credentials in the .env file, you can use your plugin's config file.
     * in plugins/mynewgame/config/azuriom_mynewgame.php, you will see by default only one 'custom_config' key,
     * but you can add more like: 'CUSTOM_DB_ADDRESS' => env('CUSTOM_DB_ADDRESS', '127.0.0.1')
     * 
     * To access it: config('azuriom_mynewgame.CUSTOM_DB_ADDRESS');
     * 
     */ 
    $config['host'] = config('azuriom_mynewgame.CUSTOM_DB_ADDRESS');
    $config['port'] = config('azuriom_mynewgame.CUSTOM_DB_PORT');
    $config['username'] = config('azuriom_mynewgame.CUSTOM_DB_USER');
    $config['password'] = config('azuriom_mynewgame.CUSTOM_DB_PASSWORD');
    $config['database'] = config('azuriom_mynewgame.CUSTOM_DB_DATABASE');

    config(['database.connections.my-custom-connection' => $config]);
    DB::purge();
}
```

Тепер ви можете створити свою першу модель, використовуючи підключення до бази даних гри. Перейдіть в `plugins/mynewgame/src/Models`, створіть
новий файл `Character.php` і додайте наступний код:

```php
<?php

namespace Azuriom\Plugin\MyNewGame\Models;

use Illuminate\Database\Eloquent\Model;

class Character extends Model
{
    protected $connection = 'my-custom-connection';
}
```

Тепер відредагуйте `plugins/mynewgame/src/Controllers/Admin/AdminController.php` і в розділі `use Azuriom\Http\Controllers\Controller;`,
додайте `use Azuriom\Plugin\MyNewGame\Models\Character;`.

Потім замінити функцію `index` на:

```php
public function index()
{
    $characters = Character::paginate();
    return view('mynewgame::admin.index', ['characters' => $characters]);
}
```

Тепер для відображення символів в меню адміністратора відредагуйте `plugins/mynewgame/resources/views/admin/index.blade.php` і замініть
`<p>This is the admin page of your plugin</p>` на:

```php
@foreach($characters as $character)
    <p>{{$character->name}}</p> {{-- "name" can be any properties from you database --}}
@endforeach

{{ $characters->links() }}
```


### Використання Rcon/API та/або для виконання команд

Перейдіть за адресою `plugins/mynewgame/src/Games/MyNewGameServerBridge.php` та ознайомтеся з вмістом.

Для прикладу з реального світу ви можете подивитися на :
- [Dofus Game] (https://github.com/Javdu10/Game-Dofus129/blob/main/src/Game/DofusServerBridge.php), яка використовує SSL 
з'єднання для відправки команд на ігровий сервер
- [Flyff Game] (https://github.com/AzuriomCommunity/Game-Flyff/blob/master/src/Games/FlyffServerBridge.php), яка використовує
спеціальне кодування та захист паролем. (Він також надсилає елементи до бази даних як резервний механізм).

У методі `endCommands()` ви повинні обробляти, чи підключений гравець до гри чи ні, і виконувати відповідні дії
як [тут у грі flyff](https://github.com/AzuriomCommunity/Game-Flyff/blob/v0.2.8/src/Games/FlyffServerBridge.php#L76).
