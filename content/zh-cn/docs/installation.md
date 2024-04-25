---
title: 安装
weight: 1
---

# 安装

## 环境要求

要使 Azuriom 正常工作, 你至少需要一个**带有 PHP 的 Web 服务器** 并且拥有至少 **100 MB**
的硬盘存储以及以下要求:

- PHP 8.1 或更高
- 启用 URL 重写
- 对 `storage/` 和 `bootstrap/cache/` 目录的读写权限.
- BCMath PHP 拓展
- Ctype PHP 拓展
- JSON PHP 拓展
- Mbstring PHP 拓展
- OpenSSL PHP 拓展
- PDO PHP 拓展
- Tokenizer PHP 拓展
- XML PHP 拓展
- XMLWriter PHP 拓展
- cURL PHP 拓展
- Zip PHP 拓展

我们还强烈建议你有一个 **MySQL/MariaDB 或 PostgreSQL 数据库**.

## 在基于 Linux 的服务器上的安装要求

在共享的虚拟主机上, 很可能已经安装了这些依赖.
你可以直接安装 Azuriom

如果你使用的是 VPS 或专用服务器，可能需要自己安装一个 Web 服务器, PHP 和 MySQL.
例如，在 Debian 或 Ubuntu 下可以通过以下命令完成环境的安装

```
apt update -y && apt upgrade -y

apt install -y nginx mariadb-server zip curl lsb-release apt-transport-https ca-certificates

wget -O /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg
echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" | tee /etc/apt/sources.list.d/php.list
apt update -y
apt install -y php8.2 php8.2-fpm php8.2-mysql php8.2-pgsql php8.2-sqlite3 php8.2-bcmath php8.2-mbstring php8.2-xml php8.2-curl php8.2-zip php8.2-gd
```

MySQL (MariaDB) 现在已经安装了, 随后你可以使用以下命令创建数据库和密码 (**`密码` 请使用你自己的密码替换!!**):

```
mysql -u root
CREATE USER 'azuriom'@'127.0.0.1' IDENTIFIED BY '密码';
CREATE DATABASE azuriom;
GRANT ALL PRIVILEGES ON azuriom.* TO 'azuriom'@'127.0.0.1' WITH GRANT OPTION;
exit
```

经过以上一番操作, 将会创建一个名为 `azuriom` 的数据库且密码为 `密码`

这些要求安装后, 你需要配置 Web 服务器. 本页底部有解释.

{{< info >}}
如果你懒你还可以用
[一键安装脚本](https://github.com/AzuriomCommunity/Script-AutoInstall)
自动安装所有所需的环境.
{{< /info >}}

## 安装

Azuriom 提供了一个自动安装程序，只要按照以下几个步骤即可轻松安装:

1. 在[我们的网站]({{< url "/download" >}})下载最新版本的 Azuriom 安装程序.

1. 解压到你的网站根目录.

1. 为你的网站根目录设置 读/写 权限:

   ```
   chmod -R 755 /var/www/azuriom
   ```

   (将 `/var/www/azuriom` 替代为你实际的网站目录)

   如果当前用户不是 Web 服务器用户, 可能需要改变文件的所有者:

   ```
   chown -R www-data:www-data /var/www/azuriom
   ```

   (将 `/var/www/azuriom` 替代为你实际的网站目录, `www-data` 替代为你实际的用户名)

1. 进入你的网站并按照其中的步骤进行安装.

1. (可选) 添加计划任务:

   一些功能需要计划任务实现, 所以你需要添加一个计划任务
   以每分钟执行一次 `php artisan schedule:run`, 例如通过添加这个 Cron 条目 (别忘了
   替换 `/var/www/azuriom`
   为你实际的网站目录):

   ```
   * * * * * cd /var/www/azuriom && php artisan schedule:run >> /dev/null 2>&1
   ```

   可以使用命令 `crontab -e` 完成此修改.

{{< warn >}}
一旦安装完成, 为防止出现任何问题, 确保你的网站
不能直接使用服务器的 IP 访问. (例如: http://0.0.0.0).
{{< /warn >}}

## Web 服务器配置

### Apache2

如果你使用 Apache2, 可能需要启用 URL 重写.

要这么做, 请先启用 "rewrite" 模块:

```
a2enmod rewrite
```

然后你需要修改 Apache2 配置文件 (一般在 `/etc/apache2/sites-available/000-default.conf`)
并在 `<VirtualHost>` 标签之间添加以下内容 (替换 `var/www/azuriom` 为你实际的网站目录)
以启用 URL 重写:

```
<Directory "/var/www/azuriom">
    Options FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
```

最后, 你只需要重启 Apache2:

```
service apache2 restart
```

## Nginx

如果你在使用 Nginx 的服务器上部署 Azuriom, 你可以使用以下配置:

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

这个配置必须放在网站的 `site-available` 中, 而不是放在 `nginx.conf` 中.

记得替换 `example.com` 为你的实际域名, `/var/www/azuriom`
为你实际的网站目录 (不要移除后面的 `/public`!)
`php8.2` 为你的 PHP 版本.

最后, 重启 NGINX:

```
service nginx restart
```
