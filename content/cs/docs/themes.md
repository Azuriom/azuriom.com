---
title: Témata
---

# Témata

## Úvod

Téma vám umožňuje plně přizpůsobit vzhled webu používajícího Azuriom.

Pro nainstalování tématu ho jednoduše dejte do složky `resources/themes/` v
kořenovém adresáři vašeho webu.

{{< warn >}}
Pokud je Azuriom nainstalovám lokálně pro tvorbu doplňků,
je vysoce doporučeno zapnout ladění pro zjednodušení vývoje.
To lze učinit jednoduchým povolením těchto dvou řádků v souboru `.env`:
```
APP_ENV=local
APP_DEBUG=true
```
{{< /warn >}}

## Tvorba tématu

Pro vytvoření tématu můžete použít následující příkaz, který
automaticky vygeneruje složku tématu a jeho soubor `theme.json`:
```
php artisan theme:create <theme name>
```

{{< info >}}
Pro vytváření témat s pokročilejším nastavením s webpackem pro kompilaci
souborů SASS a optimalizaci JavaScript souborů můžete použít tento
[neoficiální boilerplate](https://github.com/nolway/azuriom-theme-boilerplate)
(musíte si také nainstalovat [Node.js](https://nodejs.org) s NPM)
{{< /info >}}

### Struktura

```
themes/ <-- Složka obsahující všechna nainstalovaná témata
| example/ <-- ID vašeho tématu
| | theme.json <-- Hlavní soubor vašeho tématu obsahující různé informace
| |  assets/  <-- Složka obsahující assety vašeho tématu (css, js, obrázky, svg, atd)
| | views/ <-- Složka obsahující views vašeho tématu
| | config/
| | | config.blade.php
| | | rules.php
| | config.json
```

### Soubor theme.json

Všechna témata musí mít soubor `theme.json` v jejich kořenové složce,
což je jediný vyžadovaný prvek tématu, a vypadá takto:
```json
{
    "id": "priklad",
    "name": "Příklad",
    "version": "1.0.0",
    "description": "Úžasné téma.",
    "url": "https://azuriom.com",
    "authors": [
        "Azuriom"
    ]
}
```

#### ID tématu

Každé téma musí mít ID, které musí být unikátní a může obsahovat pouze
čísla, malá písmena a pomlčky. Je doporučeno použít název jako základ pro
tvorbu ID, takže pokud máte například název `Ahoj světe`, ID může být
`ahoj-svete`. Název adresáře tématu se také musí shodovat s jeho ID.

### Views

Views jsou srdcem tématu, jsou to základní obsahové soubory HTML
tématu pro různé části webu.

Azuriom používá [Laravel](https://laravel.com/), views mohou být vytvořeny pomocí Blade.
Pokud neznáte Blade, je vysoce doporučeno přečíst si
[jeho dokumentaci](https://laravel.com/docs/blade), hlavně protože je poměrně krátká.

{{< warn >}}
Je vysoce doporučeno NEPOUŽÍVAT syntaxi PHP
při práci s Blade, protože Blade vám nepřináší
tradiční žádné výhody a pouze nevýhody.
{{< /warn >}}

Na straně CSS je doporučeno použít výchozí framweork CMS, což je [Bootstrap 4](https://getbootstrap.com),
díky tomu bude jednodušší zrealizovat téma a bude kompatibilní s novými doplňky,
takže nebudete muset dělat neustálé aktualizace.
Ale pokud chcete, můžete samozřejmě použít jiný CSS framework.

V JavaScriptu je jediná potřebná závislost [Axios](https://github.com/axios/axios).

{{< warn >}}
I když může být jQuery přidáno a bez problémů používáno, je doporučeno
ho nepoužívat, takže může být jednoduše odebráno při vydání Bootstrapu 5.
Obecně [již není jQuery nadále potřeba a může být jednoduše
odebráno](http://youmightnotneedjquery.com/).
{{< /warn >}}

{{< info >}}
Pokud se view nenachází v tématu ale je v CMS nebo v doplňku, 
bude automaticky použito.
{{< /info >}}

#### Rozložení

Rozložení je struktura všech stránek tématu. Obsahuje
tagy meta, assety tématu, záhlaví, zápatí atd...

Pro zobrazení obsahu současné stránky můžete použít
`@yield('content')` a pro zobrazení názvu současné stránky můžete
použít `@yield('title')`.

Můžete také integrovat různé prvky pomocí
`@include('<name of the view>')`, například `@include('element.navbar')` pro
zahrnutí navigační lišty.

Pro nadefinování rozložení stránky musí view rozšiřovat view obsahující
rozložení, nebo můžete použít výchozí rozložení pomocí
`@extends('layouts.app')`, či si vytvořit úplně vlastní rozložení a rozšířit ho.

#### Views doplňků

Pro změnu views doplňku jednoduše vytvořte adresář `plugins` ve
složce `views` tématu a vytvořte složku pro každý doplněk (s ID
doplňku, ne s jeho názvem), poté přidejte views doplňku.

Například pro hlasovací doplněk to bude vypadat takto `views/plugins/vote/index.blade.php`.

### Metody

#### Assets

Pro připojení assetu do tématu, můžete použít funkci
`theme_asset`: 
```html
<link rel="stylesheet" href="{{ theme_asset('css/style.css') }}">
```

#### Aktuální uživatel

Aktuální uživatel může být získán pomocí funkce `auth()->user()`.
Další informace o autentifikaci lze nalézt v
[dokumentaci Laravelu](https://laravel.com/docs/authentication).

#### Funkce

Můžete získat určité číslo parametrů z webu pomocí dedikovaných funkcí:

| Funkce           | Popis                                                                                                |
|------------------|------------------------------------------------------------------------------------------------------|
| `site_name()`    | Vrátí název webu                                                                                     |
| `site_logo()`    | Vrátí odkaz na logo webu                                                                             |
| `favicon()`      | Vrátí odkaz na favikonu webu                                                                         |
| `format_date()`  | Zobrazí datum formátované aktuálním jazykem. Tato funkce bere instanci `Carbon\Carbon` jako parametr |
| `money_name()`   | Vrátí název měny webu                                                                                |
| `format_money()` | Vrátí hodnotu formátovanou pomocí měny webu                                                          |

#### Zobrazit hráče připojené k serveru

Pro zobrazení připojených hráčů stačí zkontrolovat, že proměnná `$server` není null,
a že je server online, a pokud je, použijte `$server->getOnlinePlayers()` pro
získání počtu online hráčů.

```blade
@if($server && $server->isOnline())
    {{ trans_choice('messages.server.online', $server->getOnlinePlayers()) }}
@else
    {{ trans('messages.server.offline') }}
@endif
```

#### Překlady

Téma může, pokud potřebuje, načíst překlady.

Abyste tak učinili, stačí vytvořit soubor `messages.php` v adresáři `lang/<jazyk>` (například: `lang/cs`).
tématu, poté můžete zobrazit překlad pomocí
trans: `{{ trans('theme::messages.hello') }}` nebo pomocí direktiva `@lang`: 
`@lang('theme::messages.hello')`.
Můžete také použít `trans_choice` pro překlad s čísly
a `trans_bool` pro překlad booleanu (vrátí v angličtině `Ano`/`Ne`).
/`No`.

Další informace o překladech lze nalézt v
[dokumentaci Laravelu](https://laravel.com/docs/localization).


### Konfigurace

Do tématu můžete přidat konfiguraci, abyste tak učinili, stačí
vytvořit následující v kořenovém adresáři tématu:
* View `config/config.blade.php` obsahující formulář pro konfiguraci.
* Soubor `config/rules.php` obsaující různá validační pravidla pro
konfiguraci tématu.
* Soubor `config.json`, kde bude ukládána konfigurace, obsahující výchozí hodnoty. 

##### Příklad

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
