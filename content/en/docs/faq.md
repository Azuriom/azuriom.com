---
title: FAQ
weight: 3
---

# Frequently Asked Questions

These are some frequently asked questions. Please check here to see if your question has already been answered before seeking support.

## Cookies Banner

In many countries, it is mandatory to obtain consent before storing certain types of cookies on a user's device.

However, Azuriom only uses cookies that are necessary for the proper functioning of the website;
none of these cookies contain personal data or are used for marketing purposes.
Therefore, a cookie banner is not required for Azuriom to comply with GDPR, Swiss DPA, and similar regulations.

Privacy is important, but nobody likes annoying pop-ups on every website they visit.
That's why Azuriom is designed to be privacy-friendly by default.

## 404 error

Sometimes the home page works while other pages return a 404 error.
This issue is usually caused by URL rewriting not being enabled on your server,
see below for instructions on how to enable it.

## URL rewrite

### Apache2

See the [Apache2 configuration](installation#apache2) section of the installation documentation for more information.

### Nginx

Edit the Nginx configuration, usually located in `/etc/nginx/sites-available/default`
or `/etc/nginx/sites-available/example.com`, and append `/public` to the end of the `root` line, as shown below:
```nginx
root /var/www/html/public;
```

Then, Nginx can be restarted with the following command:
```sh
service nginx restart
```

## Edit database credentials

It may be necessary to change the database credentials after installation,
this can be done by editing the `.env` file at the root of the site.

Once done, delete the `bootstrap/cache/config.php` file if it exists.

## cURL error 60

To resolve the `curl: (60) SSL certificate: unable to get local issuer certificate` error,
follow these steps:
1. Download the latest `cacert.pem` from https://curl.haxx.se/ca/cacert.pem
2. Add the following line to your `php.ini` file (replace `/path/to/cacert.pem` with the location of the `cacert.pem` file):
   ```ini
   curl.cainfo="/path/to/cacert.pem"
   ```
3. Restart PHP

## Images are not displayed

If the images do not appear, try the following:
* Delete, if it exists, the `public/storage` folder (but not the `storage` folder!). If the folder does not exist, you can skip this step.
* Run the `php artisan storage:link` command at the root of the website.
  * If commands cannot be run, go to the URL `/admin/settings/storage/link` on your website.

## Images not uploading

By default, PHP sets the maximum file upload size to 2MB.
Although this limit can be increased in the `php.ini` file, uploading large images is strongly discouraged.

Instead, it is recommended that you resize the image before uploading to avoid performance issues.

## AzLink or Payments Issues

Cloudflare can prevent AzLink or some payment gateways from working
correctly.

To fix this issue, you can configure Cloudflare on the API, by going on the Cloudflare Dashboard,
in "Rules", create a "Configuration Rule" with "Custom filter expression" and select 
"URI Path starts with `/api/`" and the following settings:
* I'm Under Attack: add and set to off
* Browser Integrity Check: add and set to off

If the problem persists, review the firewall rules as well.

## Setup another website on Apache2

If you wish to install another site (e.g., a Pterodactyl panel) on the same web
server as Azuriom, it is recommended to install it on a subdomain (e.g., `panel.your-website.com`).  

If that is not possible, you can configure Apache to run them on the same domain by adding an
`.htaccess` file to the directory of the other website (e.g., `/panel`) with the following content:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^ - [L]
</IfModule>
```

## Migrate to Another Host

An existing Azuriom installation can be migrated to a new host by following the steps below to ensure a smooth transition:

1. Transfer all Azuriom files to the new host and export the SQL database from the old server, then import it on the new one.
2. Update the database credentials in the `.env` file to match the new host configuration (see [above for more details](#edit-database-credentials)).
3. If issues occurs with some extensions after the migration, disable the active theme and plugins, then re-enable them to ensure they are correctly loaded.
