---
title: Menghubungkan Server
weight: 2
---

# Menghubungkan Server

## Minecraft

### Perkenalan

Beberapa fitur seperti menampilkan pemain yang online atau
mengeksekusi perintah yang diperlukan untuk menghubungkan ke server anda ke website
anda, di Azuriom ini bisa lakukan dalam 3 cara yang berbeda:

* Dengan Ping - **Ini adalah yang paling Mudah, tapi juga solusi yang terbatas**, ini hanya memperbolehkan anda untuk mendapatkan 
pemain yang terhubung dengan server anda. _(tidak bisa mengeksekusi perintah)_

* Dengan Rcon - **Ini adalah solusi menengah**, ini memperbolehkan anda untuk mengambil informasi 
dari server anda dan mengeksekusi perintah.

* Dengan Plugin - **Ini adalah solusi optimal**, ini akan memperbolehkan anda untuk fungsi seperti Rcon
tapi dengan fungsi yang lebih banyak _(contoh: sebuah sistem statistik yang lebih maju)_

### Terhubung dengan Ping

Supaya bisa menghubungkan server anda dengan website dibawah Azuriom dengan ping, 
anda hanya perlu menambahkan server baru dengan "Ping" sebagai tipe menghubung,
dan isi semua informasi yang diperlukan _(port biasanya dari Minecraft adalah `25565`)_.

### Terhubung dengan Rcon

To be able to link your server with your website under Azuriom by Rcon, 
You must:

1. Go to the `server.properties` file of your server

1. Configure this file as follows:
    * Set `enable-rcon` to `true`.
    * Put `rcon.password` with `your-password`.
    * Set `rcon.port` with `your-port` _(default 25575)_
    * Backup and restart your server
   
1. Go to your site, add a new server with the link type "Rcon",
and fill in the requested information. _(Default Rcon port is 25575)_.

### Link by Plugin

#### What is AzLink?

AzLink is a site-to-server link plugin specially designed for and by Azuriom. 
to allow you to link your server to your site simply, quickly and securely.

AzLink currently supports Bukkit, BungeeCord, Sponge and Velocity in the same plugin.
A legacy version is available for Bukkit 1.7.10.

#### Installation

1. Download AzLink from [our site](https://azuriom.com/azlink)

1. Install it on the server in the `plugins/` folder (or `mods/` with Sponge)
and restart the server.

1. Go to your site and add a new server with the link type "AzLink", 
follow the link steps and fill in the requested information.

## Steam Games

### Introduction

This list includes the servers of the following games: Ark, CS:GO, Garry's Mod & Team fortress 2.
You can link your server with your site in two ways in this case:

* By Query - it just allows you to get 
the players connected to your server. _(does not allow executing commands)_

* By Rcon - it allows you to retrieve the information 
of your server and execute commands.

You can check here for default ports:

|    Game     | Port  | Query | RCON  |
| ----------- | ----- | ----- | ----- |
| Garry's Mod | 27015 | 27015 | 27015 |
|     ARK     | 7777  | 27015 | 27020 |
|   CS:GO     | 27015 | 27015 | 27015 |
|    TF2      | 27015 | 27015 | 27015 |

### Link By Query

To be able to link your server with a site under Azuriom by query, 
you just have to add a new server with "Source Query" as the link type,
and fill in the requested information.

### Link by Rcon

To be able to link your server with your website under Azuriom by Rcon, 
You must:

1. Go to the file where the Rcon information of your server can be found.
   
1. Go to your site, add a new server with the link type "Source Rcon",
and fill in the requested information.
