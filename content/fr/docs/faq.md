---
title: FAQ
weight: 3
---

# FAQ

Il est possible que des erreurs surviennent, cela ne vient pas forcément d'Azuriom,
mais les erreurs les plus fréquentes et leurs solutions vous sont présentées sur cette page.

## La page d'accueil fonctionne, mais les autres pages produisent une erreur 404

La réécriture d'URL n'est pas activée, il vous suffit de l'activer (voir question suivante).

## Réécriture d'URL avec Apache2
Modifiez votre configuration Apache2 (par défaut dans `/etc/apache2/sites-available/000-default.conf`) et rajoutez ces lignes entre les balises `<VirtualHost>`:
```
<Directory "/var/www/html">
  AllowOverride All
</Directory>
```

Activer le module `rewrite` d'Apache2 :
```
a2enmod rewrite
```

Puis redémarrez Apache2 pour appliquer les changements :
```
service apache2 restart
```

## Réécriture d'URL avec NGINX
Pour qu'Azuriom fonctionne, NGINX doit pointer vers le dossier `public`.
Pour cela, il faut modifier la configuration de votre site (dans `/etc/nginx/sites-available/`) et rajouter `/public` à la fin de la
ligne contenant `root`, ce qui donne par exemple :
```
root /var/www/html/public;
```

Puis redémarrer NGINX pour appliquer les changements :
```
service nginx restart
```

## Erreur 500 lors de l'inscription

Si le compte est bien créé malgré l'erreur, ce problème peut se produire dans
le cas où l'envoi des mails n'est pas correctement configuré. Vérifiez
la configuration de l'envoi des mails dans l'interface d'administration de votre site.

## Erreur cURL 60

Si vous rencontrez cette erreur :
`curl: (60) SSL certificate : unable to get local issuer certificate`, il suffit
de suivre les étapes suivantes :
1) Télécharger le dernier `cacert.pem` sur https://curl.haxx.se/ca/cacert.pem
1) Ajouter cette ligne dans le php.ini (en remplaçant `/path/to/cacert.pem` par
l'emplacement du fichier `cacert.pem`:
   ```
   curl.cainfo="/path/to/cacert.pem"
   ```
1) Redémarrer PHP (FPM)

## Les images ne s'affichent pas

Si les images téléchargées depuis le panel admin sont bien dans la liste des images,
mais qu'elles ne s'affichent pas, vous pouvez essayer de faire les manipulations suivantes :
* Supprimer, s'il existe, le dossier `public/storage` (et non le dossier `storage`!)
* Puis faire la commande `php artisan storage:link` à la racine du site.
    * Si vous ne pouvez pas exécuter de commandes,
      vous pouvez à la place aller sur l'URL `/admin/settings/storage/link` de votre site.

## Le fichier n'a pas été téléchargé lors de l'upload d'une image

Ce problème survient lorsque vous téléchargez une image dont le poids dépasse le
maximum autorisé par PHP (par défaut 2 MO).

Vous pouvez modifier la taille maximum autorisée lors de l'upload dans la configuration
de PHP (dans le `php.ini`) en modifiant les valeurs suivantes :
```
upload_max_filesize = 10M
post_max_size = 10M
```

{{< warn >}}
Il est fortement déconseillé d'augmenter cette limite, car des images trop lourdes peuvent
augmenter le temps de chargement de votre site et impacter le
référencement dans les moteurs de recherche. À la place, il est recommandé de réduire
la taille de l'image (idéalement en dessous de 1 MO).
{{< /warn >}}

## Problème avec AzLink ou les moyens de paiements en utilisant Cloudflare

Cloudflare peut empêcher AzLink ou certains moyens de paiements de fonctionner
correctement.

Pour corriger ce problème, vous pouvez désactiver Cloudflare sur l’API, en allant sur le dashboard Cloudflare,
dans l'onglet "Règles" puis "Règles de configuration", ajoutez une règle en sélectionnant "Expression personnalisée" avec
"Chemin URI commence par `/api/`" et les actions suivantes :
* Niveau de sécurité : Faible
* Contrôle de l’intégrité du navigateur : Désactivé

Si le problème persiste, vérifiez également les règles du pare-feu.

## Forcer le HTTPS avec Apache2

Ajoutez ces lignes **juste après** le `RewriteEngine On` dans le `.htaccess` à la racine du site :
```
RewriteCond %{HTTPS} off
RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI} [R,L]
```

## Configurer les tâches planifiées (Cron)

Certaines fonctionnalités ont besoin des tâches planifiées soient mises en place.
Pour cela, vous devez configurer votre serveur pour que la commande `php artisan schedule:run`
soit exécutée toutes les minutes. Par exemple, en ajoutant cette entrée Cron
(n'oubliez pas de remplacer `/var/www/azuriom` par l'emplacement du site) :
```
* * * * * cd /var/www/azuriom && php artisan schedule:run >> /dev/null 2>&1
```

Cela peut être fait en modifiant la configuration de crontab avec la commande `crontab -e`.

## Les votes chargent indéfiniment

Vous pouvez activer la compatibilité IPv4/IPv6 dans les paramètres du plugin vote
pour résoudre ce problème.

Si vous utilisez Cloudflare, pensez également à installer le plugin
[Cloudflare Support](https://market.azuriom.com/resources/12).

## Changer les identifiants de la base de données

Vous pouvez changer les informations de connexion à la base de données en modifiant
le fichier d'environnement `.env` à la racine du site. Si celui-ci ne s'affiche pas, il peut être nécessaire
d'activer l'affichage des fichiers "cachés".
Une fois fait, supprimez le fichier `bootstrap/cache/config.php` s'il existe.

## Installer un autre site avec Apache2

Si vous souhaitez installer un autre site (ex : panel Pterodactyl, etc)
sur le même serveur web que celui sur lequel est installé Azuriom, il est recommandé
de l'installer sur un sous-domaine (ex : panel.votre-site.fr).

Dans le cas où ce n'est pas possible, vous pouvez configurer Apache pour les faire
fonctionner sur le même domaine, en ajoutant un fichier `.htaccess` dans le dossier
de l'autre site (ex : /panel) avec le contenu suivant :
```
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^ - [L]
</IfModule>
``` 
