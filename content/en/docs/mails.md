---
title: Mails
---

# Sending emails

Azuriom supports 2 different methods for sending mail to users: Sendmail and SMTP.

Sendmail is simpler to use and install, but the mails are more likely to be considered as spam.

## SMTP server

Some shared web hosts provide an SMTP server that can be used directly.
Otherwise, it is possible to install an SMTP server yourself but this is very complex,
and it is often easier to use a dedicated service such as :
* [Scaleway](https://www.scaleway.com/en/transactional-email-tem/): 3,000 emails/month for free, then 1€ for 1000 emails
* [Brevo](https://www.brevo.com/): 300 emails/day for free, then 25$/month for 20k emails/month
* [MailPace](https://mailpace.com/): 3.3$/month for 1,000 emails
* [MailerSend](https://www.mailersend.com/): 3,000 emails for free, then 1$ for 1000 emails

Then simply choose SMTP in Azuriom's email settings and fill in the SMTP server information.

## Sendmail

If you are on shared web hosting, Sendmail will probably already be installed
On a VPS or dedicated server Sendmail can be installed with the following command:
```
apt install -y sendmail
```

Then simply choose Sendmail in Azuriom's email settings.
