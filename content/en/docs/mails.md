---
title: Emails
weight: 4
---

# Emails

Azuriom supports two different methods for sending emails to users: Sendmail and SMTP.
Sendmail is simpler to install, but emails are more likely to be considered as spam.

## SMTP

Some shared web hosts provide an SMTP server that can be used directly.
Otherwise, it is possible to install an SMTP server yourself, but this is very complex,
and it is often easier to use a dedicated service such as:
* [Scaleway](https://www.scaleway.com/en/transactional-email-tem/) (300 emails/month for free, then 0.25€ per 1000 emails)
* [Brevo](https://www.brevo.com/) (300 emails/day for free, then $9/month for 5,000 emails)
* [MailPace](https://mailpace.com/) ($3.3/month for 1,000 emails)
* [MailerSend](https://www.mailersend.com/) (3,000 emails for free, then $1 per 1000 emails)

{{< warn >}}
Using the SMTP configuration from a personal email address, such as Gmail or Outlook, is **not recommended**, as it will be considered as spam by most mail servers.
{{< /warn >}}

## Sendmail

If you are on shared web hosting, Sendmail is probably already installed.
Otherwise, ask your hosting provider if it can be installed, or consider using an SMTP server instead.

On a VPS or dedicated server, you can install Sendmail with the following command:
```sh
apt install -y sendmail
```

{{< warn >}}
Sendmail is more likely to be considered as spam by mail servers.
A dedicated mail service is recommended instead.
{{< /warn >}}