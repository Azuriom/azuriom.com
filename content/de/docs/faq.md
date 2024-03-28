---
title: FAQ
weight: 3
---

# Fehlerbeseitigung

Es können Fehler auftreten, die nicht unbedingt vom CMS kommen,
aber hier sind die häufigsten Fehler mit ihren Lösungen!

## Allgemeine Probleme

### Die Homepage funktioniert, aber die anderen Seiten erzeugen einen 404-Fehler

The URL rewriting is not activated, you just have to activate it (see next question).

### Apache2 URL rewrite
Du musst die Datei `/etc/apache2/sites-available/000-default.conf` ändern und diese Zeilen zwischen den `<virtual>`-Tags hinzufügen:
```
<Directory "/var/www/html">
  AllowOverride All
</Directory>
```

Aktiviere das `rewrite`-Modul von Apache2:
```
a2enmod rewrite
```

Dann starte mit
```
service apache2 restart
```
Apache2 neu

### Nginx URL rewrite
Du musst die Konfiguration Deiner Site (in `/etc/nginx/sites-available/`) bearbeiten
und `/public` am Ende der Zeile mit root hinzufügen, wie folgt:
```
root /var/www/html/public;
```

Dann starte mit
```
service nginx restart
```
Nginx neu


### Fehler 500 bei der Registrierung

Wenn das Konto trotz des Fehlers korrekt erstellt wurde, kann dieses Problem auftreten,
wenn der E-Mail-Versand nicht richtig konfiguriert ist,
überprüfe dazu die Konfiguration des E-Mail-Versands im Admin-Panel Deiner Site.

### cURL Fehler 60

If you get this error:
`curl: (60) SSL certificate: unable to get local issuer certificate`, just  follow
these steps:
1) Lade die aktuelle `cacert.pem` von https://curl.haxx.se/ca/cacert.pem herunter
1) Füge diese Zeile in die `php.ini` ein (ersetze `/path/to/cacert.pem` durch den Speicherort
   der Datei `cacert.pem`):
   ```
   curl.cainfo="/path/to/cacert.pem""
   ```
1) Starte PHP neu

### Die Datei wurde beim Hochladen eines Bildes nicht hochgeladen

Dieses Problem tritt auf, wenn Du ein Bild mit einer höheren Gewichtung als
dem von PHP erlaubten Maximum (Standard 2mo) hochlädst.

Du kannst die maximal zulässige Größe beim Hochladen
in der Konfiguration von PHP (in `php.ini`) ändern,
indem Du die folgenden Werte änderst:
```
upload_max_filesize = 10M
post_max_size = 10M
```

### Problem mit AzLink oder Zahlungsgateways mit Cloudflare

Cloudflare kann verhindern,
dass AzLink oder einige Zahlungsgateways ordnungsgemäß funktionieren.

Um dieses Problem zu beheben, kannst Du Cloudflare in der API deaktivieren,
indem Du zu Seitenregeln - Regel hinzufügen gehst,
dann `/api/*` als URL hinzufügst und diese Aktionen ausführst:
-> Füge eine Regel hinzu, füge dann `/api/*` als URL und diese Aktionen hinzu:
* Cache Level: 'Bypass'
* Security Level: 'Medium' or 'High'
* Browser Integrity Check: 'OFF' 

Wenn das Problem weiterhin besteht, überprüfe auch die Firewall-Regeln.

Weitere Details sind auf der [Cloudflare Website](https://support.cloudflare.com/hc/en-us/articles/200504045-Using-Cloudflare-with-your-API) verfügbar.

### Erzwinge HTTPS auf Apache2

Füge diese Zeilen **direkt nach** `RewriteEngine On` in die `.htaccess` im Stammverzeichnis
Deiner Website ein:
```
RewriteCond %{HTTPS} off
RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI} [R,L]
```

### Stimmen werden auf unbestimmte Zeit geladen

Du kannst die IPv4-/IPv6-Kompatibilität in den Abstimmungs-Plugin-Einstellungen aktivieren,
um dieses Problem zu lösen.

Wenn Du Cloudflare verwendest, ziehe auch die Installation des Plugins
[Cloudflare Support](https://market.azuriom.com/resources/12) in Betracht.

### Ändern der Datenbankanmeldeinformationen

Du kannst die Datenbank-Anmeldeinformationen ändern,
indem SDuie die `.env`-Datei im Stammverzeichnis der Site bearbeitest
(möglicherweise musst Du die versteckten Dateien aktivieren, um sie anzuzeigen).
Wenn Du fertig bist, lösche die Datei `bootstrap/cache/config.php`,
falls sie vorhanden ist.

### Installation einer anderen Website auf Apache2

If you wish to install another site (ex: Pterodactyl panel, etc)
on the same web server as the one on which Azuriom is installed, it's recommended
to install it on a sub-domain (ex: panel.your-website.com).

Falls dies nicht möglich ist, kannst Du Apache so konfigurieren,
dass sie auf derselben Domain ausgeführt werden,
indem Du eine `.htaccess`-Datei zum Verzeichnis der anderen Website (z. B. /panel)
mit folgendem Inhalt hinzufügst:
```
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^ - [L]
</IfModule>
```