---
title: Server link
weight: 2
---

# Server link

## Minecraft

### Einführung

Einige Funktionen wie das Anzeigen von Spielern online oder das Ausführen von Befehlen,
die erfordern, dass Du Deinen Server mit Deiner Website verknüpfst,
kann auf Azuriom auf 3 verschiedene Arten erfolgen:

* Durch Ping - **Dies ist die einfachste, aber auch die begrenzteste Lösung**,
  sie ermöglicht es Dir nur, die Spieler mit Deinem Server zu verbinden.
  (_erlaubt keine Ausführung von Befehlen_)

* Durch Rcon - **Dies ist die Zwischenlösung**,
  mit der Du die Informationen Deines Servers abrufen und Befehle ausführen kannst.

* Durch Plugin - **Dies ist die optimale Lösung**,
  die es Dir ermöglicht, die Funktionalität des Rcon zu nutzen,
  jedoch mit erweiterten Funktionen (__Beispiel: ein fortschrittliches Statistiksystem__).

### Durch Ping verlinken

Um Deinen Server per Ping mit einer Site unter Azuriom verknüpfen zu können,
musst Du lediglich einen neuen Server mit „Ping“ als Linktyp hinzufügen
und die angeforderten Informationen eingeben _(der Standardport von Minecraft ist 25565)_.

### Durch Rcon verlinken

Um Deinen Server mit Deiner Website unter Azuriom durch Rcon verknüpfen zu können, musst Du:

1. Zur Datei `server.properties` auf deinen Server gehen

1. Konfiguriere diese datei wie folgt:
    * Setze `enable-rcon` auf `true`.
    * Setze bei `rcon.password` `Dein Passwort`.
    * Setze bei `rcon.port` `deinen Port` _(standart 25575)_
    * Backupe und starte deinen Server neu
   
1. Gehe zu Deiner Site, füge einen neuen Server mit dem Linktyp „Rcon“ hinzu
   und gebe die angeforderten Informationen ein. _(Der Standard-Rcon-Port ist 25575)_.

### Durch Plugin verlinken

#### Was ist AzLink

AzLink ist ein Site-to-Server-Link-Plugin, das speziell für und von Azuriom entwickelt wurde,
damit Du Deinen Server einfach, schnell und sicher mit Deiner Site verbinden kannst.

AzLink unterstützt aktuell Bukkit, BungeeCord, Sponge und Velocity im selben Plugin.
Für Bukkit 1.7.10 ist eine Legacy-Version verfügbar.

#### Installation

1. Lade AzLink von [unserer Site](https://azuriom.com/azlink) herunter

1. Installiere es im `plugins/` Ordner (oder `mods/` bei Sponge)
und starte den Server neu.

1. Gehe zu Deiner Seite und füge einen Server mit dem Linktyp "AzLink" hinzu, 
folge den Linkschritten und fülle die angeforderten Informationen aus.

## Steam Spiele

### Einführung

Diese Liste enthält die Server der folgenden Spiele:
Ark, CS:GO, Garry’s Mod & Team fortress 2.
In diesem Fall kannst Du Deinen Server auf zwei Arten mit Deiner Site verknüpfen:

* Durch Query - es ermöglicht Dir nur, die Spieler mit Deinem Server zu verbinden.
  _(erlaubt keine Ausführung von Befehlen)_
* Durch Rcon - es ermöglicht Dir, die Informationen Deines Servers abzurufen
  und Befehle auszuführen.

Du kannst hier nach Standardports suchen:

|    Game     | Port  | Query | RCON  |
| ----------- | ----- | ----- | ----- |
| Garry's Mod | 27015 | 27015 | 27015 |
|     ARK     | 7777  | 27015 | 27020 |
|   CS:GO     | 27015 | 27015 | 27015 |
|    TF2      | 27015 | 27015 | 27015 |

### Durch Query verlinken

Um Deinen Server per Abfrage mit einer Site unter Azuriom verknüpfen zu können,
musst Du lediglich einen neuen Server mit „Source Query“ als Link-Typ hinzufügen
und die angeforderten Informationen eingeben.

### Durch Rcon verlinken

Um Deinen Server mit Deiner Website unter Azuriom by Rcon verknüpfen zu können, musst Du:

1. Zu der Datei, in der die Rcon-Informationen Deines Servers zu finden sind, gehen.
   
1. Zu Deiner Site gehen, einen neuen Server mit dem Linktyp „Source Rcon“ hinzufügen
   und die angeforderten Informationen ausfüllen.