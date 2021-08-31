---
title: Thema's
---

# Thema's

## Introductie

Met een thema kunt u het uiterlijk van een website volledig aanpassen met behulp van Azuriom.

Om een thema te installeren, plaatst u het in de `resources/themes/` map in
de hoofdmap van uw website.

{{< warn >}}
Wanneer Azuriom lokaal is geïnstalleerd voor thema-ontwikkeling,
wordt het ten zeerste aanbevolen om de foutopsporing to activeren om de ontwikkeling te vereenvoudigen.
Dit kan gedaan worden door simpelweg deze 2 regels te bewerken in het `.env` bestand:
```
APP_ENV=local
APP_DEBUG=true
```
{{< /warn >}}

## Een thema maken

Om snel een thema te maken, kunt u de volgende opdracht gebruiken die:
Automatisch de themamap genereerd met de `theme.json` bestand:
```
php artisan theme:create <thema naam>
```

{{< info >}}
Om thema's te maken met een meer geavanceerde setup met een webpack om te compileren
SASS-bestanden en optimaliseerde JavaScript bestanden, kunt u dit gebruiken
[onofficiële boilerplate](https://github.com/nolway/azuriom-theme-boilerplate)
(ook moet je [Node.js](https://nodejs.org) installeren met NPM)
{{< /info >}}

### Structuur

```
themes/ <-- Map met alle geïnstalleerde thema's
| example/ <-- ID van je thema
| | theme.json <-- Het hoofdbestand van uw thema met verschillende informatie
| |  assets/  <-- De map met de middelen van je thema (css, js, afbeeldingen, svg, etc)
| | views/ <-- De map met de weergaven van uw thema.
| | config/
| | | config.blade.php
| | | rules.php
| | config.json
```

### Het theme.json bestand

Alle thema's hebben een `theme.json` bestand in hun hoofdmap, dat is
het enige essentiële element voor een thema, het ziet er zo uit:
```json
{
    "id": "example",
    "name": "Example",
    "version": "1.0.0",
    "description": "Een geweldig thema.",
    "url": "https://azuriom.com",
    "authors": [
        "Azuriom"
    ]
}
```

#### Thema ID

Elk thema moet een ID hebben, die uniek moet zijn en alleen cijfers, kleine letters
en streepjes mag bevatten. Het wordt aanbevolen om de naam te gebruiken als basis voor:
het maken van de ID, bijvoorbeeld als de naam `Hallo Wereld` is, dan kan de ID
`hallo-wereld` zijn. Ook moet de map van het thema dezelfde naam hebben als zijn ID.

### Views

De views vormen het hart van een thema, het zijn de HTML-inhoudsbestanden van
een thema voor de verschillende onderdelen van de website.

Azuriom is gemaakt met behulp van [Laravel](https://laravel.com/), views kunnen worden
gemaakt met behulp van de sjabloon Blade. Als je Blade niet onder de knie hebt, wordt het ten
zeerste aanbevolen om [De documentatie](https://laravel.com/docs/blade) te lezen, vooral omdat het vrij kort is.

{{< warn >}}
Het wordt ten zeerste aanbevolen om GEEN PHP-syntaxis te gebruiken.
Wanneer je met Blade werkt, want Blade brengt
geen voordelen maar alleen nadelen.
{{< /warn >}}

Aan de CSS-kant wordt aanbevolen om het standaardframework van de CMS te gebruiken, namelijk [Bootstrap 4](https://getbootstrap.com), 
dit maakt het gemakkelijker om een thema te realiseren en is compatibel met de nieuwe plug-ins,
zodat u niet constant updates hoeft uit te voeren.
Maar als u wilt, kunt u een ander CSS-framework gebruiken.

In Javascript is de enige vereiste afhankelijkheid: [Axios](https://github.com/axios/axios).

{{< warn >}}
Hoewel jQuery zonder problemen kan worden toegevoegd en gebruikt, is het:
aanbevolen om het niet te gebruiken, zodat het gemakkelijk kan worden verwijderd wanneer
Bootstrap 5 uitkomt. In het algemeen [jQuery is vandaag niet meer nodig en kan worden
verwijderd](http://youmightnotneedjquery.com/).
{{< /warn >}}

{{< info >}}
Als een view niet aanwezig is in het thema, maar wel in het CMS of in een plug-in,
zal het automatisch gebruikt worden.
{{< /info >}}

#### Lay-out

De lay-out is de structuur van alle pagina's van een thema. Het bevat
de meta's, middelen van een thema, header, footer etc...

Om de inhoud van de huidige pagina weer te geven kunt u gebruik maken van
`@yield('content')`, en om de titel van de huidige pagina weer te geven kunt u
`@yield('title')` gebruiken.

U kunt ook verschillende elementen integreren met
`@include('<name of the view>')`, bijvoorbeeld `@include('element.navbar')` voor
inclusief de navigatiebalk.

Om de lay-out van de pagina te definiëren, moet de view de weergave uitbreiden met
de lay-out, kunt u ofwel de standaardlay-out gebruiken met
`@extends('layouts.app')`, of maak je eigen lay-out en breid deze uit.

#### Plug-in views

Om de views van een plug-in te wijzigen, maakt u eenvoudig een `plugins` map in
de map `views` van het thema, en maak een map voor elke plug-in (met
behulp van de plug-in ID en niet de naam van de plug-in), en voeg vervolgens de plug-in views toe..

Bijvoorbeeld, voor de stem plug-in, geeft dit `views/plugins/vote/index.blade.php`.

### Methoden

#### Middelen

Om de link naar een item in een thema te hebben, kun je de volgende functie gebruiken
`theme_asset`: 
```html
<link rel="stylesheet" href="{{ theme_asset('css/style.css') }}">
```

#### Huidige gebruiker

De huidige gebruiker kan worden opgehaald met de functie `auth()->user()`.
Voor meer details over authenticatie, kunt u de
[Laravel documentatie](https://laravel.com/docs/authentication) raadplegen.

#### Functies

U kunt via de functies een bepaald aantal parameters van de website ophalen zoals:

|    Fonction      |               Description                           |
| ---------------- | --------------------------------------------------- |
| `site_name()`    | Haalt de sitenaam op                                |
| `site_logo()`    | Hiermee kunt u de link naar de website-logo ophalen |
| `favicon()`      | Hiermee kunt u de favicon-link ophalen              |
| `format_date()`  | Geeft een datum weer die is opgemaakt met de huidige taal. Deze functie neemt een instantie van `Carbon\Carbon` aan als parameter |
| `money_name()`   | Retourneert de naam van de valuta van de website   |
| `format_money()` | Retourneert een bedrag dat is opgemaakt met de valuta van de website |

#### Geef de spelers weer die op de server zijn

Om de online spelers weer te geven, controleert u gewoon of de variabele `$server` niet null is,
en de server online is, als dat zo is, gebruik dan `$server->getOnlinePlayers()` om
het aantal online spelers op te halen.

```blade
@if($server && $server->isOnline())
    {{ trans_choice('messages.server.online', $server->getOnlinePlayers()) }}
@else
    {{ trans('messages.server.offline') }}
@endif
```

#### Vertalingen

Een thema kan, indien nodig, vertalingen laden.

Om dit te doen, maakt u gewoon een `messages.php` bestand in de `lang/<language>` map (bijvoorbeeld: `lang/en`).
van een thema, dan kunt u een vertaling weergeven via de
trans: `{{ trans('theme::messages.hello') }}` of via de `@lang` instructie: 
`@lang('theme::messages.hello')`.
U kunt ook `trans_choice` gebruiken voor een vertaling met
getallen, en `trans_bool` om een boolean te vertalen (zal terugkeren in het Engels `Yes`).
/`No`.

Voor meer details over vertalingen, kunt u de
[Laravel documentatie](https://laravel.com/docs/localization) raadplegen.


### Configuratie

U kunt een configuratie in een thema toevoegen, om dit te doen, hoeft u alleen maar de basis van een thema te maken:
* Een `config/config.blade.php` weergave met het formulier voor de configuratie.
* Een `config/rules.php` bestand met de verschillende validatieregels voor
de configuratie van een thema.
* Een `config.json` bestand waarin de thema configuratie wordt opgeslagen en dat de standaardwaarden bevat.

##### Voorbeeld

config.blade.php
```html
<form action="{{ route('admin.themes.update', $theme) }}" method="POST">
    @csrf

    <div class="form-group">
        <label for="discordInput">{{ trans('theme::carbon.config.discord') }}</label>
        <input type="text" class="form-control @error('discord-id') is-invalid @enderror" id="discordInput" name="discord-id" required value="{{ old('discord-id', config('theme.discord-id')) }}">

        @error('discord-id')
        <span class="invalid-feedback" role="alert"><strong>{{ $message }}</strong></span>
        @enderror
    </div>

    <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> {{ trans('messages.actions.save') }}</button>
</form>
```

config.json
```json
{
    "discord-id": "625774284823986183."
}
```
