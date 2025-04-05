---
title: Installation
weight: 1
---

# Installation

## Requirements

Azuriom is written in PHP, which allows it to run on almost all shared hosting environments. It can also be easily installed on a VPS or dedicated server.

To run Azuriom, you need a web server with the following requirements:
- PHP 8.2 or higher (PHP 8.3 or 8.4 is recommended)
- PHP Extensions: BCMath, Ctype, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML, XMLWriter, cURL and ZIP
- Enabled URL Rewrite (for Apache2)
- Symlink support

While not strictly required, a **MySQL/MariaDB** or **PostgreSQL** database is recommended.

## Getting Started

If you manage your own server (VPS, dedicated server, etc.), you will need to install the requirements yourself.
Before installing Azuriom, make sure the requirements are installed on your server.
See the [Requirements Installation](#requirements-installation) section for more information.

On the other hand, if you are using a shared web hosting, the requirements should already be installed, and you can continue directly to the download and installation of Azuriom.

{{< info >}}
To help get started, the complete installation process on cPanel (a popular shared hosting panel)
is shown in a [video tutorial](https://www.youtube.com/watch?v=aT2zntvqCYM).
{{< /info >}}

### Download Azuriom

You can download the latest version of Azuriom on [our website]({{< url "/download" >}}).

Once the archive is downloaded, you can upload it to your server and extract it at the root of your website.

On a shared web hosting, the website root is usually the `public_html` or `httpdocs` folder.
If you are unsure, you can ask your hosting provider.

On a VPS or a dedicated server, the root of the website is usually `/var/www/azuriom`,
but can be changed in the web server configuration.

{{< info >}}
When the archive is not uploaded directly on the server, make sure to also upload
hidden files like `.htaccess`. If you are using WinSCP, this can be done by enabling
the option "Show hidden files" in the settings.
{{< /info >}}

### Files Permissions

Once the files are uploaded, you will need to set the read/write permissions on the Azuriom files.

Using an FTP client, right-click on the root folder of your website (usually `public_html`, `httpdocs`, `html`, etc.)
and select "File Permissions" or "CHMOD". Then, set the permissions to `775` and **make sure the changes are applied recursively**.

With a terminal, you can use the following command (**replace `/var/www/azuriom` with the location of the site**):

```sh
chmod -R 775 /var/www/azuriom
```

### Installation

Once the permissions are set, you can go to your website in your browser and follow the installation steps.

The installer will guide you through the installation process, asking you to enter the database information and create the first administrator account.

Once the installation is complete, congratulations! Your Azuriom website is now installed and ready to use!

You can then log in to your website, and access the administration dashboard by clicking on your name in the top right corner.

{{< warn >}}
Once the installation is complete, to prevent any issues, make sure your website
can't be accessed directly from the IP of the server (ex: http://0.0.0.0).
{{< /warn >}}

### CRON tasks

This last step is optional, but some features require CRON tasks to schedule tasks, such as automatic subscription renewals in the store.

On a shared web hosting, you can usually set up CRON tasks directly in the hosting panel, look for the "CRON Tasks" or "Scheduled Tasks" section,
and add a new task with the `php artisan schedule:run` command.

On a VPS or a dedicated server, you can add a new CRON task by editing the crontab with the command `crontab -e` and adding the following line
(**replace `/var/www/azuriom` with the location of the site**):

```sh
* * * * * cd /var/www/azuriom && php artisan schedule:run >> /dev/null 2>&1
```

## Requirements installation

If you are using a shared web hosting service, the prerequisites will most likely already be installed, and you can proceed directly to the Azuriom installation.

The recommended software are **PHP** with **Nginx** and a **MySQL/MariaDB** or **PostgreSQL** database.
However, Azuriom can also run on other web servers like Apache2, and support SQLite and SQLServer (although these databases are not recommended).

If you are using a shared web hosting service, the prerequisites are most likely already installed and you can proceed directly to the Azuriom installation.

Due to the wide variety of operating systems and distributions, it is impossible to provide an exhaustive installation guide for all platforms:
* On Windows, you can use a tool like [Laragon](https://laragon.org/) for easy setup for local development.
* On a Linux server, there are many tutorials available online for each distribution on how to install Nginx, MariaDB and PHP (or any supported web server and database).

{{< info >}}
If the PHP version detected by the installer during installation does not match the version returned by the `php -v` command, this is probably because the PHP CLI (Command Line Interface) version is different from the PHP version used by the web server (Apache, Nginx, etc.).
{{< /info >}}

### Debian

For convenience, here is a quick guide to install Nginx, MariaDB and PHP 8.3 on a **Debian** server:
1. Update the package list and upgrade the system:
   ```sh
   apt update -y && apt upgrade -y
   ```
2. Install Nginx, MariaDB, as well as the required packages:
   ```sh
   apt install -y nginx mariadb-server zip curl lsb-release apt-transport-https ca-certificates
   ```
3. Add the PHP repository and install PHP 8.3 with the required extensions:
   ```sh
   wget -O /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg
   echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" | tee /etc/apt/sources.list.d/php.list
   apt update -y
   apt install -y php8.3 php8.3-fpm php8.3-mysql php8.3-pgsql php8.3-sqlite3 php8.3-bcmath php8.3-mbstring php8.3-xml php8.3-curl php8.3-zip php8.3-gd
   ```
4. Create a new SQL user and database for Azuriom (**replace `<password>` with a secure password!**):
   ```sh
   mysql -u root
   ```
   ```sql{hl_lines=[1]}
   CREATE USER 'azuriom'@'127.0.0.1' IDENTIFIED BY '<password>';
   CREATE DATABASE azuriom;
   GRANT ALL PRIVILEGES ON azuriom.* TO 'azuriom'@'127.0.0.1' WITH GRANT OPTION;
   ```
   ```sh
   exit
   ```

### Pterodactyl

If you are using Pterodactyl, installing Azuriom using Pterodactyl’s interface is **strongly discouraged**.
Instead, it is recommended to install Azuriom directly on the same host server as your Pterodactyl panel.

To ensure proper accessibility, use a different domain or subdomain for Azuriom and Pterodactyl.
You can achieve this by configuring Apache virtual hosts or Nginx server blocks
to manage the two websites independently.

## Web server configuration

### Apache2

If you are using Apache2, it may be necessary to enable URL rewriting.

First, enable the rewrite module with the following command:
```sh
a2enmod rewrite
```

Then, modify the Apache2 configuration file for your site, usually located in `/etc/apache2/sites-available/000-default.conf` or `/etc/apache2/sites-available/default-ssl.conf`,
and add the following configuration inside the `<VirtualHost>` tag (**replace `/var/www/azuriom` with the location of the site**):
```apache{hl_lines=[1]}
<Directory "/var/www/azuriom">
    Options FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
```

Finally, restart Apache2 with the following command:
```sh
service apache2 restart
```

### Nginx

The following configuration is an example of a Nginx configuration for Azuriom.

Make sure to replace `example.com` with your domain, `/var/www/azuriom` with the location of the site,
and `php8.3` with the installed PHP version.

The `root` line must end with `/public` after the site location.

```nginx{hl_lines=["3-4",25]}
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
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Then, Nginx can be restarted with the following command:
```sh
service nginx restart
```
