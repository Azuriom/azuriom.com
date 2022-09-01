---
title: Tema
---

# Tema

## Perkenalan

Sebuah tema memperbolehkan anda untuk mengkostumisasi penglihatan dan rasa dari website yang menggunakan Azuriom.

Untuk mengunduh sebuah Tema, masukkan saja ke folder `resources/themes/` di
root website anda.

{{< warn >}}
Saat Azuriom telah diunduh secara lokal untuk pengembangan tema,
Sangat di rekomendasikan untuk menyalakan debug untuk mempermudah pengembangan.
Ini bisa di lakukan dengan mengubah dari 2 baris di file `.env`:
```
APP_ENV=local
APP_DEBUG=true
```
{{< /warn >}}

## Membuat sebuah Tema

Untuk secara cepat membuat sebuah tema anda bisa menggunakan perintah sebagai berikut yang akan
secara otomatis menghasilkan direksi tema dan file `theme.json`:
```
php artisan theme:create <nama tema>
```

{{< info >}}
Untuk membuat tema dengan setelan webpack yang lebih lanjut untuk mengcompile
file SASS dan mengoptimasi file JavaScript, anda bisa menggunakan ini
[boilerplate yang tidak resmi](https://github.com/nolway/azuriom-theme-boilerplate)
(anda juga harus mengunduh [Node.js](https://nodejs.org) dengan NPM)
{{< /info >}}

### Struktur

```
themes/ <-- Folder mengenai semua tema yang diunduh
| example/ <-- ID tema anda
| | theme.json <-- File utama dari tema anda yang mengandung berbagai macama informasi
| |  assets/  <-- Folder yang berisi tentang aset dari tema anda (css, js, foto, svg, etc)
| | views/ <-- Folder ini berisi tentang views dari tema anda.
| | config/
| | | config.blade.php
| | | rules.php
| | config.json
```

### File theme.json

Semua tema harus memiliki file `theme.json` di root mereka, ini adalah
salah satu elemen yang penting untuk sebuah tema, dan itu terlihat seperti ini:
```json
{
    "id": "contoh",
    "name": "Contoh",
    "version": "1.0.0",
    "description": "Sebuah Tema.",
    "url": "https://azuriom.com",
    "authors": [
        "Azuriom"
    ],
    "azuriom_api": "1.0.0"
}
```

#### ID Tema

Setiap tema harus memiliki ID, yang dimana harus unik dan hanya mengandung angka saja,
huruf kecil dan garis. Sangat disarankan untuk menggunakan nama tema sebagai patokan untuk
membuat sebuah ID, sebagai contoh jika namanya adalah `Halo Dunia`, maka ID nya akan menjadi
`halo-dunia`. Juga, direksi tema harus memiliki nama yang sama dengan ID nya.  

### Views

Views merupakan jantung dari tema, mereka adalah file berisi HTML dari
sebuah tema untuk berbagai bagian dari website. 

Azuriom menggunakan [Laravel](https://laravel.com/), views bisa dibuat dengan menggunakan
template Blade. Jika anda tidak mengerti mengenai Blade ini sangat disarankan untuk membaca
[Dokumentasinya](https://laravel.com/docs/blade), apalagi itu lumayan pendek.

{{< warn >}}
Sangat di sarankan untuk TIDAK menggunakan syntax PHP.
saat anda bekerja dengan Blade, karena Blade tidak membawa anda ke tradisional
tidak ada kelebihan dan hanya kekurangan.
{{< /warn >}}

Di bagian CSS, sangat di sarankan untuk menggunakan framework yang sudah di gunakan oleh CMS yaitu [Bootstrap 4](https://getbootstrap.com), 
ini akan membuatnya lebih mudah untuk diketahui sebuah tema dan akan langsung cocok dengan plugin baru. 
jadi anda tidak perlu melakukan pembaruan yang sering.
Tapi jika anda ingin menggunakan CSS Framework yang lain.

Di Javascript, dependency yang diperlukan hanyalah [Axios](https://github.com/axios/axios).

{{< info >}}
Jika sebuah view tidak ada di sebuah tema tapi ada di CMS atau di plugin, 
itu akan secara otomatis digunakan.
{{< /info >}}

#### Tata Letak

Tata Letak adalah struktur dari semua halaman dari tema. Ini berisi
tentu saja metas, aset dari tema tersebut, header, footer etc...

Untuk memperlihatkan konten untuk halaman yang sekarang anda bisa menggunakan
`@yield('content')`, dan untuk memperlihatkan judul dari halaman sekarang anda bisa
menggunakan `@yield('title')`.

Anda juga dapat mengintegrasi elemen berbeda dengan
`@include('<nama dari view>')`, contohnya `@include('element.navbar')` untuk
memasukkan navbar.

Untuk memberikan tata letak dari sebuah halaman, view harus memperlihatkan view tersebut berisi
tata letak tersebut, anda juga bisa menggunakan tata letak yang sudah disediakan dengan
`@extends('layouts.app')`, atau buat tata letak anda sendiri dan memperluasnya.

#### Plugin views

Untuk mengganti views dari sebuah plugin, dengan mudah membuat direktori `plugins` dalam
folder `views` dalam tema dan membuat folder untuk setiap plugin (menggunakan
ID plugin dan bukan nama plugin), lalu tambahkan views plugin.

Contohnya, untuk plugin vote, ini akan memberikan `views/plugins/vote/index.blade.php`.

### Metode

#### Aset

Untuk mempunyai tautan untuk sebuah aset dalam sebuah tema anda bisa menggunakan
`theme_asset`: 
```html
<link rel="stylesheet" href="{{ theme_asset('css/style.css') }}">
```

#### Pengguna Saat ini

Pengguna saat ini bisa mengembalikan menggunakan fungsi `auth()->user()`.
Untuk detail lebih lanjut dalam autentikasi, anda bisa membaca
[Dokumentasi Laravel](https://laravel.com/docs/authentication).

#### Fungsi

Anda bisa mengembalikan sebuah jumlah parameter dari website menggunakan fungsi
dedikasi:

|      Fungsi      |               Deskripsi                   |
| ---------------- | ----------------------------------------- |
| `site_name()`    | Memunculkan nama website                  |
| `site_logo()`    | Memperbolehkan anda mendapatkan tautan logo website  |
| `favicon()`      | Memperbolehkan anda untuk mendapatkan tautan favicon |
| `format_date()`  | Memperlihatkan tanggal yang diformat dengan bahasa saat itu. Fungsi mengambil contoh dari `Carbon\Carbon` sebagai parameter |
| `money_name()`   | Memberikan nama dari mata uang website    |
| `format_money()` | Memberikan jumlah diformst dengan mata uang website  |

#### Menunjukan pemain yang terhubung dengan server

Untuk memperlihatkan pemain yang terhubung, hanya periksa dengan variabel `$server` bukan null,
dan servernya online, dan jika itu benar, gunakan `$server->getOnlinePlayers()` untuk
memberikan jumlah pemain yang online.

```blade
@if($server && $server->isOnline())
    {{ trans_choice('messages.server.online', $server->getOnlinePlayers()) }}
@else
    {{ trans('messages.server.offline') }}
@endif
```

#### Terjemahan

Sebuah tema bisa, jika diperlukan, memuat terjemahan.

Untuk melakukannya, hanya buat sebuah file `messages.php` di dalam direktori `lang/<language>` (contohnya: `lang/en`).
dari sebuah tema, anda akan bisa menampilkan sebuah terjemahan melalui
trans: `{{ trans('theme::messages.hello') }}` atau melalui `@lang`: 
`@lang('theme::messages.hello')`.
Anda juga bisa menggunakan `trans_choice` untuk terjemahan dengan
angka, dan `trans_bool` untuk menerjemahkan sebuah boolean (akan muncul dalam Inggris `Yes`).
/`No`.

Untuk detail lebih lanjut mengenai terjemahan, anda bisa membaca
[Dokumentasi Laravel](https://laravel.com/docs/localization).


### Konfigurasi

Anda bisa menambahkan konfigurasi di sebuah tema, untuk melakukannya anda hanya harus
membuat sebuah root untuk sebuah tema:
* Sebuah view `config/config.blade.php` berisi forum untuk konfigurasi.
* Sebuah file `config/rules.php` berisi validasi peraturan yang berbeda untuk
mengkonfigurasi tema.
* Sebuah file `config.json` dimana konfigurasi tema akan disimpan, dan berisi tentang nilai yang sudah dipilih. 

##### Contoh

config.blade.php
```html
<form action="{{ route('admin.themes.update', $theme) }}" method="POST">
    @csrf

    <div class="form-group">
        <label for="discordInput">{{ trans('theme::carbon.config.discord') }}</label>
        <input type="text" class="form-control @error('discord-id') is-invalid @enderror" id="discordInput" name="discord-id" required value="{{ old('discord-id', config('theme.discord-id')) }}">

        @error('discord-id')
        <span class="invalid-feedback" role="alert"><strong>{{ $message }}</strong></span>
        @enderror
    </div>

    <button type="submit" class="btn btn-primary">
        <i class="fas fa-save"></i> {{ trans('messages.actions.save') }}
    </button>
</form>
```

config.json
```json
{
    "discord-id": "625774284823986183."
}
```
