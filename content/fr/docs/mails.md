---
title: Mails
---

# Envoi des mails

Azuriom supporte 2 méthodes différentes pour l’envoi des mails aux
utilisateurs : Sendmail et SMTP.

Sendmail est plus simple à utiliser et à installer mais en contrepartie les mails
ont plus de risques d’être considérés comme étant des spams.

## Serveur SMTP

Certains hébergeurs web mutualisés fournissent un serveur SMTP qu’il est possible
d’utiliser directement.

Sinon il est possible d’installer soi-même un serveur SMTP mais cela est très
complexe, et c'est souvent plus intéressant d’utiliser un service dédié :
* [Mailgun](https://www.mailgun.com/) : 0.80$ / 1000 mails
* [Amazon SES](https://aws.amazon.com/fr/ses/) : 0.10$ / 1000 mails
* [Sendgrid](https://sendgrid.com/) : 100 mails / jour gratuitement (ou 15$ / mois pour 40000 mails / mois)

Il suffit ensuite de choisir SMTP dans les paramètres mail d’Azuriom et de renseigner
les informations du serveur SMTP.

## Sendmail

Si vous êtes sur un hébergement web mutualisés, Sendmail sera probablement déjà
installé. Sur un VPS ou serveur dédié Sendmail peut être installé avec la commande suivante :
```
apt install -y sendmail
```

Il suffit ensuite de choisir Sendmail dans les paramètres mail d’Azuriom.
