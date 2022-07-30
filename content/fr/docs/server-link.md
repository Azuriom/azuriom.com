---
title: Liaison Site-Serveur
weight: 2
---

# Liaison Site-Serveur

## Minecraft

### Introduction

Certaines fonctionnalités comme afficher les joueurs en
ligne ou exécuter des commandes nécessitent de relier votre serveur à votre
site web. Avec Azuriom, cela peut être fait de 3 façons différentes :

* Par Ping - **C'est la solution la plus simple, mais aussi la plus limitée** :
elle permet simplement de récupérer les joueurs connectés au serveur
_(ne permet pas d'exécuter de commandes)_.

* Par RCON - **C'est la solution intermédiaire**, elle permet de récupérer les informations 
du serveur et d'y exécuter des commandes.

* Par Plugin - **C'est la meilleure solution**, elle permet d'avoir les fonctionnalités du RCON
tout en ajoutant des fonctionnalités plus poussées _(exemple : un système de statistiques avancées)_.

### Liaison par Ping

Pour lier un serveur Minecraft avec un site sous Azuriom par ping, 
il suffit d'ajouter un nouveau serveur via l'interface d'administration en spécifiant le type de liaison "Ping"
et de remplir les informations demandées _(le port par défaut de Minecraft est `25565`)_.

### Liaison par Rcon

Pour lier un serveur Minecraft avec un site sous Azuriom par RCON, il faut :

1. Vous rendre dans le fichier `server.properties` de votre serveur

1. Modifier certains paramètres de cette façon :
    * Mettre `enable-rcon` en `true`
    * Mettre `rcon.password` avec `votre-mot-de-passe`
    * Mettre `rcon.port` avec `votre-port` _(par défaut `25575`)_
    * Sauvegarder le fichier et redémarrer votre serveur
   
1. Vous rendre sur l'interface d'administration de votre site et d'y ajouter un nouveau serveur en spécifiant le type de liaison "RCON"
et de remplir les informations demandées _(le port Rcon par défaut est `25575`)_.

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

1. Se rendre sur l'interface d'administration de votre site et y ajouter un nouveau serveur en spécifiant le type de liaison "AzLink", 
suivre les étapes de liaison en remplissant les informations demandées.

## Jeux Steam

### Introduction

Cette liste comprend les serveurs des jeux suivants : Ark, CS:GO, Garry's Mod & Team Fortress 2.
Dans ce cas, vous pouvez relier votre serveur à votre site de deux façons :

* Par Query - elle permet seulement de récupérer les joueurs connectés au serveur
_(ne permet pas d'exécuter de commandes)_.

* Par RCON - elle permet de récupérer les informations 
du serveur et d'y exécuter des commandes.

Vous pouvez vérifier ici les ports par défaut de chaque serveur de jeu :

| Jeu         | Port  | Query | RCON  |
|-------------|-------|-------|-------|
| Garry's Mod | 27015 | 27015 | 27015 |
| ARK         | 7777  | 27015 | 27020 |
| CS:GO       | 27015 | 27015 | 27015 |
| TF2         | 27015 | 27015 | 27015 |

### Liaison par Query

Pour lier un serveur avec un site Azuriom par Query, 
il suffit d'ajouter un nouveau serveur en spécifiant le type de liaison "Source Query"
et de remplir les informations demandées.

### Liaison par RCON

Pour relier votre serveur à votre site web Azuriom par le protocole RCON, vous devez :

1. Ouvrir le fichier où se trouvent les informations RCON de votre serveur.
   
1. Activer le protocole RCON, définir un mot de passe et un port.

1. Se rendre sur l'interface d'administration de votre site et y ajouter un nouveau serveur en spécifiant le type de liaison "Source Rcon"
et remplir les informations demandées.
