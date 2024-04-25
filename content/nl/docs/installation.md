---
title: Installatie
weight: 1
---

# Installatie

## Benodigdheden

Om te werken, heeft Azuriom een **webserver met PHP** nodig met minimaal **100 MB**
schijfruimte en de volgende vereisten:

- PHP 8.1 of hoger
- URL herschrijven
- Schrijf-/leesrechten op `storage/` en `bootstrap/cache/`. mappen.
- BCMath PHP Extensie
- Ctype PHP Extensie
- JSON PHP Extensie
- Mbstring PHP Extensie
- OpenSSL PHP Extensie
- PDO PHP Extensie
- Tokenizer PHP Extensie
- XML PHP Extensie
- XMLWriter PHP Extensie
- cURL PHP Extensie
- Zip PHP Extensie

Het wordt ook sterk aanbevolen om een **MySQL/MariaDB- of PostgreSQL-database** te gebruiken.

### Benodigdheden voor installatie op een op Linux gebaseerde server

Op en gedeelde webhost zullen er hoostwaarschijnlijk al benodigdheden geïnstalleerd zijn,
en kunt u direct doorgaan naar de installatie van Azuriom.

Als je een VPS of een dedicated server gebruikt, zal het waarschijnlijk nodig zijn
om zelf een webserver, PHP en MySQL te installeren. Dit kan bijvoorbeeld onder Debian of Ubuntu met de volgende commando's:

```
apt update -y && apt upgrade -y

apt install -y nginx mariadb-server zip curl lsb-release apt-transport-https ca-certificates

wget -O /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg
echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" | tee /etc/apt/sources.list.d/php.list
apt update -y
apt install -y php8.2 php8.2-fpm php8.2-mysql php8.2-pgsql php8.2-sqlite3 php8.2-bcmath php8.2-mbstring php8.2-xml php8.2-curl php8.2-zip php8.2-gd
```

MySQL (MariaDB) is nu geïnstalleerd en u kunt een database en een gebruiker maken met de
volgende commando's (**vergeet niet om `<password>` te vervangen met een veilig wachtwoord!**):

```
mysql -u root
CREATE USER 'azuriom'@'127.0.0.1' IDENTIFIED BY '<password>';
CREATE DATABASE azuriom;
GRANT ALL PRIVILEGES ON azuriom.* TO 'azuriom'@'127.0.0.1' WITH GRANT OPTION;
exit
```

Tijdens de installatie zijn de database en database gebruiker `azuriom` en het wachtwoord is degene die `<password>`
vervangt in de opdracht hierboven.

nadat de vereisten zijn geïnstalleerd, moet u de webserver configureren.
Uitleg vindt u onderaan dit artikel.

{{< info >}}
Als je wilt, kun je dit ook onofficieel gebruiken
[automatisch installatie script](https://github.com/AzuriomCommunity/Script-AutoInstall)
waarmee alle vereisten automatisch geïnstalleerd worden.
{{< /info >}}

## Installatie

Azuriom biedt een automatisch installatie programma om Azuriom eenvoudig te installeren
door deze paar stappen te volgen:

1. Download de nieuwste versie van het Azuriom installatie programma op [onze website]({{< url "/download" >}}).

1. Pak het archief uit in de hoofdmap van uw website.

1. Stel schrijf-/leesrechten in op de hoofdmap van uw webserver:

   ```
   chmod -R 755 /var/www/azuriom
   ```

   (verplaats `/var/www/azuriom` met de locatie van je site)

   Als de huidige gebruiker niet de webserver gebruiker is, kan het nodig zijn om de eigenaar van de bestanden te wijzigen:

   ```
   chown -R www-data:www-data /var/www/azuriom
   ```

   (verplaats `/var/www/azuriom` met de locatie van je site en `www-data`
   met de webserver gebruiker)

1. Ga naar uw website en volg de instructies op uw scherm.

1. (Optioneel) Stel de planner in:

   Voor sommige functies moet de planner worden ingesteld, hiervoor moet u uw server configureren
   om de commando `php artisan schedule:run` elke minuut uit te voeren, bijvoorbeeld
   door dit Cron-item toe te voegen (vergeet niet om `/var/www/azuriom` te vervangen met de locatie van je site):

   ```
   * * * * * cd /var/www/azuriom && php artisan schedule:run >> /dev/null 2>&1
   ```

   Dit kan gedaan worden door de crontab-configuratie te wijzigen met de `crontab -e` commando.

{{< warn >}}
Zodra de installatie is voltooid en problemen te volkomen, moet u ervoor zorgen dat uw website
niet rechtstreeks toegankelijk is vanaf het IP-adress van de server (bijvoorbeeld: http://0.0.0.0).
{{< /warn >}}

## Webserver configuratie

### Apache2

Als u Apache2 gebruikt, kan het nodig zijn om URL-herschrijven in te schakelen.

Schakel hiervoor eerst de mod "herschrijven" in:

```
a2enmod rewrite
```

Vervolgens moet u de Apache2-configuratie wijzigen (standaard in het bestand `/etc/apache2/sites-available/000-default.conf`)
en voeg de volgende regels toe tussen de `<VirtualHost>`-tags (waarbij `var/www/azuriom` wordt vervangen door de locatie van de site)
om URL-herschrijving toe te staan:

```
<Directory "/var/www/azuriom">
    Options FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
```

Tenslotte hoeft u alleen Apache2 opnieuw te starten.

```
service apache2 restart
```

## Nginx

Als u Azuriom implementeert op een server die Nginx gebruikt,
kunt u de volgende configuratie gebruiken:

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

Deze configuratie moet in de site in `site-available` worden geplaatst
en niet in het `nginx.conf` bestand.

Vergeet niet om `example.com` te vervangen door uw domein,
`/var/www/azuriom` met de locatie van uw site (zonder de `/public` aan het einde van de regel te verwijderen!)
en `php8.2` met uw PHP-versie.

Ten slotte kunt u NGINX opnieuw opstarten:

```
service nginx restart
```
