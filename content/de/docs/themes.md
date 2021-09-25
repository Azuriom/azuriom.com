---
title: Themen
---

# Themes

## Einführung

Mit einem Design kannst Du das Erscheinungsbild einer Website mit Azuriom vollständig anpassen.

To install a theme, just put it in the `resources/themes/` folder at
the root of your website.

{{< warn >}}
Wenn Azuriom für die Themenentwicklung lokal installiert ist, wird dringend empfohlen,
das Debugging zu aktivieren, um die Entwicklung zu vereinfachen.
Dies kann durch einfaches Bearbeiten dieser 2 Zeilen in der `.env`-Datei erfolgen:
```
APP_ENV=local
APP_DEBUG=true
```
{{< /warn >}}

## Ein Theme erstellen

Um schnell ein Thema zu erstellen, kannst Du den folgenden Befehl verwenden,
der automatisch das Themenverzeichnis und die Datei `theme.json` generiert:
```
php artisan theme:create <theme name>
```

{{< info >}}
Um Themen mit einem fortgeschritteneren Setup mit Webpack zu erstellen,
um SASS-Dateien zu kompilieren und die JavaScript-Dateien zu optimieren,
kannst Du diesen [inoffiziellen Boilerplate](https://github.com/nolway/azuriom-theme-boilerplate) verwenden
(Du musst auch [Node.js](https://nodejs.org) mit NPM installieren).
{{< /info >}}

### Struktur

```
themes/ <-- Folder containing all installed themes
| example/ <-- ID von deinem Theme
| | theme.json <-- Die Hauptdatei Deines Themes mit den verschiedenen Informationen
| |  assets/  <-- Der Ordner, der die Assets Deines Themes enthält (css, js, Bilder, SVG usw.)
| | views/ <-- Der Ordner, der die Ansichten Deines Designs enthält.
| | config/
| | | config.blade.php
| | | rules.php
| | config.json
```

### Die theme.json Datei

Alle Themes müssen eine `theme.json`-Datei im Stammverzeichnis haben,
die das einzige wesentliche Element für ein Theme ist und so aussieht:
```json
{
    "id": "beispiel",
    "name": "Beispiel",
    "version": "1.0.0",
    "description": "Ein tolles Theme.",
    "url": "https://azuriom.com",
    "authors": [
        "Azuriom"
    ]
}
```

#### Theme ID

Jedes Theme muss eine ID haben, die eindeutig sein muss und nur Zahlen,
Kleinbuchstaben und Bindestriche enthalten darf.
Es wird empfohlen, den Namen als Grundlage für die Erstellung der ID zu verwenden.
Wenn der Name beispielsweise `Hello World` lautet, könnte die ID `hello-world` sein.
Außerdem muss das Verzeichnis des Themes denselben Namen wie seine ID haben.

### Ansichten

Die Ansichten sind das Herzstück eines Themes,
sie sind die HTML-Inhaltsdateien eines Themes für die verschiedenen Teile der Website.

Azuriom mit [Laravel](https://laravel.com/), Ansichten können mit der Vorlage Blade erstellt werden.
Wenn Du Blade nicht beherrschst,
wird dringend empfohlen, die [Dokumentation](https://laravel.com/docs/blade) zu lesen, zumal sie ziemlich kurz ist.

{{< warn >}}
Es wird dringend empfohlen, KEINE PHP-Syntax zu verwenden wenn Du mit Blade arbeitest,
denn Blade bringt Dir keine Vorteile und nur Nachteile.
{{< /warn >}}

Auf der CSS-Seite wird empfohlen, das Standard-Framework des CMS zu verwenden,
nämlich [Bootstrap 4](https://getbootstrap.com), dies erleichtert die Realisierung eines Themes und ist mit den neuen Plugins kompatibel.
Du musst also keine ständigen Aktualisierungen vornehmen.
Aber wenn Du es vorziehst, kannst Du ein anderes CSS-Framework verwenden.

In Javascript ist [Axios](https://github.com/axios/axios) die einzige benötigte Abhängigkeit.

{{< warn >}}

Obwohl jQuery problemlos hinzugefügt und verwendet werden kann, wird empfohlen,
es nicht zu verwenden, sodass es bei der Veröffentlichung von Bootstrap 5 leicht entfernt werden kann.
Im Allgemeinen [wird jQuery heute nicht mehr benötigt und kann leicht entfernt werden](http://youmightnotneedjquery.com).
{{< /warn >}}

{{< info >}}
Wenn eine Ansicht nicht im Theme,
aber im CMS oder in einem Plugin vorhanden ist,
wird sie automatisch verwendet.
{{< /info >}}

#### Layout

Das Layout ist die Struktur aller Seiten eines Themas. Es enthält tatsächlich die Metas,
Assets eines Themes, Header, Footer usw...

Um den Inhalt der aktuellen Seite anzuzeigen, kannst Du `@yield('content')` verwenden,
und um den Titel der aktuellen Seite anzuzeigen, kannst Du `@yield('title')` verwenden.

Du kannst auch verschiedene Elemente mit `@include('<Name der Ansicht>')` integrieren,
zum Beispiel `@include('element.navbar')` zum Einbinden der Navbar.

Um das Layout der Seite zu definieren, muss die Ansicht die Ansicht mit dem Layout erweitern.
Du kannst entweder das Standardlayout mit @extends('layouts.app') verwenden oder
Dein eigenes Layout erstellen und erweitern.

#### Plugin views

Um die Ansichten eines Plugins zu ändern,
erstelle einfach das `plugins` Verzeichnis im `views` Ordner des Themes,
erstelle einen Ordner für jedes Plugin (mit der Plugin-ID und nicht dem Plugin-Namen)
und füge dann die Plugin-Ansichten hinzu.

Für das Abstimmungs-Plugin ergibt dies beispielsweise `views/plugins/vote/index.blade.php`.

### Methoden

#### Assets

Um den Link zu einem Asset in einem Theme zu haben, kannst Du die Funktion
`theme_asset` verwenden: 
```html
<link rel="stylesheet" href="{{ theme_asset('css/style.css') }}">
```

#### Aktueller Benutzer

Der aktuelle Benutzer kann mit der Funktion `auth()->user()` abgerufen werden.
Weitere Informationen zur Authentifizierung findest Du in der [Laravel-Dokumentation](https://laravel.com/docs/authentication).

#### Funktionen

Du kannst eine bestimmte Anzahl von Parametern
von der Website über die dafür vorgesehenen Funktionen abrufen:

|    Fonction      |               Description                 |
| ---------------- | ----------------------------------------- |
| `site_name()`    | Ruft den Site-Namen ab                   |
| `site_logo()`    | Ermöglicht Dir den Link zum Website-Logo  |
| `favicon()`      | Ermöglicht es Dir, den Favicon-Link zu haben       |
| `format_date()`  | Zeigt ein mit der aktuellen Sprache formatiertes Datum an. Diese Funktion verwendet eine Instanz von `Carbon\Carbon` als Parameter |
| `money_name()`   | Gibt den Namen der Währung der Website zurück   |
| `format_money()` | Gibt einen mit der Website-Währung formatierten Betrag zurück |

#### Die Spieler anzeigen, die mit dem Server verbunden sind

Um die verbundenen Spieler anzuzeigen, überprüfen Sie einfach,
dass die Variable `$server` nicht null ist und der Server online ist. Wenn dies der Fall ist,
verwende `$server->getOnlinePlayers()`, um die Anzahl der Online-Spieler abzurufen.

```blade
@if($server && $server->isOnline())
    {{ trans_choice('messages.server.online', $server->getOnlinePlayers()) }}
@else
    {{ trans('messages.server.offline') }}
@endif
```

#### Übersetzungen

Ein Theme kann bei Bedarf Übersetzungen laden.

Erstelle dazu einfach eine Messages.php-Datei im `lang/<language>`-Verzeichnis (zB: lang/en)
eines Themes dann kannst Du eine Übersetzung über die trans: `{{ trans('theme::messages.hello') }}`
oder über die `@lang`-Direktive: `@lang('theme::messages.hello')` anzeigen.
Du kannst auch `trans_choice` für eine Übersetzung mit Zahlen und `trans_bool` verwenden,
um einen booleschen Wert zu übersetzen (wird in Englisch `Yes` zurückgegeben).`/No`.

Weitere Informationen zu Übersetzungen findest Du in der [Laravel-Dokumentation](https://laravel.com/docs/localization).


### Konfiguration

Du kannst eine Konfiguration in einem Thema hinzufügen,
dazu musst Du diese nur im Stammverzeichnis eines Themas erstellen:
* Eine `config/config.blade.php`-Ansicht, die das Formular für die Konfiguration enthält.
* Eine Datei `config/rules.php`, die die verschiedenen Validierungsregeln für die Konfiguration eines Themes enthält.
* Eine Datei `config.json`, in der die Designkonfiguration gespeichert wird und die die Standardwerte enthält.

##### Beispiel

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
