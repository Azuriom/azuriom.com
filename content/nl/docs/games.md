---
title: Custom games
---

# Ondersteuning toevoegen voor een nieuwe game

## Benodigdheden

- Toegang tot een terminal om commando's als `php -v` uit te voeren en enigzins bekend te zijn met programmeren

Als u Azuriom hebt geïnstalleerd, kunt u de installatie stap overslaan.

Als u Azuriom nooit hebt geïnstalleerd, moet u het eerst installeren. Tijdens de installatie wordt je gevraagd om een spel te kiezen.

U navigeert naar de URL `/install/game/custom`. Met dat in gedachten kunt u nu de installatie-instructies volgen.

Nadat Azuriom is geïnstalleerd, kunt u de volgende opdracht in een terminal uitvoeren om een beheerdersgebruiker aan te maken:
```
php artisan user:create --admin
```

## Opstelling

U kunt de volgende opdracht uitvoeren om de project layout voor uw spel te genereren, met `MyNewGame` de naam van uw spel:
```
php artisan game:create MyNewGame
```

## Azuriom verbinden met een game

### Aangepaste database gebruiken

Ga naar `plugins/mynewgame/src/Providers/MyNewGameServiceProvider.php` en bewerk het bestand

Onder `use Azuriom\Extensions\Plugin\BasePluginServiceProvider;` plak `use Illuminate\Support\Facades\DB;`

Zoek nu de `boot` methode en voeg onder `$this->registerUserNavigation();` dit `$this->setupDatabaseConnection();` toe

Je kunt nu de functie hieronder plakken net onder de `}` van de opstartmethode.

```php
protected function setupDatabaseConnection()
{
    $driver = 'mysql'; // Kan ook pgsql, sqlsrv zijn
    $config = config('database.connections.'.$driver);

    /**
     * Om inloggegevens in het .env-bestand te gebruiken, kunt u het configuratiebestand van uw plug-in gebruiken.
     * in plugins/mynewgame/config/azuriom_mynewgame.php, ziet u standaard slechts één 'custom_config' sleutel.
     * maar je kunt meer toevoegen zoals 'CUSTOM_DB_ADDRESS' => env('CUSTOM_DB_ADDRESS', '127.0.0.1')
     * 
     * Om toegang te krijgen: config('azuriom_mynewgame.CUSTOM_DB_ADDRESS');
     * 
     */
    $config['host'] = config('azuriom_mynewgame.CUSTOM_DB_ADDRESS');
    $config['port'] = config('azuriom_mynewgame.CUSTOM_DB_PORT');
    $config['username'] = config('azuriom_mynewgame.CUSTOM_DB_USER');
    $config['password'] = config('azuriom_mynewgame.CUSTOM_DB_PASSWORD');
    $config['database'] = config('azurion_mynewgame.CUSTOM_DB_DATABASE');

    config(['database.connections.my-custom-connection' => $config]);
    DB::purge();
}
```

Nu kunt u uw eerste model maken bet behulp van uw game database verbinding. Ga naar `plugins/mynewgame/src/Models`,
maak een nieuw bestand `Character.php` en voeg de volgende code toe:

```php
<?php

namespace Azuriom\Plugin\MyNewGame\Models;

use Illuminate\Database\Eloquent\Model;

class Character extends Model
{
    protected $connection = 'my-custom-connection';
}
```

Bewerk nu `plugins/mynewgame/src/Controllers/Admin/AdminController.php` en onder `use Azuriom\Http\Controllers\Controller;`,
voeg `use Azuriom\Plugin\MyNewGame\Models\Character;` toe

Vervang dan de functie `index` door:

```php
public function index()
{
    $characters = Character::paginate();
    return view('mynewgame::admin.index', ['characters' => $characters]);
}
```

Om nu de karakters in je admin-menu te tonen, bewerk je `plugins/mynewgame/resources/views/admin/index.blade.php` en vervang je
`<p>This is the admin page of your plugin</p>` met:

```php
@foreach($characters as $character)
    <p>{{$character->name}}</p> {{-- "name" kan elke eigenschap uit je database zijn --}}
@endforeach

{{ $characters->links() }}
```


### RCON/API gebruiken en/of opdrachten uitvoeren

Ga naar `plugins/mynewgame/src/Games/MyNewGameServerBridge.php` en bekijk de inhoud.

Om een voorbeeld uit de echte wereld te hebben, kunt u een kijkje nemen op:
- [Dofus Game](https://github.com/Javdu10/Game-Dofus129/blob/main/src/Game/DofusServerBridge.php) die een SSL verbinding
gebruikt om opdrachten naar de spelserver te versturen.
- [Flyff Game](https://github.com/AzuriomCommunity/Game-Flyff/blob/master/src/Games/FlyffServerBridge.php) die een aangepaste codering
gebruikt en bescherming met een wachtwoord. (Het stuurt ook items naar de database als terugvalmechanismen).

Binnen de `sendCommands()` methode, moet je afhandelen of een speler in het spel is verbonden of niet en de juiste acties ondernemen
zoals [hier in de flyff game](https://github.com/AzuriomCommunity/Game-Flyff/blob/v0.2.8/src/Games/FlyffServerBridge.php#L76).