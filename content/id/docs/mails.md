---
title: Mail
---

# Mengirim email

Azuriom mendukung 2 metode berbeda untuk mengirimkan sebuah email ke pengguna: Sendmail dan SMTP.

Sendmail sangat mudah untuk digunakan dan dinstall, tapi suratnya akan ditandai sebagai spam.

## Server SMTP

Beberapa web host memberikan sebuah server SMTP yang bisa digunakan secara langsung.
Jika tidak, anda bisa menginstall sebuah server SMTP anda sendiri tapi ini akan menjadi sangat rumit,
dan ini lebih mudah untuk menggunakan sebuah layanan berdedikasi seperti :
* [Mailgun](https://www.mailgun.com/): 0.80$ / 1000 surat
* [Amazon SES](https://aws.amazon.com/ses/): 0.10$ / 1000 surat
* [Sendgrid](https://sendgrid.com/): 100 surat/hari dengan gratis (atau 15$/bulan untuk 40000 surat / bulan)

Lalu pilih SMTP di setelan email Azuriom dan isi informasi server SMTP.

## Sendmail

Jika anda ada pada web hosting yang dibagi, Sendmail kemungkinan sudah di install
Di sebuah VPS atau server Sendmail sendiri bisa diinstall dengan perintah sebagai berikut:
```
apt install -y sendmail
```

Lalu pilih Sendmail di setelan email Azuriom.
