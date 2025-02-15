---
title: Mails
weight: 4
---

# E-Mails

Azuriom prend en charge deux méthodes différentes pour envoyer des emails aux utilisateurs : Sendmail et SMTP.
Sendmail est plus simple à installer, mais les emails envoyés via Sendmail sont plus susceptibles d'être considérés comme du spam.

## SMTP

Certains hébergeurs mutualisés fournissent un serveur SMTP qui peut être utilisé directement.
Sinon, il est possible d'installer soi-même un serveur SMTP, mais cela est compliqué,
et il est souvent plus facile d'utiliser un service dédié comme :
* [Scaleway](https://www.scaleway.com/fr/email-transactionnel-tem/) (300 emails/mois gratuitement, puis 0,25€ pour 1 000 emails)
* [Brevo](https://www.brevo.com/) (300 emails/jour gratuitement, puis 7€ par mois pour 5 000 emails)
* [MailPace](https://mailpace.com/) (3€ par mois pour 1 000 emails)
* [MailerSend](https://www.mailersend.com/) (3 000 emails gratuitement, puis 1€ pour 1 000 emails)

{{< warn >}}
Utiliser la configuration SMTP d'une adresse email personnelle, comme que Gmail ou Outlook,
n'est **pas recommandé**, car la plupart des boites mails vont considérer les emails comme spam.
{{< /warn >}}

## Sendmail

Si vous êtes sur un hébergement mutualisé, Sendmail est probablement déjà installé.
Sinon, demandez à votre hébergeur de l'installer, ou utilisez un serveur SMTP à la place.

Sur un VPS ou un serveur dédié, vous pouvez installer Sendmail avec la commande suivante :

```sh
apt install -y sendmail
```

{{< warn >}}
Sendmail augmente le risque que les emails soient considérés comme spam.
Il est recommandé d'utiliser un service de messagerie dédié à la place.
{{< /warn >}}
