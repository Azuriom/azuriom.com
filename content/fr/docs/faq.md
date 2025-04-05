---
title: FAQ
weight: 3
---

# Questions fréquemment posées

Voici quelques questions fréquemment posées. Veuillez vérifier ici si la réponse
à votre question se trouve ici avant de demander de l'aide.

## Bannière de cookies

Dans de nombreux pays, il est obligatoire d'obtenir le consentement avant de stocker
certains types de cookies dans le navigateur d'un utilisateur.

Cependant, Azuriom n'utilise que des cookies nécessaires au bon fonctionnement du site,
et aucun de ces cookies ne contient de données personnelles, ni n'est utilisé à des fins marketing.
Par conséquent, une bannière de cookies n'est pas requise pour qu'Azuriom soit conforme au RGPD, à la LPD suisse
et à d'autres réglementations similaires.

La confidentialité est importante, mais personne n'aime les popups frustrants sur tous les sites visités.
C'est pour cela qu'Azuriom est conçu pour être respectueux de la vie privée par défaut.

## Erreur 404

Parfois, la page d'accueil fonctionne alors que les autres pages renvoient une erreur 404.
Ce problème est généralement causé par le fait que la réécriture d'URL n'est pas activée sur votre serveur.
Consultez la suite de la documentation pour l'activer.

## Réécriture d'URL

### Apache2

Consultez la section [Configuration d'Apache2](installation#apache2) de la documentation d'installation pour plus d'informations.

### Nginx

Modifiez la configuration de Nginx, généralement située dans `/etc/nginx/sites-available/default`
ou `/etc/nginx/sites-available/example.com`, et ajoutez `/public` à la fin de la ligne `root`, comme ceci :
```nginx
root /var/www/html/public;
```

Ensuite, redémarrez Nginx avec la commande suivante :
```sh
service nginx restart
```

## Modifier les accès BDD

Il peut être nécessaire de modifier les identifiants de la base de données après l'installation.
Cela peut se faire fait en modifiant le fichier `.env` à la racine du site.
Une fois fait, supprimez le fichier `bootstrap/cache/config.php`, s'il existe.

## Erreur cURL 60

Pour corriger l'erreur `curl: (60) SSL certificate: unable to get local issuer certificate`, suivez ces étapes :
1. Téléchargez le fichier `cacert.pem` depuis [https://curl.haxx.se/ca/cacert.pem](https://curl.haxx.se/ca/cacert.pem)
2. Ajoutez la ligne suivante à votre fichier `php.ini` (remplacez `/path/to/cacert.pem` par l'emplacement du fichier `cacert.pem`) :
   ```ini
   curl.cainfo="/path/to/cacert.pem"
   ```
3. Redémarrez PHP

## Images ne s'affichent pas

Si les images téléchargées depuis le panel admin sont bien dans la liste des images,
mais qu'elles ne s'affichent pas, vous pouvez essayer de faire les manipulations suivantes :
* Supprimer, s'il existe, le dossier `public/storage` (et non le dossier `storage`!)
* Puis faire la commande `php artisan storage:link` à la racine du site.
    * Si vous ne pouvez pas exécuter de commandes, vous pouvez à la place aller sur l'URL `/admin/settings/storage/link` de votre site.

## Images ne se téléchargent pas

Par défaut, PHP définit la taille maximale des fichiers transférés à 2 Mo.  
Cette limite peut être augmentée dans le fichier `php.ini`, mais il est fortement
déconseillé d'upload des images lourdes. Il est recommandé de redimensionner l'image
avant de l'uploader afin d'évier les problèmes de performance.

## Problèmes avec AzLink ou les Paiements

Cloudflare peut parfois empêcher AzLink ou certains systèmes de paiement de fonctionner correctement.  
Pour résoudre ce problème, désactivez Cloudflare sur l'API en vous connectant au tableau de bord Cloudflare, en allant dans "Règles" → "Règles de Configuration",
en ajoutant une règle avec une "Expression personnalisée" avec "Chemin URI commence par `/api/`" et les actions suivantes :
* Niveau de sécurité : Faible
* Contrôle de l'intégrité du navigateur : Désactivé

Si le problème persiste, vérifiez également les règles du pare-feu.

## Second site sur Apache2

Si vous souhaitez installer un autre site (par exemple, le panneau Pterodactyl) sur le même serveur web qu'Azuriom, il est recommandé de l'installer sur un sous-domaine (par exemple, panel.votre-site.com).  
Si cela n'est pas possible, vous pouvez configurer Apache pour les faire fonctionner sur le même domaine en ajoutant un fichier `.htaccess` dans le répertoire de l'autre site (par exemple, /panel) avec le contenu suivant :
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^ - [L]
</IfModule>
```
