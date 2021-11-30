---
title: Propojení se serverem
weight: 2
---

# Propojení se serverem

## Minecraft

### Úvod

Některé funkce jako zobrazování online hráčů nebo
vykonávání příkazů vyžadují propojení vašeho serveru s vaším
webem, v Azuriomu toho lze dosáhnout třemi různými způsoby:

* Ping - **Toto je nejjednodušší, ale také nejomezenější způsob**, umožňuje pouze získat 
hráče připojené k vyšemu serveru. _(neumožňuje vykonávat příkazy)_

* Rcon - **Toto je prostřední způsob**, umožňuje vám získat informace 
o vašem serveru a vykonávat příkazy.

* Plugin - **Toto je optimální řešení**, umožňuje vám mít funkcionalitu Rconu 
ale s pokročilejšími funkcemi _(například pokročilý systém statistik)_

### Propojení pomocí pingu

Abyste mohli propojit váš server s Azuriom webem pomocí pingu, 
stačí přidat nový server s typem propojení "Ping",
a vyplňte požadované informace _(výchozí port Minecraftu je `25565`)_.

### Propojení pomocí Rconu

Abyste mohli propojit váš Azuriom web pomocí Rconu, 
musíš:

1. Jděte do souboru `server.properties` na vašem serveru

1. Nakonfigurujte tento soubor:
    * Nastavte `enable-rcon` na `true`.
    * Do `rcon.password` dejte `vaše-heslo`.
    * Nastavte `rcon.port` na `váš-port` _(výchozí 25575)_
    * Zálohujte a restartujte váš server
   
1. Jděte na váš web a přidejte nový server s typem propojení "Rcon",
a vyplňte požadované informace. _(Výchozí port Rcon je 25575)_.

### Propojení pomocí pluginu

#### Co je to AzLink?

AzLink je plugin na propojení webu a serveru vytvořený speciálně pro Azuriom.
Umožňuje vám jednoduše, rychle a bezpečně propojit váš server s vaším webem.

AzLink momentálně podporuje Bukkit, BungeeCord, Sponge a Velocity ve stejném pluginu.
Je také dostupná stará verze pro Bukkit 1.7.10.

#### Instalace

1. Stáhněte si AzLink z [našeho webu](https://azuriom.com/azlink)

1. Nainstalujte jej na server do složky `plugins/` (nebo `mods/` pokud používáte Sponge)
a restartujte server.

1. Jděte na váš web a přidejte nový server s typem propojení "AzLink", 
následujte kroky a vyplňte požadované informace.

## Steam hry

### Úvod

Tento seznam obsahuje servery následujících her: Ark, CS:GO, Garry's Mod a Team Fortress 2.
Váš server můžete s vaším webem v tomto případě propojit dvěma cestami:

* Query - umožňuje vám získat pouze
hráče připojené k vašemu serveru. _(neumožňuje vykonávat příkazy)_

* Rcon - umožňuje vám získat informace 
o vašem serveru a vykonávat příkazy.

Zde se můžete podívat na výchozí porty:

|     Hra     | Port  | Query | RCON  |
| ----------- | ----- | ----- | ----- |
| Garry's Mod | 27015 | 27015 | 27015 |
|     ARK     | 7777  | 27015 | 27020 |
|    CS:GO    | 27015 | 27015 | 27015 |
|     TF2     | 27015 | 27015 | 27015 |

### Propojení pomocí query

Abyste mohli propojit váš server s vaším Azuriom webem pomocí query, 
stačí přidat nový server s typem propojení "Zdrojová query",
a vyplnit požadované informace.

### Propojení pomocí Rconu

Abyste mohli propojit váš server s vaším Azuriom webem pomocí Rconu, 
musíte:

1. Jít do souboru s Rcon informacemi vašeho serveru.
   
1. Jít na váš web, přidat nový server s typem propojení "Zdrojový RCON",
a vyplnit požadované informace.
