---
title: Temas
---

# Temas

## Introdução

Um tema permite que você personalize totalmente a aparência de um site usando o Azuriom.

Para instalar um tema, basta colocá-lo na pasta `resources/themes/` na root do seu site.

{{< warn >}}
Quando o Azuriom é instalado localmente para o desenvolvimento do tema, é altamente recomendável habilitar a depuração para simplificar o desenvolvimento. Isso pode ser feito simplesmente editando essas 2 linhas no arquivo `.env`:
```
APP_ENV=local
APP_DEBUG=true
```
{{< /warn >}}

## Criando um tema

Para criar um tema rapidamente você pode usar o seguinte comando que irá gerar automaticamente o diretório do tema e o arquivo `theme.json`:
```
php artisan theme:create <theme name>
```

{{< info >}}
Para criar temas com uma configuração mais avançada com webpack para compilar arquivos SASS e otimizar os arquivos JavaScript, você pode usar este [boilerplate não oficial](https://github.com/nolway/azuriom-theme-boilerplate) (você também precisa instalar [Node.js](https://nodejs.org) com NPM)
{{< /info >}}

### Estrutura

```
themes/ <-- Pasta contendo todos os temas instalados
| example/ <-- ID do seu tema
| | theme.json <-- O arquivo principal do seu tema contendo as várias informações
| |  assets/  <-- A pasta que contém os ativos do seu tema (css, js, images, svg, etc)
| | views/ <-- A pasta que contém as visualizações do seu tema.
| | config/
| | | config.blade.php
| | | rules.php
| | config.json
```

### O arquivo theme.json

Todos os temas precisam ter um arquivo `theme.json` em sua root, que é o único elemento essencial para um tema, e fica assim:
```json
{
    "id": "example",
    "name": "Example",
    "version": "1.0.0",
    "description": "A great theme.",
    "url": "https://azuriom.com",
    "authors": [
        "Azuriom"
    ],
    "azuriom_api": "1.0.0"
}
```

#### ID do Tema

Cada tema deve ter um id, que deve ser único e conter apenas números, letras minúsculas e hífens. Recomenda-se usar o nome como base para a criação do id, por exemplo, se o nome for `Hello World`, o id pode ser `hello-world`. Além disso, o diretório do tema deve ter o mesmo nome de seu id.

### Visualizações

As visualizações são o coração de um tema, são os arquivos de conteúdo HTML de um tema para as diferentes partes do site.

Azuriom usando [Laravel](https://laravel.com/), as visualizações podem ser feitas usando o template Blade. Se você não domina o Blade, é altamente recomendável ler [sua documentação](https://laravel.com/docs/blade), especialmente porque é bastante curto.

{{< warn >}}
É altamente recomendável NÃO usar a sintaxe do PHP. Quando você trabalha com o Blade, porque o Blade não traz o tradicional sem vantagens e apenas desvantagens.
{{< /warn >}}

Do lado do CSS, é recomendável usar o framework padrão do cms que é [Bootstrap 5](https://getbootstrap.com), isso facilitará a realização de um tema e será compatível com os novos plugins. Então você não precisa fazer atualizações constantes. Mas se preferir pode usar outro framework CSS.

Em Javascript, a única dependência necessária é [Axios](https://github.com/axios/axios).

{{< info >}}
Se uma visualização não estiver presente no tema, mas estiver no CMS ou em um plugin, ela será usada automaticamente.
{{< /info >}}

#### Layout

O layout é a estrutura de todas as páginas de um tema. Ele contém de fato as metas, assets de um tema, cabeçalho, rodapé etc...

Para exibir o conteúdo da página atual, você pode usar `@yield('content')`, e para exibir o título da página atual, você pode usar `@yield('title')`.

Você também pode integrar diferentes elementos com `@include('<nome da visão>')`, por exemplo `@include('element.navbar')` para incluir a barra de navegação.

Para definir o layout da página, a visualização deve estender a visualização que contém o layout, você pode usar o layout padrão com `@extends('layouts.app')`, ou criar seu próprio layout e estendê-lo.

#### Plugin views

Para alterar as visualizações de um plugin, basta criar um diretório `plugins` na pasta `views` do tema e criar uma pasta para cada plugin (usando o id do plugin e não o nome do plugin), então adicione as views do plugin.

Por exemplo, para o plugin vote, isso dará `views/plugins/vote/index.blade.php`.

### Methods

#### Assets

Para ter o link para um asset em um tema, você pode usar a função `theme_asset`:
```html
<link rel="stylesheet" href="{{ theme_asset('css/style.css') }}">
```

#### Usuário atual

O usuário atual pode ser recuperado usando a função `auth()->user()`. Para mais detalhes sobre autenticação, você pode consultar a [documentação do Laravel](https://laravel.com/docs/authentication).

#### Funções

Você pode recuperar um certo número de parâmetros do site através das funções dedicadas:

| Função         	| Descrição                                                                                                            	 |
|-------------------|------------------------------------------------------------------------------------------------------------------------|
| `site_name()`    	| Recupera o nome do site                                                                                              	 |
| `site_logo()`    	| Permite que você tenha o link do logotipo do site                                                                      |
| `favicon()`      	| Permite que você tenha o link do favicon                                                                               |
| `format_date()`  	| Exibe uma data formatada com o idioma atual. Esta função usa uma instância de `Carbon\Carbon` como parâmetro 			 |
| `money_name()`   	| Retorna o nome da moeda do site                                                                           			 |
| `format_money()` 	| Retorna um valor formatado com a moeda do site                                                                  		 |

#### Mostrar os jogadores conectados ao servidor

Para exibir os jogadores conectados, basta verificar se a variável `$server` não é nula, e se o servidor está online, e se estiver, use `$server->getOnlinePlayers()` para recuperar a contagem de jogadores online.

```blade
@if($server && $server->isOnline())
    {{ trans_choice('messages.server.online', $server->getOnlinePlayers()) }}
@else
    {{ trans('messages.server.offline') }}
@endif
```

#### Traduções

Um tema pode, se precisar, carregar traduções.

Para isso, basta criar um arquivo `messages.php` no diretório `lang/<idioma>` (ex: `lang/en`). De um tema, você pode exibir uma tradução via trans: `{{ trans('theme::messages.hello') }}` ou via diretiva `@lang`: `@lang('theme::messages. olá')`. Você também pode usar `trans_choice` para uma tradução com números, e `trans_bool` para traduzir um booleano (retornará em inglês `Yes`)./`No`.

Para mais detalhes sobre traduções, você pode consultar a [documentação do Laravel](https://laravel.com/docs/localization).

### Configuração

Você pode adicionar uma configuração em um tema, para isso basta criar na raiz de um tema:
* Uma visualização `config/config.blade.php` contendo o formulário para a configuração.
* Um arquivo `config/rules.php` contendo as diferentes regras de validação para a configuração de um tema.
* Um arquivo `config.json` onde será armazenada a configuração do tema, contendo os valores padrão.

##### Exemplo

config.blade.php
```html
<form action="{{ route('admin.themes.update', $theme) }}" method="POST">
    @csrf

    <div class="form-group">
        <label for="discordInput">{{ trans('theme::carbon.config.discord') }}</label>
        <input type="text" class="form-control @error('discord-id') is-invalid @enderror" id="discordInput" name="discord-id" required value="{{ old('discord-id', config('theme.discord-id')) }}">

        @error('discord-id')
        <span class="invalid-feedback" role="alert"><strong>{{ $message }}</strong></span>
        @enderror
    </div>

    <button type="submit" class="btn btn-primary">
        <i class="bi bi-save"></i> {{ trans('messages.actions.save') }}
    </button>
</form>
```

config.json
```json
{
    "discord-id": "625774284823986183."
}
```
