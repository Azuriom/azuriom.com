---
title: Azuriom 1.0
---

# Azuriom 1.0

## Introductie

Azuriom 1.0 is de nieuwe hoofdversie van Azuriom, het bevat veel veranderingen en is bedoeld om
Azuriom toekomstbestendig te behouden.

Deze update bevat veel interne wijzigingen, met name de update naar Laravel 9 ([Laravel](https://laravel.com/)
het PHP-framework - de basis - gebruikt door Azuriom) en Bootstrap 5 ([Bootstrap](https://getbootstrap.com/)
zijnde de CSS framework gebruikt door Azuriom).

### PHP 8

In het bijzonder betekent het gebruik van Laravel 9 dat **PHP 8 nu vereist is om Azuriom te gebruiken**.
We willen ook opmerken dat **PHP 7.4 niet langer wordt ondersteund door PHP** sinds november 2021 en **niet langer beveiligingsupdates**
vanaf november 2022 (zie de [PHP-website](https://www.php.net/supported-versions.php)).
Om deze redenen raden we je aan om je sites zo snel mogelijk bij te werken met PHP (of ze nu Azuriom gebruiken of niet).

### Extensies

Vanwege verschillende interne wijzigingen moeten extensies (thema's en plug-ins) worden bijgewerkt om Azuriom v1.0 te ondersteunen.
Ook extensies die compatibel zijn met Azuriom v1.0 zijn niet compatibel met eerdere versies van Azuriom.

De lay-out van het basisontwerp van de CMS en plug-ins is ook volledig herzien, om de ontwikkeling te vereenvoudigen
van thema's en de algemene samenhang tussen the plug-ins.

### Hetontwerp van het verbindingssysteem

Het inlogsysteem voor Azuriom voor Minecraft is ook opnieuw ontworpen, voor Minecraft: Java Editie-servers die
niet-officiële/offline versies van het spel en voor Minecraft: Bedrock Editie-servers, is het nu mogelijk om
rechtsteeks in te loggen via uw Microsoft-account.

Voor Minecraft: Java Editie-servers die niet officiële versies accepteren, is het ook mogelijk om het maken van een
account op de website met AzLink en de plug-in [AuthMe reloaded](https://www.spigotmc.org/resources/authmereloaded.6269/).

Deze verschillende nieuwe systemen vereenvoudigen het inloggen op de site en elimineren het risico dat gebruikers de
verkeerde gebruikersnaam gebruiken.

Tenslotte is het voor sites die gebruikmaken van de Steam-verbinding mogelijk om een e-mailadres toe te voegen om bepaalde
waarschuwingen per e-mail (bijvoorbeeld wanneer een reactie wordt ontvangen op de Support plug-in of wanneer een aankoop wordt gedaan in de Shop).
Deze functie is volledig optioneel.

## Update

Momenteel is Azuriom v1.0 nog in ontwikkeling, we raden u ten zeerste aan om het niet in productie te gebruiken of een update uit te voeren
op een bestaande website. U kunt echter een nieuwe site maken om deze versie te testen door deze te downloaden van
[hier](https://azuriom.s3.fr-par.scw.cloud/dev/Azuriom-1.0.0-beta1.zip).

Voel je vrij om een bug of probleem te melden op Github of op onze [Discord-server](https://azuriom.com/discord).

## Een thema aanpassen

Aangezien Azuriom nu Bootstrap 5 gebruikt, zullen de thema's moeten worden aangepast.
We raden je aan om te kijken naar de [Bootstrap 5 migratiegids](https://getbootstrap.com/docs/5.1/migration/).

Een opmerkelijke verandering in het gebruik van Bootstrap 5 is dat jQuery niet langer wordt meegeleverd met Azuriom.
Het wordt ook niet aanbevolen om te gebruiken.

Om toekomstige compatibiliteit te verbeteren, adviseren we ook thema's om de HTML van het CMS en plug-ins aan te passen zoals:
zo min mogelijk, maar om zoveel mogelijk CSS te gebruiken. Dit voorkomt toekomstige compatiliteitsproblemen in het geval van een update.
Bij een wijziging van de HTML of wanneer van de HTML bij het toevoegen van nieuwe plug-ins.

{{< warn >}}
Vanwege veel compatiliteitsproblemen en verouderde thema's zullen thema's op de markt worden gedwongen om deze regel te respecteren.
Het is natuurlijk toegestaan om de homepagina of lay-out te wijzigen, evenals enkele extra pagina's, maar het is niet toegestaan
om alle pagina's en/of plug-ins te wijzigen.
{{< /warn >}}

Tot slot zijn veel vertalingen verbeterd en zullen de thema's aangepast moeten worden.

{{< warn >}}
Om een thema te laden met Azuriom v1.0, is het **vereist** om `"azuriom_api": "1.0.0",` toe te voegen in de `theme.json`:
```json
{
  "authors": [
    "..."
  ],
  "azuriom_api": "1.0.0"
}
```
{{< /warn >}}

### Sociale netwerken

Azuriom heeft nu een speciale configuratie om rechtstreeks vanuit de instellingen links naar sociale netwerken toe te voegen.
Als je een gelijkwaardige configuratie gebruikt, wordt sterks aanbevolen om in plaats daarvan het systeem te gebruiken dat door het CMS wordt geleverd.
Je kunt de verschillende links met de functie `social_links()` als volgt verkrijgen:
```html
@foreach(social_links() as $link)
    <a href="{{ $link->value }}" title="{{ $link->title }}" target="_blank" rel="noopener noreferrer" class="btn">
        <i class="{{ $link->icon }} fa-2x" style="color: {{ $link->color }}"></i>
    </a>
@endforeach
```

### Startpagina servers

Het is nu mogelijk om servers op de startpagina weer te geven, wat vooral handig is voor Steam-spellen.
De servers zijn beschikbaar met de variabele `$server`, die bijvoorbeeld geeft:
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

### Servers connect URL

Er is een optie toegevoegd om een link naar de server weer te geven in plaats van het adres.
Dit is vooral handig voor servers voor spellen met ondersteuning voor een URL om rechtstreeks verbinding te maken.
We raden aan om al het gebruik van het serveradres te vervangen door iets zoals dit:
```html
@if($server->joinUrl())
    <a href="{{ $server->joinUrl() }}" class="btn btn-primary">
        {{ trans('messages.server.join') }}
    </a>
@else
    {{ $server->fullAddress() }}
@endif
```

## Een plug-in aanpassen

Aangezien Azuriom nu Bootstrap 5 gebruikt, zullen de plug-ins moeten worden aangepast.
We raden je aan om te kijken naar de [Bootstrap 5 migratiegids](https://getbootstrap.com/docs/5.1/migration/).

Ook Azuriom maakt nu gebruikt van Laravel 9 en PHP 8, we raden je aan om eens te kijken naar de
[Laravel 9 migratiegids](https://laravel.com/docs/9.x/upgrade).

U kunt ook van de gelegenheid gebruik maken om de [nieuwe functies geïntroduceerd in PHP 8.0](https://www.php.net/releases/8.0/en.php) te gebruiken.
(maar het is 100% optioneel)

{{< warn >}}
Om een plug-in te laden met Azuriom v1.0, is het **vereist** om `"azuriom_api": "1.0.0",` toe te voegen in de `plugin.json`:
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

### Dienstverleners

Het is nu vereist om expliciet aanroepen van de functie `trans` op te geven in de methoden `routeDescriptions()`,
`userNavigation()` en `adminNavigation()`.

Dit resulteert in de volgende aanpassingen:
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

Aanroepen naar deze methoden zijn nu lui, d.w.z. de methode wordt alleen aangeroepen als dat nodig is.

Tenslotte zijn de methoden die in oudere versies van Azuriom zitten verouderd, en allemaal verwijderd.