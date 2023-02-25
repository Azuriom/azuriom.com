---
title: FAQ
weight: 3
---

# FAQ

Podem ocorrer erros, não necessariamente do CMS, mas aqui estão os erros mais comuns com suas soluções!

## A página inicial funciona, mas as outras páginas apresentam um erro 404

URL rewriting não está ativado, basta ativá-la (veja a próxima pergunta).

## Apache2 URL rewrite
Edite sua configuração do Apache2 (por padrão em `/etc/apache2/sites-available/000-default.conf`) e adicione estas linhas entre as tags `<VirtualHost>`:
```
<Directory "/var/www/html">
  AllowOverride All
</Directory>
```

Em seguida, reinicie o Apache2 com
```
service apache2 restart
```

## Nginx URL rewrite
Você tem que editar a configuração do seu site (em `/etc/nginx/sites-available/`) e adicionar `/public` no final da linha que contém `root`, assim:
```
root /var/www/html/public;
```

Em seguida, reinicie o Nginx com
```
service nginx restart
```

## Erro 500 durante o registro

Se a conta for criada corretamente apesar do erro, esse problema pode ocorrer caso o envio de e-mails não esteja configurado corretamente, para isso verifique a configuração do envio de e-mails no painel admin do seu site.

## cURL erro 60

Se você receber este erro: `curl: (60) certificado SSL: incapaz de obter o certificado do emissor local`, basta seguir estas etapas:
1) Baixe o último `cacert.pem` em https://curl.haxx.se/ca/cacert.pem
1) Adicione esta linha no php.ini (substitua `/path/to/cacert.pem` por a localização do arquivo `cacert.pem`):
   ```
   curl.cainfo="/path/to/cacert.pem""
   ```
1) Reinicie o PHP

## As imagens não são exibidas

Se as imagens carregadas no painel de administração estiverem na lista de imagens, mas não estiverem carregando, você pode tentar fazer o seguinte:
* Exclua, se existir, a pasta `public/storage` (mas não a pasta `storage`!)
* Em seguida, execute o comando `php artisan storage:link` na root do site.
	* Se você não pode executar comandos, você pode ir para a URL `/admin/settings/storage/link` em seu site.

## O arquivo não foi carregado ao carregar uma imagem

Esse problema ocorre quando você carrega uma imagem com peso maior que o máximo permitido pelo PHP (padrão 2 MB).

Você pode alterar o tamanho máximo permitido ao fazer upload na configuração do PHP (em `php.ini`) alterando os seguintes valores:
```
upload_max_filesize = 10M
post_max_size = 10M
```

{{< warn >}}
É altamente recomendável não alterar esse limite, pois imagens pesadas podem aumentar o tempo de carregamento do seu site e afetar a otimização do mecanismo de pesquisa. Em vez disso, é recomendável reduzir o tamanho da imagem (idealmente abaixo de 1 MB).
{{< /warn >}}

## Problema com AzLink ou gateways de pagamento com Cloudflare

A Cloudflare pode impedir que o AzLink ou alguns gateways de pagamento funcionem corretamente.

Para corrigir esse problema, você pode desativar o Cloudflare na API, acessando Page Rules -> Add a rule e, em seguida, adicionar `/api/*` como URL e estas ações:
* Cache Level: 'Bypass'
* Security Level: 'Medium' or 'High'
* Browser Integrity Check: 'OFF' 

Se o problema persistir, verifique também as regras do firewall.

Mais detalhes estão disponíveis no [site da Cloudflare](https://support.cloudflare.com/hc/en-us/articles/200504045-Using-Cloudflare-with-your-API).

## Forçar HTTPS no Apache2

Adicione estas linhas **logo após** `RewriteEngine On` no `.htaccess` na raiz do seu site:
```
RewriteCond %{HTTPS} off
RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI} [R,L]
```

## Votos carregam indefinidamente

Você pode habilitar a compatibilidade ipv4/ipv6 nas configurações do plugin de votação para resolver esse problema.

Se você usa Cloudflare, considere também instalar o plugin [Cloudflare Support](https://market.azuriom.com/resources/12).

## Obtenha um feed RSS ou Atom para as notícias

Um feed RSS para as notícias está disponível na URL `/api/rss` e um feed Atom em `/api/atom`.

## Altere as credenciais do banco de dados

Você pode alterar as credenciais do banco de dados editando o arquivo `.env` no root do site (pode ser necessário ativar os arquivos ocultos, então veja). Feito isso, exclua o arquivo `bootstrap/cache/config.php` se isso existe.

## Instalando outro site no Apache2

Se pretender instalar outro site (ex: painel Pterodactyl, etc.) no mesmo servidor web onde está instalado o Azuriom, é recomendável instalá-lo num subdomínio (ex: panel.seu-site.com).

Caso não seja possível, você pode configurar o Apache para executá-los no mesmo domínio, adicionando um arquivo `.htaccess` ao diretório do outro site (ex: /panel) com o seguinte conteúdo:
```
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^ - [L]
</IfModule>
``` 
