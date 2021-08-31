---
title: Server link
weight: 2
---

# Server link

## Minecraft

### Introductie

Sommige functies, zoals het online weergeven van spelers of
om opdrachten uit te voeren waarvoor u uw server moet koppelen aan uw
website, op Azuriom kan dit op 3 verschillende manieren.

* Door Ping - **Dit is de eenvoudigste, maar ook de meest beperkte oplossing**, je krijgt er alleen
de spelers die op uw server online zijn. _(staat niet toe dat opdrachten uitgevoerd worden)_

* Door Rcon - **Dit is de tussenoplossing**, hiermee kunt u de informatie ophalen 
van uw server en opdrachten uitvoeren.

* Door plug-in - **Dit is de optimale oplossing**, hiermee krijgt u de functionaliteit van de Rcon
maar met meer geavanceerde functionaliteiten _(bijvoorbeeld: een geavanceerde statistieken systeem)_

### Link Door Ping

Om uw server te kunnen koppelen met een site op Azuriom door te pingen,
Hoef je alleen maar een nieuwe server toe te voegen met "Ping" als het linktype,
en vul de gevraagde informatie in _(de standaard poort van Minecraft is `25565`)_.

### link Door Rcon

Om uw server te kunnen koppelen met uw website op Azuriom door Rcon,
Moet je:

1. Ga naar het bestand `server.properties` van je server.

1. Configureer dit bestand als volgt:
    * Zet `enable-rcon` op `true`.
    * Zet `rcon.password` met `jouw-wachtwoord`.
    * Stel `rcon.port` in met `jouw-poort` _(standaard 25575)_
    * Back-up en herstart uw server.
   
1. Ga naar je site en voeg een nieuwe server toe met het linktype "Rcon",
en vul de gevraagde gegevens in. _(Standaard Rcon-poort is 25575)_.

### Plug-in link

#### Wat is AzLink?

AzLink is een site-naar-server link plug-in die speciaal is ontworpen voor en door Azuriom.
Zodat u uw server eenvoudig, snel en veilig aan uw site kunt koppelen.

AzLink ondersteunt momenteel Bukkit, BungeeCord, Sponge en Velocity in dezelfde plug-in.
Er is een legacy-versie beschikbaar voor Bukkit 1.7.10.

#### Installeren

1. Download AzLink van [onze site](https://azuriom.com/azlink)

1. Installeer het op de server in de map `plugins/` (of `mods/` met Sponge)
en herstart de server.

1. Ga naar je site en voeg een nieuwe server toe met het linktype "AzLink",
volg de link-stappen en vul de gevraagde gegevens in.

## Steam Spellen

### Introductie

Deze lijst bevat servers van de volgende spellen: Ark, CS:GO, Garry's Mod & Team Fortress 2.
U kunt in dit geval op twee manieren uw server aan uw site koppelen:

* Door Query - hiermee kunt u zien welke spelers
online zijn op de server. _(staat niet toe dat er opdrachten worden uitgevoerd)_

* Door Rcon - het stelt u in staat om informatie op te halen
van uw server en opdrachten uit te voeren.

U kunt hier controleren op standaard poorten:

|    Spel     | Poort | Query | RCON  |
| ----------- | ----- | ----- | ----- |
| Garry's Mod | 27015 | 27015 | 27015 |
|     ARK     | 7777  | 27015 | 27020 |
|   CS:GO     | 27015 | 27015 | 27015 |
|    TF2      | 27015 | 27015 | 27015 |

### Link Door Query

Om uw server te kunnen koppelen met een site onder Azuriom door
middel van een zoekopdracht, hoef je alleen maar een nieuwe server toe te voegen
met "Bronquery" als het linktype, en vul de gevraagde gegevens in.

### Link Door Rcon

Om uw server te kunnen koppelen met uw website onder Azuriom door Rcon.
Moet je:

1. Ga naar het bestand waar de Rcon informatie van uw server te vinden is.
   
1. Ga naar je site en voeg een nieuwe server toe met het linktype "Source Rcon",
en vul de gevraagde gegevens in.