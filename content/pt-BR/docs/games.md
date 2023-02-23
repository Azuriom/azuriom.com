---
title: Jogos Personalizados
---

# Adicionar suporte para um novo jogo

## Requisitos

- Um acesso a um terminal para executar comandos como `php -v` e estar um pouco familiarizado com a programação

Se você tiver o Azuriom instalado, pode pular para a etapa de configuração.

Se você nunca instalou Azuriom, você precisa instalá-lo. Durante a instalação, ele solicitará que você escolha um jogo.

Você navegará até a URL `/install/game/custom`. Com isso em mente, agora você pode seguir as instruções de instalação.

Uma vez instalado o Azuriom, você pode executar o seguinte comando em um terminal para criar um usuário administrador:
```
php artisan user:create --admin
```

## Configurando

Você pode executar o seguinte comando para gerar o layout do projeto para o seu jogo, com `MyNewGame` o nome do seu jogo:
```
php artisan game:create MyNewGame
```

## Conectando Azuriom a um jogo

### Usando banco de dados personalizado

Vá para `plugins/mynewgame/src/Providers/MyNewGameServiceProvider.php` e edite o arquivo

Em `use Azuriom\Extensions\Plugin\BasePluginServiceProvider;` cole `use Illuminate\Support\Facades\DB;`

Agora localize o método `boot` e em `$this->registerUserNavigation();` adicione `$this->setupDatabaseConnection();`

Agora você pode colar a função abaixo logo abaixo do `}` do método de boot:

```php
protected function setupDatabaseConnection()
{
    $driver = 'mysql'; // Can also be pgsql, sqlsrv
    $config = config('database.connections.'.$driver);

    /**
     * To use credentials in the .env file, you can use your plugin's config file.
     * in plugins/mynewgame/config/azuriom_mynewgame.php, you will see by default only one 'custom_config' key,
     * but you can add more like: 'CUSTOM_DB_ADDRESS' => env('CUSTOM_DB_ADDRESS', '127.0.0.1')
     * 
     * To access it: config('azuriom_mynewgame.CUSTOM_DB_ADDRESS');
     * 
     */ 
    $config['host'] = config('azuriom_mynewgame.CUSTOM_DB_ADDRESS');
    $config['port'] = config('azuriom_mynewgame.CUSTOM_DB_PORT');
    $config['username'] = config('azuriom_mynewgame.CUSTOM_DB_USER');
    $config['password'] = config('azuriom_mynewgame.CUSTOM_DB_PASSWORD');
    $config['database'] = config('azuriom_mynewgame.CUSTOM_DB_DATABASE');

    config(['database.connections.my-custom-connection' => $config]);
    DB::purge();
}
```

Agora você pode criar seu primeiro modelo usando sua conexão de banco de dados do jogo. Vá para `plugins/mynewgame/src/Models`, crie um novo arquivo `Character.php` e adicione o seguinte código:

```php
<?php

namespace Azuriom\Plugin\MyNewGame\Models;

use Illuminate\Database\Eloquent\Model;

class Character extends Model
{
    protected $connection = 'my-custom-connection';
}
```

Agora edite `plugins/mynewgame/src/Controllers/Admin/AdminController.php` e em `use Azuriom\Http\Controllers\Controller;`, adicione `use Azuriom\Plugin\MyNewGame\Models\Character;`

Em seguida, substitua a função `index` por:

```php
public function index()
{
    $characters = Character::paginate();
    return view('mynewgame::admin.index', ['characters' => $characters]);
}
```

Agora, para mostrar os caracteres em seu menu de administração, edite `plugins/mynewgame/resources/views/admin/index.blade.php` e substitua `<p>Esta é a página de administração do seu plugin</p>` por:

```php
@foreach($characters as $character)
    <p>{{$character->name}}</p> {{-- "name" can be any properties from you database --}}
@endforeach

{{ $characters->links() }}
```

### Usando Rcon/API e/ou para executar comandos

Vá para `plugins/mynewgame/src/Games/MyNewGameServerBridge.php` e dê uma olhada no conteúdo.

Para ter um exemplo do mundo real, você pode dar uma olhada em:
- [Jogo Dofus](https://github.com/Javdu10/Game-Dofus129/blob/main/src/Game/DofusServerBridge.php) que usa uma conexão SSL para enviar comandos para o servidor do jogo
- [Jogo Flyff](https://github.com/AzuriomCommunity/Game-Flyff/blob/master/src/Games/FlyffServerBridge.php) que usa uma codificação personalizada e proteção com uma senha. (Também envia itens para o banco de dados como mecanismos de fallback).

Dentro do método `sendCommands()`, você deve controlar se um jogador está conectado no jogo ou não e tomar as ações apropriadas como [aqui no jogo flyff](https://github.com/AzuriomCommunity/Game-Flyff/blob/v0.2.8/src/Games/FlyffServerBridge.php#L76).