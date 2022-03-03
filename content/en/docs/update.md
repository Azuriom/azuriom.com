---
title: Azuriom 1.0
---

# Azuriom 1.0

## Introduction

Azuriom 1.0 is the new major version of Azuriom, it contains many changes and aims to keep
Azuriom future-proof.

This update contains many internal changes, in particular the update to Laravel 9 ([Laravel](https://laravel.com/) being
the PHP framework - the base - used by Azuriom) and Bootstrap 5 ([Bootstrap](https://getbootstrap.com/) being the CSS
framework used by Azuriom).

### PHP 8

In particular, the use of Laravel 9 means that **PHP 8 is now required to use Azuriom**.
We would also like note that **PHP 7.4 is no longer supported by PHP** since November 2021 and will **no longer receive
security updates** as of November 2022 (see the [PHP website](https://www.php.net/supported-versions.php)).
For this reason, we recommend that you update your sites using PHP (whether they use Azuriom or not) as soon as possible.

### Extensions

Due to various internal changes, extensions (themes and plugins) will have to be updated to support Azuriom v1.0.
Also extensions compatible with Azuriom v1.0 are not compatible with previous versions of Azuriom.

The layout of the basic design of the CMS and plugins has also been completely revised, in order to simplify the development
of themes as well as the general coherence between the plugins.

### Redesign of the connection system

The login system for Azuriom for Minecraft has also been redesigned, for Minecraft: Java Edition servers that do not
accept unofficial/offline versions of the game as well as for Minecraft: Bedrock Edition servers, it is now possible to
login directly via your Microsoft account.

For Minecraft: Java Edition servers that accept unofficial versions, it is also possible to automate the creation of an
account on the website with AzLink and the plugin [AuthMe reloaded](https://www.spigotmc.org/resources/authmereloaded.6269/).

These different new systems simplify the login on the site while eliminating the risk of users taking the wrong username.

Finally, for sites using the Steam connection, it is possible to add an email address in order to receive certain
alerts by email (for example when a response is received on the support plugin or when a purchase is made on the store). 
This feature is entirely optional.

## Update

Currently, Azuriom v1.0 is still under development, we strongly advise you not to use it in production or to update an
existing site. However, you can create a new site to test this version by downloading it
[here](https://azuriom.s3.fr-par.scw.cloud/dev/Azuriom-1.0.0-beta2.zip).

Feel free to report any bug or problem on GitHub or on our [Discord server](https://azuriom.com/discord).

## Adapting a theme

As Azuriom is now using Bootstrap 5, the themes will have to be adapted. We advise you to look at the
[Bootstrap 5 migration guide](https://getbootstrap.com/docs/5.1/migration/).

One notable change in using Bootstrap 5 is that jQuery is no longer included with Azuriom.
It is also not recommended using it.

Also, in order to improve future compatibility, we also advise themes to modify the HTML of the CMS and plugins as
little as possible, but to use CSS as much as possible. This avoids future compatibility problems in case of an update
with a modification of the HTML or when of the HTML or when adding new plugins.

{{< warn >}}
Due to many compatibility issues and outdated themes, themes on the market will be forced to respect this rule.
It is of course allowed to change the homepage or layout, as well as some additional pages, but it will not be allowed
to change all pages and/or plugins.
{{< /warn >}}

Finally, many translations have been improved and will need to be changed in the themes.

{{< warn >}}
In order for a theme to be loaded with Azuriom v1.0, it is **required** to add `"azuriom_api": "1.0.0",` in the `theme.json`:
```json
{
  "authors": [
    "..."
  ],
  "azuriom_api": "1.0.0"
}
```
{{< /warn >}}

### Social networks

Azuriom now has a dedicated configuration to add links to social networks directly from the settings. If you had an
equivalent configuration it is strongly recommended using the system provided by the CMS instead.
You can get the different links with the function `social_links()` like this:
```html
@foreach(social_links() as $link)
    <a href="{{ $link->value }}" title="{{ $link->title }}" target="_blank" rel="noopener noreferrer" class="btn">
        <i class="{{ $link->icon }} fa-2x" style="color: {{ $link->color }}"></i>
    </a>
@endforeach
```

### Home servers

It is now possible to display servers on the home page, which is especially useful for
Steam games.
The servers are available with the variable `$servers`, which gives for example:
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

### Servers join URL

An option has been added to display a link to the server instead of the address.
This is especially useful for servers for games with support for a URL to connect directly.
We recommend replacing all uses of the server address with something like this:
```html
@if($server->joinUrl())
    <a href="{{ $server->joinUrl() }}" class="btn btn-primary">
        {{ trans('messages.server.join') }}
    </a>
@else
    {{ $server->fullAddress() }}
@endif
```

## Adapting a plugin

Since Azuriom is now using Bootstrap 5, the plugins will have to be adapted. We advise you to look at the
[Bootstrap 5 migration guide](https://getbootstrap.com/docs/5.1/migration/).

Also Azuriom is now using Laravel 9 and PHP 8, we advise you to have a look at the
[Laravel 9 migration guide](https://laravel.com/docs/9.x/upgrade).

You can also take the opportunity to use the [new features introduced in PHP 8.0](https://www.php.net/releases/8.0/en.php)
(but it's 100% optional).

{{< warn >}}
In order for a plugin to be loaded with Azuriom v1.0, it is **required** to add `"azuriom_api": "1.0.0",` in the `plugin.json`:
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

### Service providers

It is now required to explicitly specify calls to the `trans` function in the `routeDescriptions()`, `userNavigation()` and `adminNavigation()` methods.

This results in the following modifications:
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

Calls to these methods are now lazy, i.e. the method will only be called when necessary.

Finally, the methods deprecated in older versions of Azuriom have all been removed.
