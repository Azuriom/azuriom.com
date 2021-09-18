---
title: Mails
---

# Sending emails

Azuriom supports 2 different methods for sending mail to users: Sendmail and SMTP.

Sendmail is simpler to use and install, but the mails are more likely to be considered as spam.

## SMTP server

Some shared web hosts provide an SMTP server that can be used directly.
Otherwise it is possible to install an SMTP server yourself but this is very complex,
and it is often easier to use a dedicated service such as :
* [Mailgun](https://www.mailgun.com/): 0.80$ / 1000 mails
* [Amazon SES](https://aws.amazon.com/ses/): 0.10$ / 1000 emails
* [Sendgrid](https://sendgrid.com/): 100 mails/day for free (or 15$/month for 40000 mails / month)

Then simply choose SMTP in Azuriom's email settings and fill in the SMTP server information.

## Sendmail

If you are on shared web hosting, Sendmail will probably already be installed
On a VPS or dedicated server Sendmail can be installed with the following command:
```
apt install -y sendmail
```

Then simply choose Sendmail in Azuriom's email settings.
