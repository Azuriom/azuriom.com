---
title: Installation
weight: 1
---

# Installation

## Requirements

To work, Azuriom simply requires a **web server with PHP** having at least **100 MB**
of disk space and the following requirements:

- PHP 7.3 or higher
- URL Rewrite
- Write/Read permissions on `storage/` and `bootstrap/cache/`.
- BCMath PHP Extension
- Ctype PHP Extension
- JSON PHP Extension
- Mbstring PHP Extension
- OpenSSL PHP Extension
- PDO PHP Extension
- Tokenizer PHP Extension
- XML PHP Extension
- XMLWriter PHP Extension
- cURL PHP Extension
- Zip PHP Extension

It's also highly recommended having a **MySQL/MariaDB or PostgreSQL database**.

### Requirements installations

If you are using a VPS or a dedicated server, it will probably be necessary to install yourself a web server, PHP and MySQL.
This can be done with the following commands:

```
apt update -y && apt upgrade -y

apt install -y nginx zip curl lsb-release apt-transport-https ca-certificates

wget -O /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg
echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" | tee /etc/apt/sources.list.d/php.list
apt update -y
apt install -y php8.0 php8.0-fpm php8.0-mysql php8.0-pgsql php8.0-sqlite3 php8.0-bcmath php8.0-mbstring php8.0-xml php8.0-curl php8.0-zip php8.0-gd
```

Once the requirements are installed, you must configure the web server. Explanations are available at the bottom of this
page.

{{< info >}}
If you prefer, you can also use this unofficial
[auto-install script](https://github.com/AzuriomCommunity/Script-AutoInstall)
which will install all the prerequisites automatically.
{{< /info >}}

## Installation

Azuriom offers an automatic installer to install Azuriom easily by following these few steps:

{{< info >}}
You can also install it with [Docker](https://www.docker.com/) by following the steps listed [here](https://github.com/Azuriom/Azuriom/blob/master/docker/INSTALL.md).
{{< /info >}}

1. Download the latest version of the Azuriom installer on [our website](https://azuriom.com/download).

1. Extract the archive at the root of your website.

1. Set write/read permissions to the root of your web server:
   ```
   chmod -R 755 /var/www/azuriom
   ```
   (just replace `/var/www/azuriom` with the site location)

   If the current user is not the web server user, it may be necessary to change the owner of the files:
    ```
    chown -R www-data:www-data /var/www/azuriom
    ```
   (replace `/var/www/azuriom` with the site location and `www-data`
   with the web server user)

1. Go to on your website and follow the steps of installation.

1. (Optional) Setup the scheduler:

   Some features need the scheduler to be set up, for this you need to configure your server to run the
   command `php artisan schedule:run` every minute, for example by adding this Cron entry (don't forget to
   replace `/var/www/azuriom`
   with the location of the site):
   ```
   * * * * * cd /var/www/azuriom && php artisan schedule:run >> /dev/null 2>&1
   ```
   This can be done by modifying the crontab configuration with the `crontab -e` command.

{{< warn >}}
Once the installation is complete, to prevent any issues, make sure your website
can't be accessed directly from the IP of the server (ex: http://0.0.0.0).
{{< /warn >}}

## Web server configuration

### Apache2

If you are using Apache2, it may be necessary to enable URL rewriting.

To do this, first enable the "rewrite" mod:

```
a2enmod rewrite
```

Then you need to modify the `/etc/apache2/sites-available/000-default.conf` file and add the following lines between
the `<VirtualHost>` tags (replacing
`var/www/azuriom` by site location) to allow URL rewrite:

```
<Directory "/var/www/azuriom">
    Options FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
```

Finally, you just need to restart Apache2:

```
service apache2 restart
```

## Nginx

If you are deploying Azuriom on a server that uses Nginx, you can use the following configuration:

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

This config must be placed in a site in `site-available` and not in the
`nginx.conf`.

Just remember to replace `example.com` with your domain, `/var/www/azuriom`
with the location of the site (without removing the `/public` at the end of the line !)
and `php8.0` with your PHP version.
