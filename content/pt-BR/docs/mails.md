---
title: E-mails
---

# Enviando E-mails

O Azuriom suporta 2 métodos diferentes de envio de email aos utilizadores: Sendmail e SMTP.

O Sendmail é mais simples de usar e instalar, mas é mais provável que os e-mails sejam considerados spam.

## Servidor SMTP

Alguns hosts da Web compartilhados fornecem um servidor SMTP que pode ser usado diretamente. Caso contrário, é possível instalar você mesmo um servidor SMTP, mas isso é muito complexo e geralmente é mais fácil usar um serviço dedicado, como:
* [Mailgun](https://www.mailgun.com/): 0.80$ / 1000 mails
* [Amazon SES](https://aws.amazon.com/ses/): 0.10$ / 1000 emails
* [Sendgrid](https://sendgrid.com/): 100 mails/day for free (or 15$/month for 40000 mails / month)

Depois basta escolher SMTP nas configurações de e-mail da Azuriom e preencher as informações do servidor SMTP.

## Sendmail

Se você estiver em hospedagem compartilhada, o Sendmail provavelmente já estará instalado. Em uma VPS ou servidor dedicado, o Sendmail pode ser instalado com o seguinte comando:
```
apt install -y sendmail
```

Depois basta escolher Sendmail nas configurações de email da Azuriom.