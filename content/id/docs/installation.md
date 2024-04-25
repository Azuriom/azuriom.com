---
title: Instalasi
weight: 1
---

# Instalasi

## Persyaratan

Untuk bekerja, Azuriom membutuhkan sebuah **server web dengan PHP** yang mempunyai setidaknya **100 MB**
untuk disk space dan persyaratan sebagai berikut:

- PHP 8.1 atau yang lebih tinggi
- URL Rewrite
- Izin Write/Read di `storage/` dan `bootstrap/cache/`.
- Ekstensi BCMath PHP
- Ekstensi Ctype PHP
- Ekstensi JSON PHP
- Ekstensi Mbstring PHP
- Ekstensi OpenSSL PHP
- Ekstensi PDO PHP
- Ekstensi Tokenizer PHP
- Ekstensi XML PHP
- Ekstensi XMLWriter PHP
- Ekstensi cURL PHP
- Ekstensi Zip PHP

Sangat disarankan untuk memiliki sebuah **MySQL/MariaDB atau database PostgreSQL**.

### Persyaratan Instalasi

Jika anda menggunakan VPS atau sebuah server dedikasi, ini kemungkinan dibutuhkan untuk menginstal sendiri di server web, PHP dan MySQL.
ini bisa dilakukan dengan perintah sebagai berikut:

```
apt update -y && apt upgrade -y

apt install -y nginx zip curl lsb-release apt-transport-https ca-certificates

wget -O /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg
echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" | tee /etc/apt/sources.list.d/php.list
apt update -y
apt install -y php8.2 php8.2-fpm php8.2-mysql php8.2-pgsql php8.2-sqlite3 php8.2-bcmath php8.2-mbstring php8.2-xml php8.2-curl php8.2-zip php8.2-gd
```

Setelah semuanya telah diinstal, anda harus mengkonfigurasi server webnya. Penjelasan tersedia dibawah
halaman.

{{< info >}}
Jika anda mau, anda juga bisa menggunakan
[skrip auto-install](https://github.com/AzuriomCommunity/Script-AutoInstall) tidak resmi
yang nantinya akan menginstal semua prasyarat secara otomatis.
{{< /info >}}

## Instalasi

Azuriom menawarkan instal otomatis untuk Azuriom secara mudah dengan beberapa cara:

1. Instal versi terbaru dari Azuriom Installer di [website kami]({{< url "/download" >}}).

1. Ekstrak arsip dari root website anda.

1. Mengubah izin write/read ke root server web anda:

   ```
   chmod -R 755 /var/www/azuriom
   ```

   (ganti saja `/var/www/azuriom` dengan lokasi site)

   Jika pengguna saar ini bukan pengguna server web, disarankan untuk mengubah pemilik file:

   ```
   chown -R www-data:www-data /var/www/azuriom
   ```

   (ganti `/var/www/azuriom` dengan lokasi site dan `www-data`
   dengan pengguna server web)

1. Pergi ke website dan ikuti beberapa langkah instalasi.

1. (Pilihan) Mempersiapkan Jadwal:

   Beberapa fitur membutuhkan penjadwal untuk di persiapkan, untuk ini anda harus mengkonfigur server anda untuk menjalankan
   perintah `php artisan schedule:run` setiap menit, sebagai contohnya menambahkan Cron (jangan lupa untuk
   mengganti `/var/www/azuriom`
   dengan lokasi site):

   ```
   * * * * * cd /var/www/azuriom && php artisan schedule:run >> /dev/null 2>&1
   ```

   Ini bisa dijalankan dengan mengubah konfigurasi crontab dengan perintah `crontab -e`.

## Konfigurasi server web

### Apache2

Jika anda menggunakan Apache2, disarankan untuk mengaktifkan URL rewrite.

Untuk melakukan ini, pertama aktifkan mod "rewrite":

```
a2enmod rewrite
```

Lalu anda ganti file `/etc/apache2/sites-available/000-default.conf` dan tambahkan baris ini diantara
tag `<VirtualHost>` (menggantikan
`var/www/azuriom` dengan lokasi site) untuk mengaktifkan URL rewrite:

```
<Directory "/var/www/azuriom">
    Options FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
```

Akhirnya, restart Apache2 anda:

```
service apache2 restart
```

## Nginx

Jika anda menaruh Azuriom dengan server yang menggunakan Nginx, anda bisa mengikuti konfigurasi dibawah ini:

```
server {
    listen 80;
    server_name example.com;
    root /var/www/azuriom/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    index index.html index.htm index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Konfigurasi ini harus di taruh didalam site di `site-available` dan bukan di
`nginx.conf`.

Ingat untuk mengganti `example.com` dengan domain anda, `/var/www/azuriom`
dengan lokasi site (tanpa menghapus `/public` diakhir baris !)
dan `php8.2` dengan versi PHP anda.
