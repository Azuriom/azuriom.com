---
title: Mails
---

# E-mails versturen

Azuriom ondersteunt 2 verschillende methoden voor het verzenden van e-mail naar gebruikers: Sendmail en SMTP.
Sendmail is eenvoudiger te gebruiken en te installeren, maar de e-mails worden eerder als spam beschouwd.

## SMTP-server

Sommige gedeelde webhosts bieden een SMTP-server die direct kan worden gebruikt.
Anders is het mogelijk om zelf een SMTP-server te installeren maar dit is erg complex,
en het is vaak gemakkelijker om een speciale dienst te gebruiken zoals:
* [Mailgun](https://www.mailgun.com/): 0.80$ / 1000 e-mails
* [Amazon SES](https://aws.amazon.com/ses/): 0.10$ / 1000 e-mails
* [Sendgrid](https://sendgrid.com/): 100 e-mails/per dag gratis (of 15$/per maand 40.000 e-mails / per maand)

Kies dan gewoon SMTP in de e-mail instellingen van Azuriom en vul de SMTP-server informatie in.

## Sendmail

Als je op gedeelde webhosting zit, is Sendmail waarschijnlijk al geïnstalleerd
Op een VPS of dedicated server kan Sendmail worden geïnstalleerd met het volgende commando:
```
apt install -y sendmail
```

Kies dan gewoon Sendmail in de e-mail instellingen van Azuriom.
