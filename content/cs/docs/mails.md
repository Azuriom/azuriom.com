---
title: E-maily
---

# Odesílání e-mailů

Azuriom podporuje 2 různé způsoby posílání e-mailů uživatelům: Sendmail a SMTP.

Sendmail je jednodušší k použití a instalaci, ale je větší pravděpodobnost, že budou e-maily brány jako spam.

## SMTP server

Některé sdílené webové hostingy poskytují SMTP server, který může být použit přímo.
Jinak je možné nainstalovat si SMTP server sám, což je ale velmi komplikovaný proces
a je většinou jednodušší použít dedikovanou službu jako:
* [Mailgun](https://www.mailgun.com/): 0.80$ / 1000 e-mailů
* [Amazon SES](https://aws.amazon.com/ses/): 0.10$ / 1000 e-mailů
* [Sendgrid](https://sendgrid.com/): 100 e-mailů / den zdarma (nebo 15$/měsíc pro 40 000 e-mailů / měsíc)

Poté jednoduše vyberte SMTP v e-mailových nastaveních Azuriomu a vyplňte informace o SMTP serveru.

## Sendmail

Pokud používáte sdílený webhosting, Sendmail již nejspíše bude nainstalován.
Na VPS nebo dedikovaném serveru může být Sendmail nainstalován následujícím příkazem:
```
apt install -y sendmail
```

Poté jednoduše vyberte Sendmail v e-mailových nastaveních Azuriomu.
