---
title: Games
---

# Games

## Requirements

- An access to a terminal to run commands like `php -v` and be somewhat familiar with programming

If you have Azuriom installed you can skip to the Setup step.

If you never installed Azuriom, you need to install it. During installation it will ask you to choose a game.

You will navigate to the link `/install/game/custom`. With that in mind you can now follow the installation instruction

Once Azuriom is installed you will issue your first command in the terminal : 

`php artisan user:create --admin` : This will create your admin user which you will use to access the admin panel.

## Setup
Choose a `name` for your game, for exemple `MyNewGame`, it's `id` will be `mynewgame`

At the root folder of the CMS run in the terminal : `php artisan game:create MyNewGame`

You can now go to Azuriom admin panel, in the plugin section, activate your plugin and if you did everything correctly you can see your game appearing in the `Plugins` section

## How to connect the CMS to my game ?

### My Game have a custom database

go to `plugins/mynewgame/src/Providers/MyNewGameServiceProvider.php` and edit the file

Under `use Azuriom\Extensions\Plugin\BasePluginServiceProvider;` paste `use Illuminate\Support\Facades\DB;`

Now locate the `boot` method and under `$this->registerUserNavigation();` add `$this->setupDatabaseConnection();`

You can now paste the function bellow just under the `}` of the boot method:

```php
    protected function setupDatabaseConnection()
    {
        $driver = 'mysql'; // Can also be pgsql, sqlsrv
        $config = config("database.connections.$driver");

        /**
         * To use credentials in the .env file, you can use your plugin's config file.
         * in plugins/mynewgame/config/azuriom_mynewgame.php, you will see by default only one 'custom_config' key
         * 
         * but you can add more like: 'CUSTOM_DB_ADDRESS' => env('CUSTOM_DB_ADDRESS', '127.0.0.1')
         * 
         * to access it : config('azuriom_mynewgame.CUSTOM_DB_ADDRESS');
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

Now you can create your first model using your game database connection. Go to `plugins/mynewgame/src/Models`, create a new file `Character.php` and paste:

```php
<?php

namespace Azuriom\Plugin\MyNewGame\Models;

use Illuminate\Database\Eloquent\Model;

class Character extends Model
{
    protected $connection = 'my-custom-connection';
}
```

Now edit `plugins/mynewgame/src/Controllers/Admin/AdminController.php` and under `use Azuriom\Http\Controllers\Controller;` paste `use Azuriom\Plugin\MyNewGame\Models\Character;`

Then replace function `index` by:

```php
public function index()
{
    $characters = Character::paginate();
    return view('mynewgame::admin.index', ['characters' => $characters]);
}
```

Now to show the characters in your admin menu edit `plugins/mynewgame/ressources/views/admin/index.blade.php` and replace `<p>This is the admin page of your plugin</p>` by:

```php
@foreach($characters as $character)
    <p>{{$character->name}}</p> {{-- "name" can be any properties from you database --}}
@endforeach

{{ $characters->links() }}
```


### My game have : RCON, API... AND/OR I want to execute commands on my game server

Go to `plugins/mynewgame/src/Games/MyNewGameServerBridge.php` and have a look at the content.

To have real world exemple you can have a look at :
- [Dofus Game](https://github.com/Javdu10/Game-Dofus129/blob/main/src/Game/DofusServerBridge.php) which uses an SSL connection to send commands to the game server 
- [Flyff Game](https://github.com/AzuriomCommunity/Game-Flyff/blob/master/src/Games/FlyffServerBridge.php) which uses a custom encoding and protection with a password. (It also send items to database as fallback mechanisms)

Within the `sendCommands()` method, you should handle if a player is connected in-game or not and take the proper actions like [here in the flyff game](https://github.com/AzuriomCommunity/Game-Flyff/blob/master/src/Games/FlyffServerBridge.php#L75)