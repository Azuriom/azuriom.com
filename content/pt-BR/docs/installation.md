---
title: Instalação
weight: 1
---

# Instalação

## Requisitos

Para funcionar, Azuriom simplesmente requer um **Servidor Web com PHP** com pelo menos **100 MB** de espaço em disco e os seguintes requisitos:

- PHP 8.1 ou superior
- URL Rewrite
- Permissões de Gravação/Leitura em `storage/` e `bootstrap/cache/`.
- Extensão PHP BCMath
- Extensão PHP Ctype
- Extensão PHP JSON
- Extensão PHP Mbstring
- Extensão PHP OpenSSL
- Extensão PHP PDO
- Extensão PHP Tokenizer
- Extensão PHP XML
- Extensão PHP XMLWriter
- Extensão PHP cURL
- Extensão PHP Zip

Também é altamente recomendável ter um banco de dados **MySQL/MariaDB ou PostgreSQL**.

## Requisitos de instalação em um servidor baseado em Linux

Em uma hospedagem compartilhada, provavelmente já haverá requisitos instalados e você pode continuar diretamente para a instalação do Azuriom.

Se você estiver usando um VPS ou um servidor dedicado, provavelmente será necessário instalar você mesmo um servidor web, PHP e MySQL. Isso pode ser feito, por exemplo, no Debian ou Ubuntu com os seguintes comandos

```
apt update -y && apt upgrade -y

apt install -y nginx mariadb-server zip curl lsb-release apt-transport-https ca-certificates

wget -O /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg
echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" | tee /etc/apt/sources.list.d/php.list
apt update -y
apt install -y php8.2 php8.2-fpm php8.2-mysql php8.2-pgsql php8.2-sqlite3 php8.2-bcmath php8.2-mbstring php8.2-xml php8.2-curl php8.2-zip php8.2-gd
```

O MySQL (MariaDB) agora está instalado e você pode criar um banco de dados e um usuário com os seguintes comandos (**lembre-se de substituir `<password>` por um password seguro!**):

```
mysql -u root
CREATE USER 'azuriom'@'127.0.0.1' IDENTIFIED BY '<password>';
CREATE DATABASE azuriom;
GRANT ALL PRIVILEGES ON azuriom.* TO 'azuriom'@'127.0.0.1' WITH GRANT OPTION;
exit
```

Durante a instalação, o banco de dados e o usuário do banco de dados serão `azuriom` e o password será aquela que substitui `<password>` no comando acima.

Uma vez instalados os requisitos, você deve configurar o servidor web. As explicações estão disponíveis na parte inferior desta página.

{{< info >}}
Se preferir, você também pode usar este [script de instalação automática](https://github.com/AzuriomCommunity/Script-AutoInstall) _não oficial_ que instalará todos os pré-requisitos automaticamente.
{{< /info >}}

## Instalação

O Azuriom oferece um instalador automático para instalar o Azuriom facilmente seguindo estes poucos passos:

1. Baixe a versão mais recente do instalador Azuriom em [nosso site]({{< url "/download" >}}).

1. Extraia o arquivo no root do seu site.

1. Defina as permissões de gravação/leitura para a raiz do seu servidor web:

   ```
   chmod -R 755 /var/www/azuriom
   ```

   (basta substituir `/var/www/azuriom` pela localização do site)

   Se o usuário atual não for o usuário do servidor web, pode ser necessário alterar o proprietário dos arquivos:

   ```
   chown -R www-data:www-data /var/www/azuriom
   ```

   (substitua `/var/www/azuriom` pela localização do site e `www-data` pelo usuário do servidor web)

1. Acesse no seu site e siga as etapas de instalação.

1. (Opcional) Configure o agendador:

   Alguns recursos precisam que o agendador esteja configurado, para isso você precisa configurar seu servidor para executar o comando `php artisan schedule:run` a cada minuto, por exemplo, adicionando esta entrada Cron (não se esqueça de substituir `/var/www/azuriom` com a localização do site):

   ```
   * * * * * cd /var/www/azuriom && php artisan schedule:run >> /dev/null 2>&1
   ```

   Isso pode ser feito modificando a configuração do crontab com o comando `crontab -e`.

{{< warn >}}
Uma vez concluída a instalação, para evitar problemas, certifique-se de que seu site não pode ser acessado diretamente do IP do servidor (ex: http://0.0.0.0).
{{< /warn >}}

## Configuração do servidor web

### Apache2

Se você estiver usando o Apache2, pode ser necessário habilitar a URL Rewrite.

Para fazer isso, primeiro habilite o mod "rewrite":

```
a2enmod rewrite
```

Então você precisa modificar a configuração do Apache2 (por padrão no arquivo `/etc/apache2/sites-available/000-default.conf`) e adicionar as seguintes linhas entre as tags `<VirtualHost>` (substituindo `var/www/azuriom` por local do site) para permitir URL Rewrite:

```
<Directory "/var/www/azuriom">
    Options FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
```

Finalmente, você só precisa reiniciar o Apache2:

```
service apache2 restart
```

## Nginx

Se você estiver implantando o Azuriom em um servidor que usa Nginx, poderá usar a seguinte configuração:

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

Esta configuração deve ser colocada em um site em `site-available` e não no `nginx.conf`.

Apenas lembre-se de substituir `example.com` pelo seu domínio, `/var/www/azuriom` pela localização do site (sem remover o `/public` no final da linha!) e `php8.2` por sua versão do PHP.

Finalmente, você pode reiniciar o NGINX:

```
service nginx restart
```
