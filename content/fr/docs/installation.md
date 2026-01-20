---
title: Installation
weight: 1
---

# Installation

## Prérequis

Azuriom est développé en PHP, ce qui lui permet de fonctionner sur la plupart des hébergements mutualisés,
et il peut également être installé facilement sur un VPS ou un serveur dédié.

Pour utiliser Azuriom, vous avez besoin d'un serveur web avec les prérequis suivants :
- PHP 8.2 ou supérieur (PHP 8.4 ou 8.5 est recommandé)
- Extensions PHP : BCMath, Ctype, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML, XMLWriter, cURL et ZIP
- Réécriture d'URL activée (pour Apache2)
- Support des liens symboliques (symlink)

Bien que cela ne soit pas obligatoire, une base de données **MySQL/MariaDB** ou **PostgreSQL** est recommandée.

{{< info img="assets/svg/nihost-circle.svg" >}}
Si vous recherchez un hébergeur web associatif **abordable et de qualité**, nous
vous recommandons notre partenaire [NiHost](https://www.ni-host.com/?utm_source=installation&utm_medium=links&utm_campaign=AzuriomCom) !

Le code `AZURIOM` vous permet d'avoir une **réduction de 10% sur vos services**
_(hors domaines & TeamSpeak)_.
{{< /info >}}

{{< info >}}
Pour une utilisation en local, une image [Docker](https://www.docker.com/) prête à l'emploi est disponible,
avec tous les prérequis installés.
Pour l'utiliser, téléchargez Azuriom depuis les [releases GitHub](https://github.com/Azuriom/Azuriom/releases) et exécutez la commande suivante
dans le dossier d'Azuriom :
```sh
docker-compose up -d
```
{{< /info >}}

## Démarrer

Si vous gérez votre propre serveur (VPS, serveur dédié, etc.), vous devrez installer vous-même les prérequis.
Avant d'installer Azuriom, assurez-vous que les prérequis sont bien installés sur votre serveur.
Consultez la section [Installation des Prérequis](#installation-des-prérequis) pour plus d'informations.

Cependant, si vous utilisez un hébergement mutualisé, les prérequis devraient déjà être installés,
et vous pouvez passer directement au téléchargement et à l'installation d'Azuriom.

{{< info >}}
Pour vous aider à commencer, l'installation complète sur cPanel
est disponible dans un [tutoriel vidéo](https://www.youtube.com/watch?v=aT2zntvqCYM).
{{< /info >}}

### Télécharger Azuriom

Vous pouvez télécharger la dernière version d'Azuriom sur [notre site]({{< url "/download" >}}).

Une fois l'archive téléchargée, vous pouvez la transférer sur votre serveur et l'extraire à la racine de votre site.

Sur un hébergement mutualisé, la racine du site est généralement le dossier `public_html` ou `httpdocs`.
En cas de doute, contactez le support de votre hébergeur.

Sur un VPS ou un serveur dédié, la racine du site est généralement `/var/www/html`,
et peut être modifiée dans la configuration du serveur web (Apache, Nginx, etc).

{{< info >}}
Lorsque l'archive n'est pas téléchargée directement sur le serveur,
assurez-vous également de transférer les fichiers cachés tels que `.htaccess`.
Avec WinSCP, cela peut se faire en activant l'option « Afficher les fichiers cachés » dans les paramètres.
{{< /info >}}

### Permissions des Fichiers

Une fois les fichiers transférés, vous devez définir les permissions en lecture/écriture sur les fichiers d'Azuriom.

Avec un client FTP, faites un clic droit sur le dossier racine de votre site (généralement `public_html`, `httpdocs`, `html`, etc.)
et sélectionnez « Permissions des fichiers » ou « CHMOD ».
Ensuite, définissez les permissions sur `775` et **assurez-vous que les permissions sont appliquées de manière récursive**.

Avec un terminal, vous pouvez utiliser la commande suivante (**remplacez `/var/www/azuriom` par l'emplacement de votre site**) :

```sh
chmod -R 775 /var/www/azuriom
```

### Installation

Une fois les permissions configurées, rendez-vous sur votre site depuis votre navigateur et suivez les étapes d'installation.

L'installateur vous guidera tout au long de l'installation, en vous demandant les informations de la base de données
et de créer le premier compte administrateur.

Une fois l'installation terminée, félicitations ! Votre site Azuriom est installé et prêt à être utilisé.

Vous pouvez ensuite vous connecter à votre site, et accéder au panel adminstrateur en cliquant sur votre nom
dans le coin supérieur droit.

{{< warn >}}
Une fois l'installation terminée, pour éviter tout problème, assurez-vous que votre site
n'est pas accessible directement via l'IP du serveur (ex : http://0.0.0.0).
{{< /warn >}}

### Tâches CRON

Cette dernière étape est optionnelle, mais certaines fonctionnalités nécessitent les tâches CRON pour certaines opérations,
comme le renouvellement automatique des abonnements dans la boutique.

#### Hébergement Web

Sur un hébergement mutualisé, vous pouvez généralement configurer les tâches CRON directement via le panel de l'hébergeur,
dans la section « Tâches CRON » ou « Tâches planifiées ».

Ajoutez une tâche executée **toutes les minutes** avec la commande `cd /azuriom && php artisan schedule:run` (**remplacez `/azuriom`
par l'emplacement de votre site**, par exemple `/public_html` sur cPanel).

Sur certains panels, il est nécessaire de sélectionner un fichier PHP avec un argument, dans ce cas, choisissez :
* Script PHP : `/azuriom/artisan` (**remplacez `/azuriom` par l'emplacement de votre site**, comme `/httpdocs` sur Plesk, mais en gardant le `/artisan`)
* Argument : `schedule:run`

#### VPS ou Serveur Dédié

Sur un VPS ou un serveur dédié, vous pouvez ajouter une nouvelle tâche CRON avec la commande `crontab -e`
et en ajoutant la ligne suivante (**remplacez `/var/www/azuriom` par l'emplacement de votre site**) :

```sh
* * * * * cd /var/www/azuriom && php artisan schedule:run >> /dev/null 2>&1
```

## Installation des Prérequis

Si vous utilisez un hébergement mutualisé, les prérequis sont très probablement déjà installés,
et vous pouvez directement passer à l'installation d'Azuriom.

L'installation recommandée pour Azuriom est **PHP** avec **Nginx** et une base de données **MySQL/MariaDB** ou **PostgreSQL**.
Cependant, Azuriom peut également fonctionner avec d'autres serveurs web tels qu'Apache2,
et est aussi compatible avec SQLite et SQLServer (bien que ces bases de données ne soient pas recommandées).

Dû au grand nombre de systèmes d'exploitation et de distributions,
il est impossible de fournir les détails de l'installation pour chaque plateforme :
* Sous Windows, vous pouvez utiliser un outil tel que [Laragon](https://laragon.org/) pour faciliter le développement en local.
* Sur un serveur Linux, de nombreux tutoriels sont disponibles en ligne pour les différentes distributions
expliquant comment installer Nginx, MariaDB et PHP (ou tout autre serveur web et base de données supportés).

{{< info >}}
Si la version de PHP détectée par l'installateur pendant l'installation ne correspond pas à celle renvoyée
par la commande `php -v`, c'est probablement que la version de PHP CLI (Interface en Ligne de Commande)
est différente de la version de PHP utilisée par le serveur web (Apache, Nginx, etc.).
{{< /info >}}

### Debian

Pour simplifier l'installation, voici un guide rapide pour installer Nginx, MariaDB et PHP 8.4 sur un serveur **Debian** :
1. Mettre à jour la liste des paquets et mettre à jour le système :
   ```sh
   apt update -y && apt upgrade -y
   ```
2. Installer Nginx, MariaDB ainsi que les dépendances nécessaires :
   ```sh
   apt install -y nginx mariadb-server zip curl lsb-release apt-transport-https ca-certificates
   ```
3. Ajouter le dépôt PHP et installer PHP 8.4 avec les extensions nécessaires :
   ```sh
   wget -O /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg
   echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" | tee /etc/apt/sources.list.d/php.list
   apt update -y
   apt install -y php8.4 php8.4-fpm php8.4-mysql php8.4-pgsql php8.4-sqlite3 php8.4-bcmath php8.4-mbstring php8.4-xml php8.4-curl php8.4-zip php8.4-gd
   ```
4. Créer un nouvel utilisateur SQL et une base de données pour Azuriom (**remplacez `<password>` par un mot de passe sécurisé !**) :
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

Si vous utilisez Pterodactyl, l’installation d’Azuriom via l’interface de Pterodactyl est fortement déconseillée.
À la place, il est recommandé d’installer Azuriom directement sur le même serveur hôte que le panel Pterodactyl.

Pour cela, utilisez un domaine ou sous-domaine différent pour Azuriom et Pterodactyl.
Vous pouvez configurer cela en utilisant des hôtes virtuels Apache ou des blocs serveur Nginx afin de
gérer les deux sites de manière indépendante.

## Configurer le serveur web

### Apache2

Si vous utilisez Apache2, il peut être nécessaire d'activer la réécriture d'URL.

Commencez par activer le module `rewrite` avec la commande suivante :
```sh
a2enmod rewrite
```

Ensuite, modifiez le fichier de configuration Apache2 de votre site, généralement situé dans
`/etc/apache2/sites-available/000-default.conf` ou `/etc/apache2/sites-available/default-ssl.conf`,
et ajoutez la configuration suivante à l'intérieur de la balise `<VirtualHost>` (**remplacez `/var/www/azuriom` par l'emplacement du site**) :
```apache{hl_lines=[1]}
<Directory "/var/www/azuriom">
   Options FollowSymLinks
   AllowOverride All
   Require all granted
</Directory>
```

Enfin, redémarrez Apache2 avec la commande suivante :
```sh
service apache2 restart
```

### Nginx

La configuration suivante est un exemple de configuration Nginx pour Azuriom.

Assurez-vous de remplacer `example.com` par votre domaine, `/var/www/azuriom` par l'emplacement de votre site,
et `php8.4` par la version de PHP installée.

La directive `root` doit se contenir `/public` à la fin, après l'emplacement du site.

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
        fastcgi_pass unix:/var/run/php/php8.4-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Ensuite, redémarrez Nginx avec la commande suivante :
```sh
service nginx restart
```
