---
title: Installation
weight: 1
---

# Installation

## Anforderungen


Um zu funktionieren, benötigt Azuriom lediglich einen **Webserver mit PHP** mit mindestens **100 MB**
Festplattenspeicher und den folgenden Anforderungen:

- PHP 7.3 oder höher
- URL Rewrite
- Schreib-/Lese-Berechtigungen af `storage/` und `bootstrap/cache/`.
- BCMath PHP Erweiterung
- Ctype PHP Erweiterung
- JSON PHP Erweiterung
- Mbstring PHP Erweiterung
- OpenSSL PHP Erweiterung
- PDO PHP Erweiterung
- Tokenizer PHP Erweiterung
- XML PHP Erweiterung
- cURL PHP Erweiterung
- GD2 PHP Erweiterung
- Zip PHP Erweiterung

Es wird durchaus empfohlen, über eine **MySQL/MariaDB oder PostgreSQL Datenbank** zu verfügen.

### Benötigte Installationen


Wenn Sie einen VPS oder einen dedizierten Server verwenden, müssen Sie wahrscheinlich selbst einen Webserver, PHP und MySQL installieren.
Dies kann mit den folgenden Befehlen erfolgen:

```
apt update && apt upgrade

apt install nginx zip curl

apt install lsb-release apt-transport-https ca-certificates
wget -O /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg
echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" | tee /etc/apt/sources.list.d/php.list
apt update
apt install php8.0 php8.0-fpm php8.0-mysql php8.0-pgsql php8.0-sqlite php8.0-bcmath php8.0-mbstring php8.0-xml php8.0-curl php8.0-zip php8.0-gd
```

Once the requirements are installed, you must configure the web server. Explanations are available at the bottom of this
page.

{{< info >}}
If you prefer, you can also use this unofficial
[auto-install script](https://github.com/AzuriomCommunity/Script-AutoInstall)
which will install all the prerequisites automatically.
{{< /info >}}

## Installation

Azuriom bietet ein automatisches Installationsprogramm zur einfachen Installation von Azuriom, indem Sie die folgenden Schritte ausführen:

{{< info >}}
Du kannst auch mit [Docker](https://www.docker.com/) installieren, folge dazu den [hier](https://github.com/Azuriom/Azuriom/blob/master/docker/INSTALL.md) gelisteten Schritten.
{{< /info >}}

1. Lade die aktuelle Version des Azuriom Installiers auf [unserer Website](https://azuriom.com/download) herunter.

1. Extrahiere das Archiv in das Root-Verzeichnis des Webservers.

1. Setze schreib/lese Berechtigungen auf das Root-Verzeichnis des Webservers:
   ```
   chmod -R 755 /var/www/azuriom
   ```
   (just replace `/var/www/azuriom` with the site location)

   Wenn der aktuelle Benutzer nicht der Benutzer des Webservers ist, kann es erforderlich sein, den Eigentümer der Dateien zu ändern:
    ```
    chown -R www-data:www-data /var/www/azuriom
    ```
   (ersetze `/var/www/azuriom` mit dem Website Ort und `www-data`
   mit dem Webserver Benutzer)

1. Gehe auf unsere Website und folge den Schritten der Installation.

1. (Optional) Setze den Scheduler auf:

   Für einige Funktionen muss der Scheduler eingerichtet sein.
   Dazu musst Du Deinen Server so konfigurieren, dass der Befehl `php artisan schedule:run` jede Minute ausgeführt wird, indem Du beispielsweise diesen Cron-Eintrag hinzufügst
   (vergesse nicht, `/var/www/azuriom` durch den Standort der Site zu ersetzen):
   ```
   * * * * * cd /var/www/azuriom && php artisan schedule:run >> /dev/null 2>&1
   ```
   Dies kann durch Ändern der crontab-Konfiguration mit dem Befehl `crontab -e` erfolgen.

## Web Server Konfiguration

### Apache2

Wenn Du Apache2 verwendest, kann es erforderlich sein, das Umschreiben von URLs zu aktivieren.

Um dies zu tun, aktiviere zuerst den "rewrite" Mod:

```
a2enmod rewrite
```

Dann musst Du die Datei `/etc/apache2/sites-available/000-default.conf` ändern
und die folgenden Zeilen zwischen den `VirtualHost`-Tags hinzufügen
(`var/www/azuriom` durch den Standort der Site ersetzen),
um das Umschreiben der URL zu ermöglichen:

```
<Directory "/var/www/azuriom">
    Options FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
```

Zuletzt, musst Du nur noch Apache2 neustarten:

```
service apache2 restart
```

## Nginx

Wenn Du Azuriom auf einem Server bereitstellst, der Nginx nutzt, kannst Du die folgende Konfiguration verwenden:

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
        fastcgi_pass unix:/var/run/php/php8.0-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Diese Konfiguration muss in einer Site in `site-available`
und nicht in der `nginx.conf` platziert werden.

Denke daran, `example.com` durch Deine Domain zu ersetzen,
`/var/www/azuriom` durch den Standort der Site
(ohne das `/public` am Ende der Zeile zu entfernen!)
und `php8.0` durch Deine PHP-Version.