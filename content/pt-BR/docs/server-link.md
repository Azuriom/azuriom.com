---
title: Server Link
weight: 2
---

# Server Link

## Minecraft

### Introdução

Alguns recursos como exibir jogadores online ou executar comandos que exigem que você conecte seu servidor ao seu site, no Azuriom isso pode ser feito de 3 maneiras diferentes:

* Por Ping - **Esta é a solução mais simples, mas também a mais limitada**, apenas permite que você conecte os jogadores ao seu servidor. _(não permite executar comandos)_

* Por Rcon - **Esta é a solução intermediária**, permite que você recupere as informações do seu servidor e execute comandos.

* Por Plugin - **Esta é a solução ótima/perfeita**, vai permitir-te ter a funcionalidade do Rcon mas com funcionalidades mais avançadas _(exemplo: um sistema de estatísticas avançado)_

### Link por Ping

Para poder ligar o seu servidor a um site na Azuriom por ping, basta adicionar um novo servidor com "Ping" como tipo de link, e preencher as informações solicitadas _(a porta padrão do Minecraft é `25565`) _.

### Link por Rcon

Para poder vincular o seu servidor ao seu site no Azuriom por Rcon, você deve:
1. Acesse o arquivo `server.properties` do seu servidor

1. Configure este arquivo da seguinte forma:
    * Defina `enable-rcon` como `true`.
    * Coloque `rcon.password` com `your-password`.
    * Defina `rcon.port` com `your-port` _(padrão 25575)_
    * Faça backup e reinicie seu servidor
   
1. Acesse seu site, adicione um novo servidor com o tipo de link "Rcon" e preencha as informações solicitadas. _(A porta Rcon padrão é 25575)_.

### Link por Plugin

#### O que é AzLink?

AzLink é um plugin de link de site para servidor especialmente projetado para e pela Azuriom. Para permitir que você conecte seu servidor ao seu site de forma simples, rápida e segura.

AzLink atualmente suporta Bukkit, BungeeCord, Sponge e Velocity no mesmo plugin. Uma versão legacy está disponível para o Bukkit 1.7.10.

#### Instalação

1. Baixe o AzLink de [nosso site]({{< url "/azlink" >}})

1. Instale-o no servidor na pasta `plugins/` (ou `mods/` com Sponge) e reinicie o servidor.

1. Vá para o seu site e adicione um novo servidor com o tipo de link "AzLink", siga as etapas do link e preencha as informações solicitadas.

## Jogos Steam

### Introdução

Esta lista inclui os servidores dos seguintes jogos: Ark, CS:GO, Garry's Mod & Team Fortress 2... Neste caso, você pode vincular seu servidor ao seu site de duas maneiras:

* Por Query - Apenas permite que você obtenha os jogadores conectados ao seu servidor. _(não permite executar comandos)_

* Por Rcon - Permite recuperar as informações do seu servidor e executar comandos.

Você pode verificar aqui as portas padrão:

| Jogo        | Porta  | Query | RCON  |
|-------------|-------|-------|-------|
| Garry's Mod | 27015 | 27015 | 27015 |
| ARK         | 7777  | 27015 | 27020 |
| CS:GO       | 27015 | 27015 | 27015 |
| TF2         | 27015 | 27015 | 27015 |

### Link por Query

Para poder linkar seu servidor a um site da Azuriom por query, basta adicionar um novo servidor com "Source Query" como tipo de ligação, e preencher a informação solicitada.

### Link por Rcon

Para poder vincular o seu servidor ao seu site no Azuriom por Rcon, você deve:

1. Acesse o arquivo onde se encontram as informações Rcon do seu servidor.
   
1. Acesse seu site, adicione um novo servidor com o tipo de link "Source Rcon" e preencha as informações solicitadas.