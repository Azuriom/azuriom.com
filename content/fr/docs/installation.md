---
title: Installation
weight: 1
---

# Installation

## Prérequis

Pour fonctionner, Azuriom nécessite simplement un **serveur web avec PHP** disposant d'au moins **100 MO**
d'espace disque libre ainsi que des prérequis suivants :

- PHP 8.1 ou plus récent
- Réécriture d'URL
- Extension PHP BCMath
- Extension PHP Ctype
- Extension PHP JSON
- Extension PHP Mbstring
- Extension PHP OpenSSL
- Extension PHP PDO
- Extension PHP Tokenizer
- Extension PHP XML
- Extension PHP XMLWriter
- Extension PHP cURL
- Extension PHP Zip

Il est également très fortement recommandé de posséder **une base de données MySQL/MariaDB ou PostgreSQL**.

## Hébergeurs

Azuriom peut être installé sur n'importe quel VPS ou serveur dédié ainsi que sur
la majorité des hébergeurs web ayant les prérequis ci-dessus, cependant certains
hébergeurs ne sont pas compatibles ou nécessitent des petites adaptations :

- [000webhost](https://www.000webhost.com/) : Incompatible (La fonction `putenv()` est désactivée).
- [InovaPerf](https://inovaperf.fr/) : Incompatible avec l'offre gratuite (La fonction `fsockopen()` est désactivée).
- [mTxServ](https://mtxserv.com/) : Incompatible (La fonction `symlink()` est désactivée).
- [LWS](https://www.lws.fr/) : Incompatible (La fonction `symlink()` est désactivée et la réécriture d'URL pose problème).
- [Ionos](https://www.ionos.fr/) : En cas d'erreur 500 après l'installation,
  il faut simplement modifier le fichier `.htaccess` à la racine du site et
  rajouter `RewriteBase /` juste au-dessus de la ligne `RewriteEngine On`,
  ce qui doit donner quelque chose comme ça :

  ```
      ...
      </IfModule>

      RewriteBase /
      RewriteEngine On

      # Handle Authorization Header
      ...
  ```

{{< info img="assets/svg/nihost-circle.svg" >}}
Si vous recherchez un hébergeur web associatif **abordable mais de qualité**, nous
vous recommandons notre partenaire [NiHost](https://www.ni-host.com/?utm_source=installation&utm_medium=links&utm_campaign=AzuriomCom) !

Le code `AZURIOM` vous permet d'avoir une **réduction de 10% sur vos services**
_(hors domaines & TeamSpeak)_.
{{< /info >}}

## Installation des prérequis sur un serveur Linux

Dans le cas d'un hébergement web, les prérequis ci-dessus seront certainement déjà
installés, et vous pouvez directement passer à l'installation d'Azuriom.

Si vous utilisez un VPS ou un serveur dédié, il sera sûrement nécessaire d'installer
vous-même un serveur web, PHP et MySQL, cela peut se faire par exemple sous Debian ou Ubuntu avec les commandes suivantes :

```
apt update -y && apt upgrade -y

apt install -y nginx mariadb-server zip curl lsb-release apt-transport-https ca-certificates

wget -O /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg
echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" | tee /etc/apt/sources.list.d/php.list
apt update -y
apt install -y php8.2 php8.2-fpm php8.2-mysql php8.2-pgsql php8.2-sqlite3 php8.2-bcmath php8.2-mbstring php8.2-xml php8.2-curl php8.2-zip php8.2-gd
```

MySQL (MariaDB) étant maintenant installé, vous pouvez créer une base de données et un utilisateur
avec les commandes suivantes (**pensez à remplacer `<password>` par un mot de passe sécurisé !**)

```
mysql -u root
CREATE USER 'azuriom'@'127.0.0.1' IDENTIFIED BY '<password>';
CREATE DATABASE azuriom;
GRANT ALL PRIVILEGES ON azuriom.* TO 'azuriom'@'127.0.0.1' WITH GRANT OPTION;
exit
```

Lors de l'installation, la base de données et l'utilisateur de la base de données
seront `azuriom` et le mot de passe celui qui remplace `<password>` dans la commande ci-dessus.

Une fois les prérequis installés, vous devez configurer le serveur web. Pour ce
faire, des explications sont disponibles en bas de cette page.

{{< info >}}
Si vous le préférez, vous pouvez également utiliser ce
[script non-officiel d'installation automatique](https://github.com/AzuriomCommunity/Script-AutoInstall)
qui installera tous les prérequis automatiquement
(veillez simplement à le lancer uniquement sur un VPS qui vient d'être installé pour éviter d'éventuels conflits).
{{< /info >}}

## Installation

Azuriom propose un installateur automatique pour installer Azuriom facilement en suivant ces quelques étapes :

1. Télécharger la dernière version de l'installateur d'Azuriom sur [notre site]({{< url "/download" >}}).

1. Extraire l'archive à la racine de votre site web.

1. Mettre les droits d'écriture à la racine du serveur web, par exemple avec cette commande :

   ```
   chmod -R 755 /var/www/azuriom
   ```

   (en remplaçant simplement `/var/www/azuriom` par l'emplacement du site)

   Si l'utilisateur actuel n'est pas le même que l'utilisateur du serveur web,
   il peut être nécessaire de changer le propriétaire des fichiers, par exemple avec cette commande :

   ```
   chown -R www-data:www-data /var/www/azuriom
   ```

   (en remplaçant simplement `/var/www/azuriom` par l'emplacement du site et `www-data` par
   l'utilisateur du serveur web)

1. Se rendre sur votre site et suivre les étapes de l'installation.

1. (Optionnel) Mettre en place le planificateur de tâches :
   Certaines fonctionnalités ont besoin que le planificateur de tâches soit mis en place. Pour cela, vous
   devez configurer votre serveur pour que la commande `php artisan schedule:run`
   soit exécutée toutes les minutes, par exemple en ajoutant cette entrée CRON
   (n'oubliez pas de remplacer `/var/www/azuriom` par l'emplacement du site) :
   ```
   * * * * * cd /var/www/azuriom && php artisan schedule:run >> /dev/null 2>&1
   ```
   Cela peut être fait en modifiant la configuration de crontab avec la commande `crontab -e`.

{{< warn >}}
Une fois l'installation terminée, afin d'éviter tout problème, veillez à ce que
votre site ne soit pas accessible directement depuis l'adresse IP de la machine
(ex : http://0.0.0.0).
{{< /warn >}}

## Environnement de développement

Si vous installez Azuriom localement pour du développement (par exemple pour
faire des thèmes/plugins), il est très fortement recommandé d'activer le débogage
afin de simplifier le développement.
Cela peut se faire très simplement en modifiant ces 2 lignes dans le fichier d'environnement `.env` à la
racine du site :

```
APP_ENV=local
APP_DEBUG=true
```

Il est également recommandé de désactiver RocketBooster (dans le panel admin : Paramètres puis
Performances) lors du développement.

{{< warn >}}
Si votre site est accessible publiquement, il est très fortement
déconseillé d'activer le débogage et de configurer l'environnement de développement.
{{< /warn >}}

## Configuration du serveur web

### Apache2

Si vous utilisez Apache2, il peut être nécessaire d'activer la réécriture d'URL.

Pour cela, commencez par activer le module "rewrite" avec la commande suivante :

```
a2enmod rewrite
```

Ensuite vous pouvez configurer le site pour autoriser la réécriture d'URL.
Il faut simplement modifier le fichier de configuration d'Apache2 (par défaut
`/etc/apache2/sites-available/000-default.conf`) et y ajouter les lignes suivantes
entre les balises `<VirtualHost>` (en remplaçant `var/www/azuriom` par l'emplacement du site) :

```
<Directory "/var/www/azuriom">
    Options FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
```

Pour finir, appliquez les changements en redémarrant Apache2 :

```
service apache2 restart
```

### NGINX

Si vous déployez Azuriom sur un serveur qui utilise NGINX, vous pouvez utiliser
la configuration NGINX suivante pour que la réécriture d'URL soit considérée comme activée :

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

Cette configuration doit être placée dans un fichier du dossier `/etc/nginx/sites-available` et non dans le
fichier de configuration principal `nginx.conf`.

Pensez également à remplacer `example.com` par votre domaine, `/var/www/azuriom`
par l'emplacement du site (sans enlever le `/public` de la ligne) et `php8.2`
par votre version de PHP.

Pour finir, appliquez les changements en redémarrant NGINX :

```
service nginx restart
```
