---
title: FAQ
weight: 3
---

# Foutoplossing:

Er kunnen fouten optreden, dit komt niet noodzakelijk door het CMS,
maar hier zijn de meest voorkomende fouten met hun oplossingen!

## Veel voorkomende problemen

### De startpagina werkt, maar de andere pagina's produceren een 404-fout.

Het herschrijven van URLs is niet geactiveerd, u hoeft het alleen maar te activeren (zie volgende vraag)

### Apache2 URL herschrijven
U moet het bestand `/etc/apache2/sites-available/000-default.conf` wijzigen en deze regels tussen de `<VirtualHost>`-tags toevoegen:
```
<Directory "/var/www/html">
  AllowOverride All
</Directory>
```

Start Apache2 vervolgens opnieuw met de volgende commando:
```
service apache2 restart
```

### Nginx URL herschrijven
U moet de configuratie van uw site bewerken (in `/etc/nginx/sites-available/`) en `/public` toevoegen aan het einde van de
regel die `root` bevat, als volgt:
```
root /var/www/html/public;
```

Start Nginx vervolgens opnieuw met de volgende commando:
```
service nginx restart
```


### Fout 500 tijdens registratie

Als het account ondanks de fout correct is aangemaakt, kan dit probleem optreden als:
het verzenden van e-mails niet correct geconfigureerd is, voor dit controleer
de configuratie van het verzenden van e-mails op het beheerders paneel van uw site.

### cURL-fout 60

Als u deze fout krijgt:
`curl: (60) SSL Certificate: Unable to get local issuer certificate`,
volg deze stappen:
1) Download de nieuwste `cacert.pem` op https://curl.haxx.se/ca/cacert.pem
1) Voeg deze regel toe aan de php.ini bestand (vervang `/path/to/cacert.pem` voor
de locatie van het bestand `cacert.pem`):
   ```
   curl.cainfo="/path/to/cacert.pem""
   ```
1) Herstart PHP

### Het bestand is niet geüpload bij het uploaden van een afbeelding

Dit probleem doet zich voor wanneer u een afbeelding upload met een grotere bestandsgrootte
dan de maximum toegestane bestandsgrootte door PHP (standaard 2MB)

U kunt de maximaal toegestane grootte wijzigen bij het uploaden in de configuratie
van PHP (in `php.ini`) door de volgende waarden te wijzigen:
```
upload_max_filesize = 10M
post_max_size = 10M
```

### Probleem met AzLink en betalingsdiensten met Cloudflare

Cloudflare kan voorkomen dat AzLink of sommige betalingsdiensten correct werken.

Om dit probleem op te lossen, kunt u Cloudflare op de API uitschakelen door naar Paginaregels te gaan
-> Voeg een regel toe, voeg dan `/api/*` toe als de URL en de volgende acties:
* Cache Level: 'Bypass'
* Always Online: 'OFF'
* Security Level: 'Medium' or 'High'
* Browser Integrity Check: 'OFF' 

Als het probleem zich blijft voordoen, controleert u ook de firewall regels.

Meer details zijn beschikbaar op de [Cloudflare website](https://support.cloudflare.com/hc/en-us/articles/200504045-Using-Cloudflare-with-your-API).

### Forceer HTTPS op Apache2

Voeg deze regels **net na** `RewriteEngine On` toe in de `.htaccess` in de hoofdmap van je website.
```
RewriteCond %{HTTPS} off
RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI} [R,L]
```

### Stemmen laden oneindig

U kunt ipv4/ipv6-compatibiliteit inschakelen in de instellingen van de stem plug-in
om dit probleem op te lossen.

Als je Cloudflare gebruikt, overweeg dan ook om de volgende plug-in te installeren
[Cloudflare ondersteuning](https://market.azuriom.com/resources/12).

### Wijzig de database referenties

U kunt de database gegevens wijzigen door het `.env` bestand te bewerken
in de hoofdmap van uw website (het kan nodig zijn om geheime bestanden zichbaar te maken)
Als je klaar bent, verwijder je het bestand `bootstrap/cache/config.php` als het bestaat.

### Een andere website installeren op Apache2

Als u een andere site wilt installeren (bijv. Pterodactyl-paneel, enz.)
op dezelfde webserver als waarop Azuriom is geïnstalleerd,
word aanbevolen om het op een subdomein te installeren (bijv. panel.uw-website.nl).

Als het niet mogelijk is, kunt u Apache configureren om:
Ze uit te voeren op hetzelfde domein, door een `.htaccess`-bestand toe te voegen aan de map
van de andere website (bijv. /panel) met de volgende inhoud:
```
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^ - [L]
</IfModule>
``` 
