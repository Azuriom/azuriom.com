---
title: Liaison Site-Serveur
weight: 2
---

# Liaison Site-Serveur

## Minecraft

### Introduction

Certaines fonctionnalités comme afficher les joueurs en
ligne ou exécuter des commandes nécessitent de relier votre serveur à votre
site web, sur Azuriom cela peut être fait de 3 façons différentes :

* Par Ping - **C'est la solution la plus simple, mais aussi la plus limitée** :
elle permet juste de récupérer les joueurs connectés au serveur
_(ne permet pas d'exécuter de commandes)_.

* Par Rcon - **C'est la solution intermédiaire**, elle permet de récupérer les informations 
de du serveur et d'y exécuter des commandes.

* Par Plugin - **C'est la meilleure solution**, elle permet d'avoir les fonctionnalités du Rcon
tout en ajoutant des fonctionnalités plus poussées _(exemple : un système de statistiques avancées)_.

### Liaison par Ping

Pour pouvoir lier un serveur avec un site sous Azuriom par ping, 
il faut juste ajouter un nouveau serveur avec comme type de liaison "Ping"
et remplir les informations demandées _(le port par défaut de Minecraft est `25565`)_.

### Liaison par Rcon

Pour pouvoir lier un serveur avec un site sous Azuriom par Rcon, il faut :

1. Vous rendre dans le fichier `server.properties` de votre serveur

1. Configurer ce fichier de la façon suivante :
    * Mettre `enable-rcon` en `true`
    * Mettre `rcon.password` avec `votre-mot-de-passe`
    * Mettre `rcon.port` avec `votre-port` _(par défaut `25575`)_
    * Sauvegarder et redémarrer votre serveur
   
1. Vous rendre sur votre site et ajouter un nouveau serveur avec comme type de liaison "Rcon"
et remplir les informations demandées _(le port Rcon par défaut est `25575`)_.

### Liaison par plugin (AzLink)

#### Qu'est-ce qu'AzLink ?

AzLink est un plugin de liaison site-serveur spécialement conçu pour et par Azuriom 
afin de vous permettre de lier un serveur Minecraft à un site sous Azuriom de façon simple,
rapide et sécurisée.

Actuellement AzLink supporte Bukkit/Spigot, BungeeCord, Sponge et Velocity dans le même plugin.
Une version legacy est disponible pour les serveurs utilisant Bukkit 1.7.10.

#### Installation

1. Télécharger AzLink sur [notre site](https://azuriom.com/azlink)

1. Installer AzLink sur le serveur en le mettant dans le dossier `plugins/`
(ou `mods/` pour Sponge) et redémarrer le serveur.

1. Aller sur le site et ajouter un nouveau serveur avec comme type de liaison "AzLink", 
suivre les étapes de liaison et remplir les informations demandées.

## Jeux Steam

### Introduction

Cette liste comprend les serveurs sous les jeux suivants : Ark, CS:GO, Garry's Mod & Team fortress 2.
Dans ce cas, vous pouvez relier votre serveur à votre site de deux façons :

* Par Query - elle permet juste de récupérer les joueurs connectés au serveur
_(ne permet pas d'exécuter de commandes)_.

* Par Rcon - elle permet de récupérer les informations 
de du serveur et d'y exécuter des commandes.

Vous pouvez vérifier ici les ports par défaut :

|    Jeu      | Port  | Query | RCON  |
| ----------- | ----- | ----- | ----- |
| Garry's Mod | 27015 | 27015 | 27015 |
|     ARK     | 7777  | 27015 | 27020 |
|   CS:GO     | 27015 | 27015 | 27015 |
|    TF2      | 27015 | 27015 | 27015 |

### Liaison par Query

Pour pouvoir lier un serveur avec un site sous Azuriom par Query, 
il faut juste ajouter un nouveau serveur avec comme type de liaison "Source Query"
et remplir les informations demandées.

### Liaison par Rcon

Pour pouvoir relier votre serveur à votre site web sous Azuriom par Rcon, 
Vous devez :

1. Aller dans le fichier où se trouvent les informations Rcon de votre serveur.
   
1. Aller sur votre site et ajouter un nouveau serveur avec comme type de liaison "Source Rcon"
et remplir les informations demandées.
