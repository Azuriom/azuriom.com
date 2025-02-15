---
title: Jeux Customs
---

# Développement d'un Jeu

Azuriom prend en charge les jeux personnalisés, ce qui signifie que vous pouvez
créer un plugin pour ajouter un jeu qui n'est pas supporté nativement par Azuriom.

{{< info >}}
L'installation d'Azuriom en locale est fortement recommandée pour simplifier le développement de jeux.
Lorsque Azuriom est installé localement, le mode debug peut être activé en modifiant les lignes suivantes dans
le fichier `.env` :
```env
APP_ENV=local
APP_DEBUG=true
```
{{< /info >}}

## Installation

Si Azuriom est déjà installé, vous pouvez passer cette étape.
Sinon, vous pouvez installer Azuriom en suivant le [guide d'installation](installation).
Pendant le processus d'installation, juste après la configuration de la base de données,
lorsqu'il vous est demandé de choisir un jeu, allez manuellement sur l'URL `/install/game/custom` de votre site
pour installer Azuriom sans jeu.

Une fois Azuriom installé, vous pouvez créer un utilisateur administrateur en
exécutant la commande suivante dans un terminal :
```sh
php artisan user:create --admin
```

## Création d'un Jeu

La façon recommandée de créer un plugin de jeu est en utilisant la commande suivante pour générer les fichiers requis :
```sh
php artisan game:create <nom_du_jeu>
```

## Classe du Jeu

Le cœur du plugin de jeu est la classe du jeu, qui étend la classe `Azuriom\Games\Game`.

### Connexion OAuth

Azuriom utilise Laravel Socialite pour la connexion OAuth. Pour plus d'informations sur Socialite,
et sur comment ajouter un nouveau driver, consultez la [documentation Socialite](https://laravel.com/docs/socialite).

Pour connecter automatiquement un utilisateur via OAuth, vous devez implémenter les
méthodes `loginWithOAuth()` et `getSocialiteDriverName()` dans la classe du jeu :
```php
public function loginWithOAuth(): bool
{
    return true;
}

public function getSocialiteDriverName(): string
{
    return 'steam'; // Le nom d'un driver Laravel Socialite
}
```

## Connexion au Serveur

La connexion au serveur est utilisée pour récupérer les informations du serveur de jeu,
comme le nombre de joueurs en ligne, et pour envoyer des commandes au serveur de jeu.

Une instance de `ServerBridge` inclut toujours une instance associée de `Azuriom\Models\Server`,
qui stocke les informations du serveur, et est accessible via la propriété `$this->server`.

La méthode `getServerData()` retourne un tableau contenant les informations du serveur,
incluant au moins la clé `players` pour le nombre actuel de joueurs en ligne
et la clé `max_players` pour le nombre maximum de joueurs.

Si la connexion au serveur prend en charge l'envoi de commandes au serveur de jeu,
la méthode `canExecuteCommand()` doit retourner `true`, et vous devez implémenter
la méthode `sendCommands()` pour envoyer des commandes au serveur de jeu.

Pour un exemple concret, vous pouvez consulter la [connexion à un serveur Flyff](https://github.com/AzuriomCommunity/Game-Flyff/blob/master/src/Games/FlyffServerBridge.php)
ou la [connexion Rcon pour Rust](https://github.com/Azuriom/Azuriom/blob/master/app/Games/Steam/Servers/RustRcon.php).
