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

Untuk bisa menghubungkan server anda dengan website anda dibawah Azuriom dengan Rcon, 
Anda harus:

1. Pergi ke file `server.properties` di server anda

1. Konfigurasikan file ini sebagai berikut:
    * Ganti `enable-rcon` menjadi `true`.
    * Masukkan `rcon.password` dengan `password-anda`.
    * Ganti `rcon.port` dengan `port-anda` _(bawaan 25575)_
    * Backup dan restart server anda
   
1. Pergi ke website, tambahkan server baru dengan tipe menghubung "Rcon",
dan masukkan ke informasi yang diminta. _(Rcon port bawaan adalah 25575)_.

### Terhubung dengan Plugin

#### Apa itu AzLink?

AzLink adalah sebuah plugin website-ke-server yang dibuat untuk dan Azuriom. 
untuk memperbolehkan anda untuk menghubungkan server anda ke website anda dengan mudah, cepat dan aman.

AzLink sementara ini mendukung Bukkit, BungeeCord, Sponge dan Velocity di plugin yang sama.
Sebuah versi legacy tersedia untuk Bukkit 1.7.10.

#### Pengunduhan

1. Unduh AzLink dari [website kami](https://azuriom.com/azlink)

1. Unduhkan ke server di folder `plugins/` (atau `mods/` dengan Sponge)
dan restart server.

1. Pergi ke website anda dan tambahkan server baru dengan menghubung tipe "AzLink", 
ikuti langkah menghubungkan dan masukkan data yang diminta.

## Permainan Steam

### Perkenalan

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
