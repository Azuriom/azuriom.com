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
* [Scaleway](https://www.scaleway.com/en/transactional-email-tem/): 3,000 emails gratis per maand, dan 1€ per 1000 emails
* [Brevo](https://www.brevo.com/): 300 emails gratis per dag, dan 25$/maand voor 20k emails/maand
* [MailPace](https://mailpace.com/): 3.3$/maand voor 1,000 emails
* [MailerSend](https://www.mailersend.com/): 3,000 emails gratis, dan 1$ voor 1000 emails

Kies dan gewoon SMTP in de e-mail instellingen van Azuriom en vul de SMTP-server informatie in.

## Sendmail

Als je op gedeelde webhosting zit, is Sendmail waarschijnlijk al geïnstalleerd
Op een VPS of dedicated server kan Sendmail worden geïnstalleerd met het volgende commando:
```
apt install -y sendmail
```

Kies dan gewoon Sendmail in de e-mail instellingen van Azuriom.
