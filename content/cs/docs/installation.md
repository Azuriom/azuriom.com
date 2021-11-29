---
title: Instalace
weight: 1
---

# Instalace

## Požadavky

Pro práci Azuriom jednoduše vyžaduje **webový server s PHP** a alespoň **100 MB**
místa na disku a následující požadavky:

- PHP 7.3 nebo vyšší
- Přepisování URL
- Oprávnění číst/psát na `storage/` a `bootstrap/cache/`.
- PHP rozšíření BCMath
- PHP rozšíření Ctype
- PHP rozšíření JSON
- PHP rozšíření Mbstring
- PHP rozšíření OpenSSL
- PHP rozšíření PDO
- PHP rozšíření Tokenizer
- PHP rozšíření XML
- PHP rozšíření XMLWriter
- PHP rozšíření cURL
- PHP rozšíření Zip

Je také vysoce doporučeno mít **MySQL/MariaDB nebo PostgreSQL databázi**.

### Požadavky instalace

Pokud používáte VPS nebo dedikovaný server, nejspíš bude potřeba nainstalovat webový server, PHP a MySQL.
Toho lze docílit následujícími příkazy:

```
apt update -y && apt upgrade -y
apt install -y nginx zip curl lsb-release apt-transport-https ca-certificates
wget -O /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg
echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" | tee /etc/apt/sources.list.d/php.list
apt update -y
apt install -y php8.0 php8.0-fpm php8.0-mysql php8.0-pgsql php8.0-sqlite3 php8.0-bcmath php8.0-mbstring php8.0-xml php8.0-curl php8.0-zip php8.0-gd
```

Jakmile jsou nainstalovány požadavky, musíte nakonfigurovat webový server. Vysvětlení jsou dostupná níže na této
stránce.

{{< info >}}
Pokud chcete, můžete také použít tento neoficiální
[skript na automatickou instalaci](https://github.com/AzuriomCommunity/Script-AutoInstall),
který automaticky nainstaluje všechny požadavky
{{< /info >}}

## Instalace

Azuriom nabízí automatický instalátor pro jednoduchou instalaci Azuriomu pomocí následujících kroků:

{{< info >}}
Můžete jej také nainstalovat do [Dockeru](https://www.docker.com/) pomocí kroků vypsaných [zde](https://github.com/Azuriom/Azuriom/blob/master/docker/INSTALL.md).
{{< /info >}}

1. Stáhněte si nejnovější verzi instalátoru Azuriomu na [našem webu](https://azuriom.com/download).

1. Extrahujte archiv do kořenové složky vašeho webu.

1. Nastavte oprávnění ke čtení/zápisu u kořenové složky vašeho webového serveru:
   ```
   chmod -R 755 /var/www/azuriom
   ```
   (nahraďdte `/var/www/azuriom` lokací webu)

   Pokud není aktuální uživatel uživatelem webového serveru, může být nutné změnit majitele souborů:
    ```
    chown -R www-data:www-data /var/www/azuriom
    ```
   (nahraďdte `/var/www/azuriom` lokací webu a `www-data`
   uživatelem webového serveru)

1. Jděte na váš web a následujte kroky k instalaci.

1. (Nepovinné) Nastavte scheduler:

   Některé funkce vyžadují nastavený scheduler, k tomu budete potřebovat nakonfigurovat váš webový server, aby spustil
   každou minutu příkaz `php artisan schedule:run` například přidáním tohoto Cron záznamu (nezapomeňte
   nahradit `/var/www/azuriom`
   lokací webu):
   ```
   * * * * * cd /var/www/azuriom && php artisan schedule:run >> /dev/null 2>&1
   ```
   This can be done by modifying the crontab configuration with the `crontab -e` command.

## Konfigurace webového serveru

### Apache2

Pokud používáte Apache2, bude možná nutné povolit přepis URL.

Abyste toho docílili, povolte nejprve modifikaci "rewrite":

```
a2enmod rewrite
```

Poté upravte soubor `/etc/apache2/sites-available/000-default.conf` a přidejte následující řádky mezi
značky `<VirtualHost>` (nahraďdte
`var/www/azuriom` lokací webu) pro povolení přepisování URL:

```
<Directory "/var/www/azuriom">
    Options FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
```

Nakonec už stačí jen restartovat Apache2:

```
service apache2 restart
```

## Nginx

Pokud chcete provozovat Azuriom na serveru, který používá Nginx, můžete použít následující konfiguraci:

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

Tento konfigurační soubor se musí nacházet ve webu v `site-available` a ne v
`nginx.conf`.

Nezapomeňte nahradit `example.com` vaší doménou, `/var/www/azuriom`
lokací webu (bez odebrání části `/public` na konci řádku!)
a `php8.0` verzí vašeho PHP.
