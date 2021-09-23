---
title: Mails
---

# E-Mails senden

Azuriom unterstützt 2 verschiedene Methoden zum Senden von E-Mails an Benutzer: Sendmail und SMTP.

Sendmail ist einfacher zu verwenden und zu installieren, aber die Mails werden eher als Spam betrachtet.

## SMTP Server

Einige gemeinsam genutzte Webhosts bieten einen SMTP-Server, der direkt verwendet werden kann.
Ansonsten ist es möglich, selbst einen SMTP-Server zu installieren,
dies ist jedoch sehr aufwendig und es ist oft einfacher, einen dedizierten Dienst zu verwenden,
wie zum Beispiel:
* [Mailgun](https://www.mailgun.com/): 0.80$ / 1000 E-Mails
* [Amazon SES](https://aws.amazon.com/ses/): 0.10$ / 1000 E-Mails
* [Sendgrid](https://sendgrid.com/): 100 E-Mails/Tag gratis (oder 15$/Monat für 40000 E-Mails/Monat)

Wähle dann einfach SMTP in den E-Mail-Einstellungen von Azuriom und gebe die SMTP-Serverinformationen ein.

## Sendmail

Wenn Du auf Shared Webhosting bist, ist Sendmail wahrscheinlich bereits auf einem VPS oder dedizierten Server installiert, kann Sendmail mit dem folgenden Befehl installiert werden:
```
apt install sendmail
```

Wähle dann einfach Sendmail in den E-Mail-Einstellungen von Azuriom.