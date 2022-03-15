---
title: FAQ
weight: 3
---

# Resolusi Error

Errors dapat terjadi, ini selalu terjadi dari CMS,
tapi inilah kesalahan umum dengan solusinya!

## Masalah Umum

### Halaman utama bekerja, tapi halaman lainnya memberikan error 404

URL rewriting masih belum aktif, anda hanya harus mengaktifkannya (lihat pertanyaan selanjutnya).

### Apache2 URL rewrite
Anda harus mengubah file `/etc/apache2/sites-available/000-default.conf` dan tambahkan baris ini diantara and add tag `<VirtualHost>`:
```
<Directory "/var/www/html">
  AllowOverride All
</Directory>
```

Lalu restart Apache2 dengan
```
service apache2 restart
```

### Nginx URL rewrite
Anda harus mengubah configurasi laman anda (in `/etc/nginx/sites-available/`) dan tambahkan `/public` di akhiran
baris yang berisi `root`, seperti ini :
```
root /var/www/html/public;
```

Lalu restart Nginx dengan
```
service nginx restart
```


### Error 500 saat mendaftar

Jika akun tersebut dibuat dengan benar kesampingkan errornya, masalah ini terjadi jika
kiriman e-mail masuh belum dikonfigurasi secara benar, untuk ini periksa
konfigurasi untuk mengirim email di panel admin dari laman anda.

### cURL error 60

Jika anda mendapatkan error ini:
`curl: (60) SSL certificate: unable to get local issuer certificate`, ikuti saja
langkah-langkah ini:
1) Install `cacert.pem` terbaru di https://curl.haxx.se/ca/cacert.pem
1) Tambahkan baris ini di php.ini (mengganti `/path/to/cacert.pem` oleh
lokasi dari file `cacert.pem`):
   ```
   curl.cainfo="/path/to/cacert.pem""
   ```
1) Restart PHP

### File masih belum diunggah saat mengunggah sebuah foto

Masalah ini terjadi saat anda mengunggah sebuah foto dengan bobot yang lebih besar dari
maksimal yang diberikan PHP (Default 2mb).

Anda bisa mengubah ukuran yang diperbolehkan saat mengunggah di konfigurasi
PHP (pada `php.ini`) dengan mengubah nilai seperti ini:
```
upload_max_filesize = 10M
post_max_size = 10M
```

### Masalah dengan AzLink atau gerbang pembayaran dengan Cloudflare

Cloudflare dapat mencegah AzLink atau beberapa gerbang pembayaran dari bekerja
dengan benar.

Untuk memperbaiki isu ini, anda bisa mematikan Cloudflare di API, dengan pergi ke Page Rules
-> Tambahkan sebuah rule, lalu menambahkan `/api/*` sebagai URL dan action ini:
* Cache Level: 'Bypass'
* Always Online: 'OFF'
* Security Level: 'Medium' atau 'High'
* Browser Integrity Check: 'OFF' 

Jika masalah masuh terjadi, periksa firewall rule juga.

Untuk detail lebih lanjut bisa ditemukan di [Website Cloudflare](https://support.cloudflare.com/hc/en-us/articles/200504045-Using-Cloudflare-with-your-API).

### Paksa HTTPS di Apache2

Tambahkan baris ini **hanya setelah** `RewriteEngine On` pada `.htaccess` diroot laman anda:
```
RewriteCond %{HTTPS} off
RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI} [R,L]
```

### Votes memuat tanpa batas waktu

Anda bisa mengaktifkan kompabilitas ipv4/ipv6 di setelan plugin vote
untuk memperbaiki isu ini.

Jika anda menggunakan Cloudflare, juga disarankan untuk menginstall plugin
[Cloudflare Support](https://market.azuriom.com/resources/12).

### Ubah kredensial database

Anda bisa mengubah kredensial database dengan mengubah
file `.env` pada root laman anda (mungkin ini diperlukan hntuk mengaktifkan file
tersembunyi untuk melihatnya)
Setelah selesai, hapus file `bootstrap/cache/config.php` jika ada.

### Menginstall laman lain di Apache2

Jika anda ingin menginstall pada laman lainnya (contih: Panel Pterodactyl panel, dan sebagainya)
di server web yang sama dengan Azuriom yang sudah terinstall, disarankan
untuk menginstallnya di sub-domain (contoh: panel.website-anda.com).

Jika ini tidak memungkinan, anda bisa mengkonfigurasi Apache untuk
menjalankan mereka pada domain yang sama, dengan menambahkan sebuah file `.htaccess` ke direktori
dari website lainnya (contih: /panel) berisi konten sebagai berikut:
```
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^ - [L]
</IfModule>
``` 
