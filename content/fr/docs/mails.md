---
title: Mails
---

# Envoi des mails

Azuriom supporte 2 méthodes différentes pour l’envoi des mails aux
utilisateurs : Sendmail et SMTP.

Sendmail est plus simple à utiliser et à installer, mais en contrepartie les mails
ont plus de risques d’être considérés comme étant des spams.

## Serveur SMTP

Certains hébergeurs web mutualisés fournissent un serveur SMTP qu’il est possible
d’utiliser directement.

Sinon il est possible d’installer soi-même un serveur SMTP, mais cela est très
complexe, et c'est souvent plus intéressant d’utiliser un service dédié :
* [Scaleway](https://www.scaleway.com/fr/email-transactionnel-tem/) : 3000 emails/mois gratuits, puis 1€ pour 1000 emails
* [Brevo](https://www.brevo.com/) : 300 emails/jour gratuits, puis 19€/mois pour 20k emails/mois
* [MailPace](https://mailpace.com/) : 3.3$/mois pour 1000 emails
* [MailerSend](https://www.mailersend.com/) : 3000 emails gratuits puis 1$ pour 1000 emails

Il suffit ensuite de choisir SMTP dans les paramètres mail d’Azuriom et de renseigner
les informations du serveur SMTP.

## Sendmail

Si vous êtes sur un hébergement web mutualisé, Sendmail sera probablement déjà
installé. Sur un VPS ou serveur dédié Sendmail peut être installé avec la commande suivante :
```
apt install -y sendmail
```

Il suffit ensuite de choisir Sendmail dans les paramètres mail d’Azuriom.
