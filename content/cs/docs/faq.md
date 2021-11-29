---
title: Často kladené otázky
weight: 3
---

# Řešení chyb

Mohou se objevit chyby, nemusejí být vždy od CMS,
ale zde jsou popsány nejběžnější omyly a jejich řešení!

## Běžné problémy

### Domovská stránka funguje, ale ostatní ukazují chybu 404

Není aktivováno přepisování URL, musíte jej aktivovat (viz další otázka).

### Apache2 přepsání URL
Musíte upravit soubor `/etc/apache2/sites-available/000-default.conf` a následující řádky mezi značkami `<VirtualHost>`:
```
<Directory "/var/www/html">
  AllowOverride All
</Directory>
```

Poté restartujte Apache2 pomocí
```
service apache2 restart
```

### Nginx přepsání URL
Musíte upravit konfiguraci vašeho webu (v `/etc/nginx/sites-available/`) a přidat `/public` na konec
řádku obsahující `root`, například takto:
```
root /var/www/html/public;
```

Poté restartujte Nginx pomocí
```
service nginx restart
```


### Chyba 500 při registraci

Pokud byl účet navzdory chybě vytvořen zprávě, může tento problém nastat, pokud
není správně nastaveno odesílání e-mailů, zkontrolujte tedy
konfiguraci odesílání e-mailů ve správcovském panelu vašeho webu.

### cURL chyba 60

Pokud dostanete tuto chybu:
`curl: (60) SSL certificate: unable to get local issuer certificate`, stačí následovat
následující kroky
1) Stáhněte si nejnovější soubor `cacert.pem` z https://curl.haxx.se/ca/cacert.pem
1) Přidejte následující řádek do php.ini (nahraďte `/path/to/cacert.pem`
lokací souboru `cacert.pem`):
   ```
   curl.cainfo="/path/to/cacert.pem""
   ```
1) Restartujte PHP

### Soubor nebyl nahrán při nahrávání obrázku

Tento problém nastane, pokud nahrajete obrázek s větší výškou, než je
maximální povolená PHP (výchozí 2mo).

Maximální povolenou velikost při nahrávání můžete změnit v konfiguračním souboru
PHP (v `php.ini`) změnou následujících hodnot:
```
upload_max_filesize = 10M
post_max_size = 10M
```

### Problém AzLinkem nebo platebními bránami s Cloudflare

Cloudflare může zabránit správné funkci AzLinku nebo některých platebních bran.

Pro opravení této chyby můžete zakázat Cloudflare na API tím, že půjdete do pravidel stránek
-> Přidejte pravidlo, poté přidejte `/api/*` as the URL and these actions:
* Cache Level: 'Bypass'
* Always Online: 'OFF'
* Security Level: 'Medium' nebo 'High'
* Browser Integrity Check: 'OFF' 

Pokud problém přetrvává, zkontrolujte také pravidla firewallu.

Další podrobnosti lze nalézt na [webu Cloudflare](https://support.cloudflare.com/hc/en-us/articles/200504045-Using-Cloudflare-with-your-API).

### Vynucení HTTPS na Apache2

Přidejte následující řádky **přímo za** `RewriteEngine On` v souboru `.htaccess` v kořenovém adresáři vašeho webu:
```
RewriteCond %{HTTPS} off
RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI} [R,L]
```

### Hlasy se načítají donekonečna

V nastavení hlasovacího pluginu můžete povolit kompatibilitu s ipv4/ipv6
pro vyřešení tohoto problému.

Pokud používáte Cloudflare, zvažte také instalaci doplňku
[Cloudflare Support](https://market.azuriom.com/resources/12).

### Změna údajů databáze

Údaje databáze můžete změnit úpravou souboru
`.env` v kořenovém adresáři webu (možná budete muset povolit zobrazení skrytých souborů
Jakmile budete hotovi, odstraňte soubor `bootstrap/cache/config.php`, pokud existuje.

### Instalace dalšího webu na Apache2

Pokud chcete nainstalovat další web (např. Pterodactyl panel atd.)
na stejném webovém serveru jako Azuriom, je doporučeno
nainstalovat jej na subdoménu (např.: panel.your-website.com).

V případě, že to není možné, můžete nakonfigurovat Apache, aby
běžely na stejné doméně, přidáním souboru `.htaccess` do adresáře
jiného webu (například: /panel) s následujícím obsahem:
```
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^ - [L]
</IfModule>
``` 
