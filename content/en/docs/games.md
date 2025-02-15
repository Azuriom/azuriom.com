---
title: Custom Games
---

# Game Development

Azuriom supports custom games, which means you can create a plugin to add a game
that is not natively supported by Azuriom.

{{< info >}}
Installing Azuriom locally is highly recommended to simplify game development.
When Azuriom is installed locally, debug mode can be enabled for easier development,
by editing the following lines in the `.env` file:
```env
APP_ENV=local
APP_DEBUG=true
```
{{< /info >}}

## Installation

If Azuriom is already installed, you can skip this step.
Otherwise, you can install Azuriom by following the [installation guide](installation).
During the installation process, immediately after the database configuration, when prompted to choose a game,
manually navigate to the URL `/install/game/custom` to install Azuriom without a game.

Once Azuriom is installed, you can create an admin user by running the following command in a terminal:
```sh
php artisan user:create --admin
```

## Creating a Game

The recommended way to create a game plugin is to use the following command, which generates the required files:
```sh
php artisan game:create <game name>
```

## `Game` Class

The heart of the game plugin is the game class, which extends the `Azuriom\Games\Game` class.

### OAuth Login

Azuriom uses Laravel Socialite for OAuth login. For more information about Socialite,
and how to add a new driver, see the [Socialite documentation](https://laravel.com/docs/socialite).

To automatically log in a user with OAuth, you need to implement the `loginWithOAuth()`
and `getSocialiteDriverName()` methods in the game class:
```php
public function loginWithOAuth(): bool
{
    return true;
}

public function getSocialiteDriverName(): string
{
    return 'steam'; // The name of a Laravel Socialite driver
}
```

## Server Bridge

The server bridge is used to retrieve information from the game server, such as the number of online players,
and to send commands to the game server.

A `ServerBridge` instance always includes an associated `Azuriom\Models\Server` instance,
which stores the server information and can be accessed via the `$this->server property.

The method `getServerData()` should return an array containing the server information,
including at least the `players key for the current number of online players and the `max_players` key for the maximum number of players.

If the server bridge supports sending commands to the game server, the `canExecuteCommand()` method should
return `true`, and you should implement the `sendCommands()` method should be implemented to send commands to the game server.

For a real-world example, you can look at the [Flyff game server bridge](https://github.com/AzuriomCommunity/Game-Flyff/blob/master/src/Games/FlyffServerBridge.php)
or the [Rust Rcon bridge](https://github.com/Azuriom/Azuriom/blob/master/app/Games/Steam/Servers/RustRcon.php).
