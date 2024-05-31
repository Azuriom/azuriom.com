---
title: FAQ
weight: 3
---

# FAQ

Errors may occur, it is not necessarily from the CMS,
but here are the most common mistakes with their solutions!

## The home page works, but the other pages produce a 404 error

The URL rewriting is not activated, you just have to activate it (see next question).

## Apache2 URL rewrite
Edit your Apache2 configuration (by default in `/etc/apache2/sites-available/000-default.conf`) and add these lines between the `<VirtualHost>` tags:
```
<Directory "/var/www/html">
  AllowOverride All
</Directory>
```

Enable the `rewrite` module of Apache2:
```
a2enmod rewrite
```

Then restart Apache2:
```
service apache2 restart
```

## Nginx URL rewrite
You have to edit the configuration of your site (in `/etc/nginx/sites-available/`) and add `/public` at the end of the
line containing `root`, like this :
```
root /var/www/html/public;
```

Then restart Nginx with
```
service nginx restart
```

## Error 500 during registration

If the account is created correctly despite the error, this problem can occur if
the sending of e-mails is not correctly configured, for this check
the configuration of the sending of emails on the admin panel of your site.

## cURL error 60

If you get this error:
`curl: (60) SSL certificate: unable to get local issuer certificate`, just  follow
these steps:
1) Download the latest `cacert.pem` on https://curl.haxx.se/ca/cacert.pem
1) Add this line in the php.ini (replace `/path/to/cacert.pem` by
the location of the `cacert.pem` file):
   ```
   curl.cainfo="/path/to/cacert.pem""
   ```
1) Restart PHP

## Images are not displayed

If the images uploaded in the admin panel are in the images list, but they are not
loading, you can try doing the following:
* Delete, if it exists, the `public/storage` folder (but not the `storage` folder!)
* Then do the `php artisan storage:link` command at the root of the website.
    * If you can't run commands, you can instead go to the URL `/admin/settings/storage/link` on your website.

## The file has not been uploaded when uploading an image

This problem occurs when you upload an image with a weight greater than the
maximum allowed by PHP (default 2 MB).

You can change the maximum size allowed when uploading in the configuration
of PHP (in `php.ini`) by changing the following values:
```
upload_max_filesize = 10M
post_max_size = 10M
```

{{< warn >}}
It is strongly advised to not change this limit, as heavy images can increase the
loading time of your website and impact search engine optimization. Instead,
it is recommended to reduce the size of the image (ideally below 1 MB).
{{< /warn >}}

## Problem with AzLink or payment gateways with Cloudflare

Cloudflare can prevent AzLink or some payment gateways from working
correctly.

To fix this issue, you can disable Cloudflare on the API, by going on the Cloudflare Dashboard,
in "Rules", "Page Rules", add a rule with "Custom filter expression" and select 
"URI Path starts with `/api/`" and the following actions:
* Security Level: Low
* Browser Integrity Check: Disabled

If the problem persists, check the firewall rules as well.

## Force HTTPS on Apache2

Add these lines **juste after** `RewriteEngine On` in the `.htaccess` at the root of your website:
```
RewriteCond %{HTTPS} off
RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI} [R,L]
```

## Setup CRON jobs

Some features need the scheduler to be set up, for this you need to configure your server to run the
command `php artisan schedule:run` every minute, for example by adding this Cron entry (don't forget to
replace `/var/www/azuriom` with the location of the site):
```
* * * * * cd /var/www/azuriom && php artisan schedule:run >> /dev/null 2>&1
```

This can be done by modifying the crontab configuration with the `crontab -e` command.

## Votes load indefinitely

You can enable ipv4/ipv6 compatibility in the vote plugin settings
to solve this issue.

If you use Cloudflare, also consider installing the plugin
[Cloudflare Support](https://market.azuriom.com/resources/12).

## Change the database credentials

You can change the database credentials by editing
the `.env` file at the root of the site (it may be necessary to activate the hidden
files so see it)
Once done, delete the `bootstrap/cache/config.php` file if it exists.

## Installing another website on Apache2

If you wish to install another site (ex: Pterodactyl panel, etc.)
on the same web server as the one on which Azuriom is installed, it's recommended
to install it on a subdomain (ex: panel.your-website.com).

In case it's not possible, you can configure Apache to
run them on the same domain, by adding an `.htaccess` file to the directory
of the other website (ex: /panel) with the following content :
```
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^ - [L]
</IfModule>
``` 
