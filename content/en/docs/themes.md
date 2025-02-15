---
title: Themes
weight: 6
---

# Themes Development

## Introduction

Themes are essential for a website as they define its entire appearance.
Dozens of ready-to-use themes are available on the market.
However, you can also create your own themes to tailor your website to your preferences.

{{< info >}}
Installing Azuriom locally is highly recommended to simplify theme development.
When Azuriom is installed locally, debug mode can be enabled for easier development,
by editing the following lines in the `.env` file:
```env
APP_ENV=local
APP_DEBUG=true
```
{{< /info >}}

## Creating a Theme

The recommended way to create a theme is to use the following command, which generates the required files:
```sh
php artisan theme:create <theme name>
```

## Theme Structure

```
themes/ <-- Folder containing all installed themes
| example/ <-- ID of the theme
| | theme.json <-- The file containing the theme information
| |  assets/  <-- The folder containing the theme assets (CSS, JS, images, etc.)
| | views/ <-- The folder containing the views of the theme
| | config/
| | | config.blade.php <-- The view containing the configuration form of the theme
| | | rules.php <-- The validation rules for the configuration of the theme
| | config.json <-- The default configuration of the theme
```

### `theme.json` file

A theme must include a `theme.json` file at the root of its directory, containing the basic information about the theme.
```json
{
    "id": "example",
    "name": "Example",
    "version": "1.0.0",
    "description": "A great theme.",
    "url": "https://azuriom.com",
    "authors": [
        "Azuriom"
    ],
    "azuriom_api": "1.2.0"
}
```

#### Identifier

A theme must have a unique id that contains only numbers, lowercase letters, and hyphens.
The id is used to identify the theme within the system and must match the name of the theme's folder.
For example, a theme named `Hello World` might have the id `hello-world`.

## Views

Azuriom is based on [Laravel](https://laravel.com) and uses the Blade template engine to create views.
For more information on Blade, see the [Blade documentation](https://laravel.com/docs/blade).

When rendering a view, Azuriom first searches for it within the theme; if not found, it then looks for it in Azuriom or in a plugin.
Parts of the views can be located in different places, allowing you to customize the default layout of Azuriom while retaining the default content of a view.

### Layout

The main layout for Azuriom is located in the file `views/layouts/base.blade.php`.
This layout contains the basic structure of the website, including the header, footer, and page content
(displayed using the `@yield('content')` directive).
All pages except the home page extend a sub-layout, `views/layouts/app.blade.php`, which extends the base layout.

Components can be included in the layout using the `@include` directive; for example, to include the navigation bar:
```html
@include('elements.navbar')
```

{{< warn >}}
It is highly recommended **not to modify** views other than the layout, components (such as the navbar), and the homepage, as doing so may cause compatibility issues with plugins and future updates.

Instead, CSS should be used to customize the appearance of the site.
{{< /warn >}}

### Theme Color

The default primary color of Bootstrap is blue (`#0d6efd`),
but Azuriom provides an easy way to change it by adding the following line in the `<head>` section of the layout
(after the Bootstrap CSS file), where `$color` is the hexadecimal color value:
```html
@include('elements.theme-color', ['color' => $color])
```

## Assets

Azuriom is based on [Bootstrap 5](https://getbootstrap.com) to ensure a consistent design across the website and its plugins,
and to benefit from a variety of great built-in components and utilities.
For more information on Bootstrap, see the [Bootstrap documentation](https://getbootstrap.com/docs/5.2/).

You can add new CSS/JavaScript files and images to the theme by placing them in its `assets` directory.
These files can then be included in the layout using the `theme_asset` function, which generates the correct URL for each asset.
```html
<link href="{{ theme_asset('css/style.css') }}" rel="stylesheet">
```

Please avoid using jQuery in your theme, as it is not included in Azuriom by default and can easily be replaced by vanilla JavaScript.

## Configuration

Themes can include a configuration form that allows users to easily customize the theme from the admin panel.

The configuration form is created in a Blade view file called `config.blade.php`
(located in the theme's `config` directory), which contains the fields required to configure the theme.
```html
<form action="{{ route('admin.themes.update', $theme) }}" method="POST">
    @csrf

    <div class="form-group">
        <label for="discordInput">{{ trans('theme::messages.discord') }}</label>
        <input type="text" class="form-control @error('discord') is-invalid @enderror" id="discordInput" name="discord" required value="{{ old('discord', theme_config('discord')) }}">

        @error('discord')
        <span class="invalid-feedback" role="alert"><strong>{{ $message }}</strong></span>
        @enderror
    </div>

    <button type="submit" class="btn btn-primary">
        <i class="bi bi-save"></i> {{ trans('messages.actions.save') }}
    </button>
</form>
```

To be able to save the configuration, the form must be submitted to the `admin.themes.update` route, with the theme as a parameter.
The configuration must be validated by providing a `rules.php` file in the theme's `config` directory, which contains the validation rules:
```php
<?php

return [
    'discord' => 'required|string',
];
```

The validation rules are the same as the Laravel validation rules, see the [Laravel documentation](https://laravel.com/docs/validation) for more information.

To set a default configuration for the theme, create a `config.json` file in the theme's root directory containing the default configuration in JSON format.
```json
{
    "discord": "https://azuriom.com/discord"
}
```

Finally, you can access the configuration in your views using the `theme_config` helper function, which accepts the configuration key as a parameter.
```php
<a href="{{ theme_config('discord') }}">Discord</a>
```

## Translations

Azuriom is fully translated into several languages, and themes can also be translated using Laravel's translation system.
Translations for a theme are stored in its `lang` directory, with one subdirectory per language containing PHP files with the translations.

For example, an English translation file would be stored in `lang/en/messages.php`:
```php
<?php

return [
    'hello' => 'Hello',
];
```

A translation can then be displayed in a view using the trans function with the theme:: prefix:
```html
<p>{{ trans('theme::messages.hello') }}</p>
```

To translate a boolean, you can use the `trans_bool` function, which returns "Yes" or "No" in English: `{{ trans_bool($boolean) }}`.
A date can be formatted with the `format_date` or `format_date_compatct` functions, which return the date formatted with the current language: `format_date($date)`.

For more information on translations, see the [Laravel documentation](https://laravel.com/docs/localization).

## Common Functions

Azuriom provides several functions to facilitate theme development and ensure consistency across the website:

| Function                                      | Description                                                                                                    |
|-----------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| `site_name(): string`                         | Return the site name, as defined in the settings                                                               |
| `site_logo(): string`                         | Returns the URL of the logo as defined in the settings                                                         |
| `favicon(): string`                           | Returns the URL of the favicon as defined in the settings                                                      |
| `format_date(Carbon $carbon): string`         | Formats a date according to the current language. The $carbon argument must be an instance of `Carbon\Carbon`  |
| `money_name(): string`                        | Returns the name of the website's currency                                                                     |
| `format_money(float $amount): string`         | Returns `$amount` formatted using the website's currency                                                       |
| `dark_theme(bool $defaultDark = false): bool` | Returns `true` if the current user is using the dark theme, `false` otherwise.                                 |
| `hex2rgb(string $hex): [int, int, int]`       | Converts the `$hex` color to an array containing the R,G,B values as integers.                                 |
| `color_contrast(string $hex): string`         | Returns either `#000` (black) or `#fff` (white), whichever provides higher contrast for the given `$hex` color |
| `trans(string $key): string`                  | Return the translation corresponding to the given `$key`                                                       |
| `trans_bool(bool $value): string`             | Returns the translation of the given boolean value. In English, this is 'Yes' or 'No'                          |
| `auth()->user(): \Azuriom\Models\User`        | Returns the authenticated user, or `null` if no user is authenticated                                          |

Laravel provides a lot of functions to facilitate the development of a website, for more information, see the [Laravel documentation](https://laravel.com/docs/helpers).

## Blade Directives

Azuriom and Laravel provide several Blade directives to facilitate theme development:

| Directive                               | Description                                                                    |
|-----------------------------------------|--------------------------------------------------------------------------------|
| `@plugin('<plugin id>') ... @endplugin` | Includes the enclosed code only if the plugin with the specified id is enabled |
| `@route('<route'>) ... @endroute`       | Includes the enclosed code only on the specified route                         |
| `@auth ... @endauth`                    | Includes the enclosed code only if the user is authenticated                   |
| `@guest ... @endguest`                  | Includes the enclosed code only if the user is not authenticated               |
| `@can('<permission>') ... @endcan`      | Includes the enclosed code only if the user has the given permission           |
