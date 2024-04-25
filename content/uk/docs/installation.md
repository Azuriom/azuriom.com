---
title: Встановлення
weight: 1
---

# Встановлення

## Вимоги

Для роботи Azuriom просто потрібен **веб-сервер з PHP**, що має не менше **100 МБ**
дискового простору та наступні вимоги:

- PHP 8.1 чи вище
- Перезапис URL-адреси
- Дозволи на запис/читання на `storage/` та `bootstrap/cache/`.
- BCMath PHP Розширення
- Ctype PHP Розширення
- JSON PHP Розширення
- Mbstring PHP Розширення
- OpenSSL PHP Розширення
- PDO PHP Розширення
- Tokenizer PHP Розширення
- XML PHP Розширення
- XMLWriter PHP Розширення
- cURL PHP Розширення
- Zip PHP Розширення

Також настійно рекомендується мати базу даних **MySQL/MariaDB або PostgreSQL**.

## Вимоги до встановлення на сервері на базі Linux

На віртуальному хостингу вимоги, швидше за все, вже будуть встановлені,
і ви можете перейти безпосередньо до установки Azuriom.

Якщо ви використовуєте VPS або виділений сервер, ймовірно, буде необхідно встановити собі веб-сервер, PHP і MySQL.
Це можна зробити, наприклад, в Debian або Ubuntu за допомогою наступних команд

```
apt update -y && apt upgrade -y

apt install -y nginx mariadb-server zip curl lsb-release apt-transport-https ca-certificates

wget -O /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg
echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" | tee /etc/apt/sources.list.d/php.list
apt update -y
apt install -y php8.2 php8.2-fpm php8.2-mysql php8.2-pgsql php8.2-sqlite3 php8.2-bcmath php8.2-mbstring php8.2-xml php8.2-curl php8.2-zip php8.2-gd
```

MySQL (MariaDB) тепер встановлена, і ви можете створити базу даних і користувача за допомогою
наступними командами (**не забудьте замінити `<password>` на безпечний пароль!**):

```
mysql -u root
CREATE USER 'azuriom'@'127.0.0.1' IDENTIFIED BY '<password>';
CREATE DATABASE azuriom;
GRANT ALL PRIVILEGES ON azuriom.* TO 'azuriom'@'127.0.0.1' WITH GRANT OPTION;
exit
```

При установці користувачем бази даних і БД буде `azuriom`, а паролем - той, що замінює `<password>`
в наведеній вище команді.

Після встановлення вимог необхідно налаштувати веб-сервер. Пояснення доступні внизу цієї
сторінки.

{{< info >}}
При бажанні ви також можете використовувати цей неофіційний
[скрипт автоматичного встановлення](https://github.com/AzuriomCommunity/Script-AutoInstall)
який встановить всі необхідні умови автоматично.
{{< /info >}}

## Встановлення

Azuriom пропонує автоматичний інсталятор, щоб легко встановити Azuriom, виконавши ці кілька кроків:

1. Завантажити останню версію інсталятора Azuriom можна на [нашому сайті]({{< url "/download" >}}).

1. Розпакуйте архів в корені вашого сайту.

1. Встановіть права на запис/читання в корені вашого веб-сервера:

   ```
   chmod -R 755 /var/www/azuriom
   ```

   (просто замініть `/var/www/azuriom` на місцезнаходження сайту)

   Якщо поточний користувач не є користувачем веб-сервера, може виникнути необхідність змінити власника файлів:

   ```
   chown -R www-data:www-data /var/www/azuriom
   ```

   (замінити `/var/www/azuriom` на місце розташування сайту, а `www-data` на
   на користувача веб-сервера)

1. Перейдіть на свій сайт та виконайте кроки встановлення.

1. (Необов'язково) Налаштування планувальника:

   Деякі функції потребують налаштування планувальника, для цього потрібно налаштувати ваш сервер на виконання
   команду `php artisan schedule:run` щохвилини, наприклад, додавши такий запис в Cron (не забудьте
   замінити `/var/www/azuriom` на
   на місце розташування сайту):

   ```
   * * * * * cd /var/www/azuriom && php artisan schedule:run >> /dev/null 2>&1
   ```

   Це можна зробити, змінивши конфігурацію crontab за допомогою команди `crontab -e`.

{{< warn >}}
Після завершення установки, для запобігання будь-яких проблем, переконайтеся, що до вашого сайту
не можна отримати доступ безпосередньо з IP-адреси сервера (наприклад: http://0.0.0.0).
{{< /warn >}}

## Налаштування веб-сервера

### Apache2

Якщо ви використовуєте Apache2, може знадобитися увімкнути перезапис URL-адрес.

Для цього спочатку увімкніть режим "перезапис":

```
a2enmod rewrite
```

Потім потрібно змінити конфігурацію Apache2 (за замовчуванням в файлі `/etc/apache2/sites-available/000-default.conf`)
і додати наступні рядки між тегами `<VirtualHost>` (замінивши `var/www/azuriom` на розташування сайту)
щоб дозволити перезапис URL:

```
<Directory "/var/www/azuriom">
    Options FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
```

Нарешті, потрібно просто перезапустити Apache2:

```
service apache2 restart
```

## Nginx

Якщо ви розгортаєте Azuriom на сервері, який використовує Nginx, ви можете використовувати наступну конфігурацію:

```
server {
    listen 80;
    server_name example.com;
    root /var/www/azuriom/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    index index.html index.htm index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Дана конфігурація повинна бути розміщена на сайті в розділі `сайт-available`, а не в файлі
`nginx.conf`.

Тільки не забудьте замінити `example.com` на ваш домен, `/var/www/azuriom` - на
на розташування сайту (не прибираючи `/public` в кінці рядка!)
а `php8.2` на вашу версію PHP.

Нарешті, ви можете перезапустити NGINX:

```
service nginx restart
```
